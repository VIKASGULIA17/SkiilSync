"""
Security utilities for password hashing and JWT token creation.
Uses hashlib for secure, dependency-free password hashing and pyjwt for JSON Web Tokens.
"""

from datetime import datetime, timedelta, timezone
import hashlib
import logging
import os
from typing import Optional

import jwt

from app.config import settings

logger = logging.getLogger(__name__)


def hash_password(password: str) -> str:
    """Hash a password using PBKDF2 with SHA-256 and a random salt."""
    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        100000,  # 100k iterations
    )
    return f"{salt.hex()}:{key.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hashed representation."""
    try:
        if not hashed_password or ":" not in hashed_password:
            return False
        salt_hex, key_hex = hashed_password.split(":")
        salt = bytes.fromhex(salt_hex)
        key = bytes.fromhex(key_hex)
        
        new_key = hashlib.pbkdf2_hmac(
            "sha256",
            plain_password.encode("utf-8"),
            salt,
            100000,
        )
        return new_key == key
    except Exception as exc:
        logger.error("Password verification error: %s", exc)
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT access token containing the provided data."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    # exp claim must be an integer epoch timestamp
    to_encode.update({"exp": int(expire.timestamp())})
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT access token. Returns payload if valid, otherwise None."""
    try:
        # Strip Bearer prefix if present
        if token.startswith("Bearer "):
            token = token[7:]
            
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except jwt.ExpiredSignatureError:
        logger.debug("JWT token has expired.")
        return None
    except jwt.PyJWTError as exc:
        logger.debug("JWT token decoding failed: %s", exc)
        return None
