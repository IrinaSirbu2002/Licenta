# backend/app.py
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional, List, Dict, Any
import uvicorn
import uuid
import os
import shutil
from datetime import datetime
import json

# Import processing modules
from processing.summarizer.processor import summarize_document
from processing.metadata.processor import extract_metadata
from processing.classifier.processor import classify_document

app = FastAPI(title="Document Processing API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default port
        "http://localhost:3000",  # React default port
        "http://127.0.0.1:5173",  # Alternative localhost
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Storage paths
UPLOAD_DIR = "uploads"
RESULTS_DIR = "results"

# Create directories if they don't exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

# In-memory database for documents (could be replaced with a real DB)
documents_db = {}


def save_result_to_file(document_id: str, result_data: Dict[str, Any]):
    """Save processing result to a JSON file in the results directory."""
    result_file_path = os.path.join(RESULTS_DIR, f"{document_id}.json")
    with open(result_file_path, "w") as f:
        json.dump(result_data, f, indent=2)
    return result_file_path


def load_result_from_file(document_id: str) -> Optional[Dict[str, Any]]:
    """Load processing result from a JSON file."""
    result_file_path = os.path.join(RESULTS_DIR, f"{document_id}.json")
    if os.path.exists(result_file_path):
        with open(result_file_path, "r") as f:
            return json.load(f)
    return None


@app.post("/api/documents/upload")
async def upload_document(
        file: UploadFile = File(...),
        processing_type: str = "summarize",
        background_tasks: BackgroundTasks = None
):
    # Generate unique ID for the document
    document_id = str(uuid.uuid4())

    # Save the uploaded file
    file_path = os.path.join(UPLOAD_DIR, f"{document_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Store document info
    documents_db[document_id] = {
        "document_id": document_id,
        "filename": file.filename,
        "file_path": file_path,
        "status": "processing",
        "created_at": datetime.now().isoformat(),
    }

    # Start background processing
    if background_tasks:
        background_tasks.add_task(
            process_document, document_id, file_path, processing_type
        )
    else:
        # Process immediately (for testing/development)
        await process_document(document_id, file_path, processing_type)

    return {
        "document_id": document_id,
        "filename": file.filename,
        "status": "processing",
        "created_at": documents_db[document_id]["created_at"],
    }


async def process_document(document_id: str, file_path: str, processing_type: str):
    """Process the document based on the selected processing type."""
    result = None

    try:
        # Determine file type by extension
        file_extension = os.path.splitext(file_path)[1].lower()

        if processing_type == "summarize":
            result = summarize_document(file_path, file_extension)
        elif processing_type == "metadata":
            result = extract_metadata(file_path, file_extension)
        elif processing_type == "classify":
            result = classify_document(file_path, file_extension)
        else:
            raise ValueError(f"Unsupported processing type: {processing_type}")

        # Update document status
        if document_id in documents_db:
            documents_db[document_id]["status"] = "completed"

        # Create result data
        result_data = {
            "document_id": document_id,
            "processing_type": processing_type,
            "status": "completed",
            "result": result,
            "created_at": datetime.now().isoformat(),
        }

        # Save result to file
        result_file_path = save_result_to_file(document_id, result_data)

        # Also store the file path in the document info
        if document_id in documents_db:
            documents_db[document_id]["result_file"] = result_file_path

    except Exception as e:
        # Handle processing error
        if document_id in documents_db:
            documents_db[document_id]["status"] = "failed"

        # Create error result data
        result_data = {
            "document_id": document_id,
            "processing_type": processing_type,
            "status": "failed",
            "error": str(e),
            "created_at": datetime.now().isoformat(),
        }

        # Save error result to file
        save_result_to_file(document_id, result_data)

        print(f"Error processing document {document_id}: {e}")


@app.get("/api/processing/results/{document_id}")
async def get_processing_result(document_id: str):
    """Retrieve the processing result for a document."""
    # First try to load from file
    result_data = load_result_from_file(document_id)

    if result_data:
        return result_data

    # If no result file, check if document exists
    if document_id in documents_db:
        return {
            "document_id": document_id,
            "processing_type": "",
            "status": documents_db[document_id]["status"],
            "result": None,
            "created_at": documents_db[document_id]["created_at"],
        }

    raise HTTPException(status_code=404, detail="Document not found")


@app.get("/api/documents")
async def get_documents():
    """Retrieve all documents."""
    documents = list(documents_db.values())
    return {"documents": documents}


# Optional: Endpoint to directly get the result file path
@app.get("/api/documents/{document_id}/result-file")
async def get_result_file_path(document_id: str):
    """Get the path to the result file for a document."""
    if document_id in documents_db and "result_file" in documents_db[document_id]:
        return {"result_file": documents_db[document_id]["result_file"]}

    # Check if result file exists
    result_file_path = os.path.join(RESULTS_DIR, f"{document_id}.json")
    if os.path.exists(result_file_path):
        return {"result_file": result_file_path}

    raise HTTPException(status_code=404, detail="Result file not found")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)