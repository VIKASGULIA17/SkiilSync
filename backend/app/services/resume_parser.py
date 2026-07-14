"""
Resume PDF parser and skill extractor.

Reads PDF bytes, extracts plain text, and matches skills from a keyword list.
"""

import re
import string
import unicodedata
from typing import List, Set


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract plain text from a PDF file provided as raw bytes.
    """
    if not file_bytes:
        raise ValueError("Cannot parse an empty file. Please upload a valid PDF.")

    try:
        import fitz  # PyMuPDF
    except ImportError as exc:
        raise RuntimeError(
            "PyMuPDF is required for PDF parsing. Install it with: pip install PyMuPDF"
        ) from exc

    try:
        text = ""
        with fitz.open(stream=file_bytes, filetype="pdf") as doc:
            if doc.page_count == 0:
                raise ValueError("The PDF file contains no pages.")
            for page in doc:
                text += page.get_text()
        if not text.strip():
            raise ValueError("No text could be extracted from the PDF.")
        return text
    except ValueError:
        raise
    except Exception as exc:
        raise ValueError(f"Failed to read the PDF file: {exc}") from exc


def extract_text_from_docx(file_bytes: bytes) -> str:
    """
    Extract plain text from a DOCX file using built-in zipfile and XML parser.
    """
    import io
    import zipfile
    import xml.etree.ElementTree as ET

    if not file_bytes:
        raise ValueError("Cannot parse an empty file. Please upload a valid DOCX.")

    try:
        with zipfile.ZipFile(io.BytesIO(file_bytes)) as docx:
            namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            document_xml = docx.read('word/document.xml')
            root = ET.fromstring(document_xml)
            
            paragraphs = []
            for para in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                texts = [node.text for node in para.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text]
                if texts:
                    paragraphs.append("".join(texts))
            
            text = "\n".join(paragraphs)
            if not text.strip():
                raise ValueError("No text could be extracted from the DOCX file.")
            return text
    except ValueError:
        raise
    except Exception as exc:
        raise ValueError(f"Failed to read DOCX file: {exc}") from exc


def extract_text_from_doc(file_bytes: bytes) -> str:
    """
    Extract text runs from legacy binary DOC files using printable characters extraction.
    """
    if not file_bytes:
        raise ValueError("Cannot parse an empty file. Please upload a valid DOC.")

    try:
        text_decoded = file_bytes.decode('latin1', errors='ignore')
        words = re.findall(r'[a-zA-Z0-9\s\.,\-:;@\(\)\'\"]{4,}', text_decoded)
        clean_words = []
        for word in words:
            if not word.strip():
                continue
            if len(word) > 500:
                continue
            clean_words.append(word.strip())
        
        text = " ".join(clean_words)
        if not text.strip():
            raise ValueError("No text could be extracted from the DOC file.")
        return text
    except Exception as exc:
        raise ValueError(f"Failed to read DOC file: {exc}") from exc


def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    """
    Router to parse text based on file extension.
    """
    ext = filename.split('.')[-1].lower() if '.' in filename else ''
    
    if ext == 'pdf':
        return extract_text_from_pdf(file_bytes)
    elif ext == 'docx':
        return extract_text_from_docx(file_bytes)
    elif ext == 'doc':
        return extract_text_from_doc(file_bytes)
    else:
        # Fallback to UTF-8 text decoding
        try:
            return file_bytes.decode('utf-8')
        except Exception:
            return file_bytes.decode('latin1', errors='ignore')


def preprocess_text(text: str) -> str:
    """
    Normalise text for keyword matching.

    * lowercases
    * unicode-normalises (NFKD)
    * strips punctuation
    * collapses whitespace
    """
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = unicodedata.normalize("NFKD", text)
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_skills(text: str, keywords: Set[str] | List[str]) -> List[str]:
    """
    Return the subset of *keywords* that appear in *text* (word-boundary match).

    Args:
        text: Raw resume / document text.
        keywords: Iterable of skill keywords to search for.

    Returns:
        De-duplicated list of matched keywords (original casing preserved).
    """
    text_processed = preprocess_text(text)
    matched: set[str] = set()
    for word in keywords:
        clean_word = preprocess_text(word)
        if clean_word and re.search(r"\b" + re.escape(clean_word) + r"\b", text_processed):
            matched.add(word)
    return list(matched)
