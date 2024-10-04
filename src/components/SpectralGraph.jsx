import { Line } from 'react-chartjs-2';

const SpectralGraph = ({ data }) => {
  const chartData = {
    labels: data.bands,
    datasets: [{
      label: 'Spectral Signature',
      data: data.values
    }]
  };

  return <Line data={chartData} />;
};

export default SpectralGraph;
