// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} Document Processing Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;