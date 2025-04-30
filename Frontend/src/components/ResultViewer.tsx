// components/ResultViewer.tsx
import React from 'react';

interface ResultViewerProps {
  processingType: string;
  result: any; // Type depends on your API response
  isLoading: boolean;
}

const ResultViewer: React.FC<ResultViewerProps> = ({ processingType, result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4">Processing your document...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-8">
        <p>No results available</p>
      </div>
    );
  }

  const renderResult = () => {
    switch (processingType) {
      case 'summarize':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Document Summary</h3>
            <div className="prose max-w-none">
              {result.summary ? (
                <p>{result.summary}</p>
              ) : (
                <p>No summary available</p>
              )}
            </div>
          </div>
        );

      case 'metadata':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Document Metadata</h3>
            <div className="grid grid-cols-1 gap-2">
              {result.metadata ? (
                Object.entries(result.metadata).map(([key, value]) => (
                  <div key={key} className="py-2 border-b border-gray-200">
                    <span className="font-medium">{key}: </span>
                    <span className="text-gray-700">{String(value)}</span>
                  </div>
                ))
              ) : (
                <p>No metadata available</p>
              )}
            </div>
          </div>
        );

      case 'classify':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Document Classification</h3>
            <div className="space-y-4">
              {result.classifications ? (
                <div>
                  <div className="font-medium mb-2">Document Categories:</div>
                  <ul className="list-disc list-inside">
                    {result.classifications.map((cls: any, index: number) => (
                      <li key={index} className="py-1">
                        <span className="font-medium">{cls.category}: </span>
                        <span className="text-gray-700">{(cls.confidence * 100).toFixed(2)}% confidence</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No classification results available</p>
              )}
            </div>
          </div>
        );

      default:
        return <p>Unknown processing type</p>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {renderResult()}
    </div>
  );
};

export default ResultViewer;