import React, { useState } from 'react';

const AlertForm = ({ onSubmit }) => {
  const [threshold, setThreshold] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(threshold);
    setThreshold('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 mt-4">
      <h2 className="text-2xl font-bold text-gray-800">Set Price Alert</h2>
      <div className="mt-2">
        <label className="block text-gray-700">Alert Threshold ($):</label>
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <button
        type="submit"
        className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Set Alert
      </button>
    </form>
  );
};

export default AlertForm;