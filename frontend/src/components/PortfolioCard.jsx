import React from 'react';

const PortfolioCard = ({ Icon, title, description, linkText, link }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center flex flex-col items-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <Icon size={28} className="text-blue-600" />
      </div>

      <h3 className="text-2xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-4 text-center">{description}</p>

      <a
        href={link || '#'}
        className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors duration-300"
      >
        {linkText}
      </a>
    </div>
  );
};

export default PortfolioCard;
