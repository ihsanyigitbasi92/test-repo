import React from 'react';

const PriceDisplay = ({ price }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-bold text-gray-800">Current Bitcoin Price</h2>
      <p className="text-xl text-gray-600">${price}</p>
    </div>
  );
};

export default PriceDisplay;