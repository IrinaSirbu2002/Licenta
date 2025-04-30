// services/api.ts
import axios from 'axios';

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your FastAPI backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response types
export interface DocumentResponse {
  document_id: string;
  filename: string;
  status: string;
  created_at: string;
}

export interface ProcessingResultResponse {
  document_id: string;
  processing_type: string;
  status: string;
  result: any; // Type depends on processing type
  created_at: string;
}

// Upload document and start processing
export const uploadDocument = async (file: File, processingType: string): Promise<DocumentResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  // Add processing type as a query parameter
  const response = await api.post(`/api/documents/upload?processing_type=${processingType}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Get processing result
export const getProcessingResult = async (documentId: string): Promise<ProcessingResultResponse> => {
  const response = await api.get(`/api/processing/results/${documentId}`);
  return response.data;
};

// Get document list
export const getDocuments = async (): Promise<DocumentResponse[]> => {
  const response = await api.get('/api/documents');
  return response.data.documents;
};

export default api;