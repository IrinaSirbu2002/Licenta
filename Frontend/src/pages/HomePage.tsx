// pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Document Processing Platform</h1>
        <p className="text-xl text-gray-600">
          Upload your documents and choose from multiple processing options
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-5xl mb-4 text-blue-500">📄</div>
          <h2 className="text-xl font-bold mb-2">Document Summarization</h2>
          <p className="text-gray-600 mb-4">
            Extract the most important information from your documents automatically.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-5xl mb-4 text-blue-500">🔍</div>
          <h2 className="text-xl font-bold mb-2">Metadata Extraction</h2>
          <p className="text-gray-600 mb-4">
            Identify and extract key metadata from your documents, including authors, dates, and topics.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-5xl mb-4 text-blue-500">🏷️</div>
          <h2 className="text-xl font-bold mb-2">Document Classification</h2>
          <p className="text-gray-600 mb-4">
            Automatically categorize your documents based on their content.
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/process"
          className="inline-block bg-blue-600 text-white py-3 px-8 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Start Processing Documents
        </Link>
      </div>
    </div>
  );
};

export default HomePage;