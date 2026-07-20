"""
Authentication routes for SkillSync.

POST /api/auth/signup -> Register a new user
POST /api/auth/login  -> Verify credentials and return JWT token
GET  /api/auth/me     -> Retrieve the current user's profile
"""

import logging
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.database import get_db
from app.schema import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
)

from app.models import User , UserProfile

from app.services.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

security_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Dependency that extracts the JWT from the Authorization header and returns the User."""
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    email: str = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session token format is invalid.",
        )
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user account no longer exists.",
        )
    return user


@router.post("/signup", response_model=TokenResponse)
async def signup(body: UserCreate, db: Session = Depends(get_db)) -> TokenResponse:
    """Create a new user account and return the initial JWT access token."""
    email = body.email.strip().lower()
    full_name = body.full_name.strip()
    password = body.password
    
    if not email or "@" not in email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid email address.",
        )
    if len(password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long.",
        )
    if not full_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Full name cannot be empty.",
        )
        
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )
        
    # Hash password and store user
    hashed = hash_password(password)
    new_user = User(
        email=email,
        hashed_password=hashed,
        full_name=full_name,
        profile= UserProfile()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate token
    token = create_access_token(data={"sub": new_user.email})
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user),
    )


@router.post("/login", response_model=TokenResponse)
async def login(body: UserLogin, db: Session = Depends(get_db)) -> TokenResponse:
    """Authenticate credentials and return a signed JWT token."""
    email = body.email.strip().lower()
    password = body.password
    
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
        
    token = create_access_token(data={"sub": user.email})
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    """Return the currently logged-in user's profile details."""
    return UserResponse.model_validate(current_user)


@router.get("/is_admin")
def isAdmin(current_user:User = Depends(get_current_user))-> bool:
    """Checks if the current user is admin or not"""

    isAdminCheck= "admin" in current_user.role
    return isAdminCheck

@router.get("/is_user")
def isUser(current_user:User = Depends(get_current_user))-> bool:
    """Checks if the current user is admin or not"""
    isUserCheck= "user" in current_user.role
    return isUserCheck


@router.get("/get_all_users", response_model=list[UserResponse])
def get_all_users(isAdmin:bool= Depends(isAdmin),db: Session=Depends(get_db)) ->list[UserResponse]:

    if(isAdmin):

        #command to fetch all the users
        allUsers = list(db.query(User).filter(User.role == "user"))

        if(len(allUsers)==0):
            return []
        else:
            return allUsers
        

@router.get("/get_all_admins", response_model=list[UserResponse])
def get_all_admind(isAdmin:bool= Depends(isAdmin),db: Session=Depends(get_db)) ->list[UserResponse]:

    if(isAdmin):

        #command to fetch all the users
        allAdmins = list(db.query(User).filter(User.role == "admin"))

        if(len(allAdmins)==0):
            return []
        else:
            return allAdmins

    