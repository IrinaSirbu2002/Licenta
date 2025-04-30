// pages/ResultsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProcessingResult } from '../services/api';
import ResultViewer from '../components/ResultViewer';

const ResultsPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [result, setResult] = useState<any>(null);
  const [processingType, setProcessingType] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchResult = async () => {
      if (!documentId) return;

      try {
        setIsLoading(true);
        const data = await getProcessingResult(documentId);
        setResult(data.result);
        setProcessingType(data.processing_type);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load processing results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [documentId]);

  const renderProcessingTypeTitle = () => {
    switch (processingType) {
      case 'summarize':
        return 'Document Summary';
      case 'metadata':
        return 'Document Metadata';
      case 'classify':
        return 'Document Classification';
      default:
        return 'Processing Results';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          to="/process"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to Processing
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{renderProcessingTypeTitle()}</h1>
        <p className="text-gray-600">
          {isLoading
            ? 'Processing your document...'
            : 'View the results of your document processing'}
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <ResultViewer
          processingType={processingType}
          result={result}
          isLoading={isLoading}
        />
      )}

      <div className="mt-8 text-center">
        <Link
          to="/process"
          className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
        >
          Process Another Document
        </Link>
      </div>
    </div>
  );
};

export default ResultsPage;