import React, { useState } from 'react';
import MapView from '../components/MapView';
import NotificationSettings from '../components/NotificationSettings';
import CloudFilter from '../components/CloudFilter';
import SpectralGraph from '../components/SpectralGraph';
import SceneMetadata from '../components/SceneMetadata';
import DataExport from '../components/DataExport';

const Dashboard = () => {
  const [cloudThreshold, setCloudThreshold] = useState(15); // Default is 15%

  const handleFilterChange = (value) => {
    setCloudThreshold(value);
    // Add any additional logic to handle the cloud filter change
    console.log(`Cloud filter changed to: ${value}%`);
  };

  const spectralData = {
    bands: ['Band 1', 'Band 2', 'Band 3', 'Band 4'],
    values: [10, 20, 30, 40]
  };

  const dataForExport = [
    ['Band', 'Value'],
    ...spectralData.bands.map((band, index) => [band, spectralData.values[index]])
  ];

  const sceneMetadata = {
    satellite: 'Landsat 8',
    date: '2023-10-01',
    cloudCover: '10%',
    path: '123',
    row: '45'
  };

  const geoJsonData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-0.09, 51.505]
        },
        properties: {
          name: 'Sample Point'
        }
      }
    ]
  };

  return (
    <div>
      <MapView geoJsonData={geoJsonData} />
      <NotificationSettings />
      <CloudFilter onFilterChange={handleFilterChange} />
      <SpectralGraph data={spectralData} />
      <SceneMetadata metadata={sceneMetadata} />
      <DataExport data={dataForExport} />
    </div>
  );
};

export default Dashboard;