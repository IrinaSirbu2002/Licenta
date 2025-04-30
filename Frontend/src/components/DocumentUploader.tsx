// components/DocumentUploader.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadDocument } from '../services/api';

const DocumentUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [processingType, setProcessingType] = useState<string>('summarize');
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);

    try {
      const response = await uploadDocument(file, processingType);
      // Navigate to results page
      navigate(`/results/${response.document_id}`);
    } catch (err) {
      setError('Failed to upload document. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Document</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-2">
            Select Document
          </label>
          <input
            type="file"
            id="document"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
            accept=".pdf,.doc,.docx,.txt"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Processing Type
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="summarize"
                type="radio"
                name="processingType"
                value="summarize"
                checked={processingType === 'summarize'}
                onChange={() => setProcessingType('summarize')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="summarize" className="ml-3 block text-sm font-medium text-gray-700">
                Summarization
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="metadata"
                type="radio"
                name="processingType"
                value="metadata"
                checked={processingType === 'metadata'}
                onChange={() => setProcessingType('metadata')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="metadata" className="ml-3 block text-sm font-medium text-gray-700">
                Extract Metadata
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="classify"
                type="radio"
                name="processingType"
                value="classify"
                checked={processingType === 'classify'}
                onChange={() => setProcessingType('classify')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="classify" className="ml-3 block text-sm font-medium text-gray-700">
                Classification
              </label>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isUploading ? 'Processing...' : 'Upload & Process'}
        </button>
      </form>
    </div>
  );
};

export default DocumentUploader;