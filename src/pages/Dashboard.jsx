import React, { useState } from 'react';
import MapView from '../components/MapView';
import NotificationSettings from '../components/NotificationSettings';
import CloudFilter from '../components/CloudFilter';
import SpectralGraph from '../components/SpectralGraph';
import SceneMetadata from '../components/SceneMetadata';
import DataExport from '../components/DataExport';
import { useUserContext } from '../context/UserContext';

// Dashboard component definition
const Dashboard = () => {
  // Destructure cloudThreshold and setCloudThreshold from the UserContext
  const { cloudThreshold, setCloudThreshold } = useUserContext();

  // Function to handle changes in the cloud filter
  const handleFilterChange = (value) => {
    setCloudThreshold(value); // Update the cloud threshold value in the context
    console.log(`Cloud filter changed to: ${value}%`); // Log the new value to the console
  };

  // Sample spectral data for the SpectralGraph component
  const spectralData = {
    bands: ['Band 1', 'Band 2', 'Band 3', 'Band 4'], // Names of spectral bands
    values: [10, 20, 30, 40] // Corresponding values for each band
  };

  // Data formatted for export, combining band names and values
  const dataForExport = [
    ['Band', 'Value'], // Header row
    ...spectralData.bands.map((band, index) => [band, spectralData.values[index]]) // Data rows
  ];

  // Metadata for the SceneMetadata component
  const sceneMetadata = {
    satellite: 'Landsat 8', // Name of the satellite
    date: '2023-10-01', // Date of the scene
    cloudCover: '10%', // Cloud cover percentage
    path: '123', // Path number
    row: '45' // Row number
  };

  // GeoJSON data for the MapView component
  const geoJsonData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point', // Geometry type is Point
          coordinates: [-0.09, 51.505] // Coordinates of the point
        },
        properties: {
          name: 'Sample Point' // Name property of the point
        }
      }
    ]
  };

  // Render the Dashboard component
  return (
    <div>
      {/* MapView component to display the map with geoJsonData */}
      <MapView geoJsonData={geoJsonData} />
      {/* NotificationSettings component to manage notification settings */}
      <NotificationSettings />
      {/* CloudFilter component to filter data based on cloud cover */}
      <CloudFilter onFilterChange={handleFilterChange} />
      {/* SpectralGraph component to display spectral data */}
      <SpectralGraph data={spectralData} />
      {/* SceneMetadata component to display metadata of the scene */}
      <SceneMetadata metadata={sceneMetadata} />
      {/* DataExport component to export data */}
      <DataExport data={dataForExport} />
    </div>
  );
};

// Export the Dashboard component as the default export
export default Dashboard;