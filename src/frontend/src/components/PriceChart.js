import React from 'react';
import { Line } from 'react-chartjs-2';

const PriceChart = ({ historicalData }) => {
  const data = {
    labels: historicalData.map(data => new Date(data.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Bitcoin Price',
        data: historicalData.map(data => data.price),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mt-4">
      <h2 className="text-2xl font-bold text-gray-800">Historical Price Chart</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default PriceChart;