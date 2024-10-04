import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register all necessary components
Chart.register(...registerables);

const CloudFilter = ({ onFilterChange }) => {
  const [cloudThreshold, setCloudThreshold] = useState(15); // Default is 15%
  const chartRef = useRef(null);

  const handleThresholdChange = (e) => {
    const value = e.target.value;
    setCloudThreshold(value);
    onFilterChange(value); // Call the parent component's function to apply the filter
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'My First dataset',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [0, 10, 5, 2, 20, 30, 45],
        }]
      },
      options: {}
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [cloudThreshold]);

  return (
    <div>
      <label htmlFor="cloud-filter">Max Cloud Cover Percentage:</label>
      <input
        id="cloud-filter"
        type="range"
        min="0"
        max="100"
        value={cloudThreshold}
        onChange={handleThresholdChange}
      />
      <span>{cloudThreshold}%</span>
      <canvas id="myChart"></canvas>
    </div>
  );
};

export default CloudFilter;
