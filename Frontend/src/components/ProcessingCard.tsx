// components/ProcessingCard.tsx
import React from 'react';

interface ProcessingCardProps {
  title: string;
  description: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
}

const ProcessingCard: React.FC<ProcessingCardProps> = ({
  title,
  description,
  icon,
  selected,
  onClick
}) => {
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all 
        ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
      onClick={onClick}
    >
      <div className="flex items-center mb-2">
        <div className="text-2xl mr-3">{icon}</div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default ProcessingCard;