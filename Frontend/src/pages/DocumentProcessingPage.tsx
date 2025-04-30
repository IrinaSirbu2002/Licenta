// pages/DocumentProcessingPage.tsx
import React from 'react';
import DocumentUploader from '../components/DocumentUploader';

const DocumentProcessingPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Process Your Document</h1>
        <p className="text-gray-600">
          Upload a document and select the type of processing you need
        </p>
      </div>

      <DocumentUploader />

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">Supported File Types</h3>
        <ul className="list-disc list-inside text-gray-700">
          <li>PDF documents (.pdf)</li>
          <li>Microsoft Word documents (.doc, .docx)</li>
          <li>Text files (.txt)</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentProcessingPage;