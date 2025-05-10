import os
from typing import Dict, Any
import datetime


def extract_metadata(file_path: str, file_extension: str) -> Dict[str, Any]:
    """
    Extract metadata from the document.

    Parameters:
    file_path (str): Path to the document file
    file_extension (str): File extension (.pdf, .doc, .docx, .txt)

    Returns:
    Dict[str, Any]: Metadata extraction result
    """
    # Get basic file information
    file_stats = os.stat(file_path)
    filename = os.path.basename(file_path)

    return {"metadata": {
        "filename": filename,
        "file_size_bytes": file_stats.st_size,
        "file_size_kb": round(file_stats.st_size / 1024, 2),
        "created_time": datetime.datetime.fromtimestamp(file_stats.st_ctime).isoformat(),
        "modified_time": datetime.datetime.fromtimestamp(file_stats.st_mtime).isoformat(),
        "file_type": file_extension.lstrip('.').upper(),
    }}
