import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register all necessary components for Chart.js
Chart.register(...registerables);

const CloudFilter = ({ onFilterChange }) => {
  // State to hold the cloud threshold value, default is 15%
  const [cloudThreshold, setCloudThreshold] = useState(15);
  // Reference to hold the chart instance
  const chartRef = useRef(null);

  // Handler for when the threshold value changes
  const handleThresholdChange = (e) => {
    const value = e.target.value;
    setCloudThreshold(value);
    // Call the parent component's function to apply the filter
    onFilterChange(value);
  };

  // Effect to create and update the chart whenever the cloudThreshold changes
  useEffect(() => {
    // Destroy the previous chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Get the context of the canvas element we want to select
    const ctx = document.getElementById('myChart').getContext('2d');
    // Create a new chart instance
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

    // Cleanup function to destroy the chart instance when the component unmounts or before re-rendering
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [cloudThreshold]); // Dependency array includes cloudThreshold

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
