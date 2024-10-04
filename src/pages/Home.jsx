// ParentComponent.jsx
import React, { useState } from 'react';
import LocationInput from '../components/LocationInput'; // Importing a custom component for location input
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'; // Importing components from react-leaflet for map functionality
import 'leaflet/dist/leaflet.css'; // Importing Leaflet CSS for map styling
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook from react-router-dom for navigation

// LocationSelector component to handle map click events and display a marker
const LocationSelector = ({ onLocationChange }) => {
    const [position, setPosition] = useState(null); // State to store the selected position

    // Hook to handle map events
    useMapEvents({
        click(e) {
            setPosition(e.latlng); // Update position state with the clicked location
            onLocationChange(e.latlng); // Call the parent callback with the new location
        },
    });

    // Render a marker if a position is selected, otherwise render nothing
    return position === null ? null : (
        <Marker position={position}></Marker>
    );
};

// ParentComponent to manage the overall functionality
const ParentComponent = () => {
    const navigate = useNavigate(); // Hook to navigate programmatically
    const [selectedLocation, setSelectedLocation] = useState(null); // State to store the selected location

    // Callback to handle location selection
    const handleLocationSelect = (latlng) => {
        console.log('Selected location:', latlng); // Log the selected location
        setSelectedLocation(latlng); // Update the selected location state
    };

    // Function to navigate to the dashboard
    const handleDashboardClick = () => {
        navigate('/dashboard'); // Navigate to the dashboard route
    };

    // Function to handle location submission
    const handleSubmitLocation = () => {
        if (selectedLocation) {
            console.log('Submitting location:', selectedLocation); // Log the location being submitted
            // Add your submit logic here
        } else {
            alert('Please select a location first.'); // Alert if no location is selected
        }
    };

    return (
        <div>
            <LocationInput onLocationChange={handleLocationSelect} /> {/* Custom component for location input */}
            <div className="flex justify-between mt-4">
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                    onClick={handleDashboardClick}
                >
                    Go to Dashboard {/* Button to navigate to the dashboard */}
                </button>
                <button
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                    onClick={handleSubmitLocation}
                >
                    Submit Location {/* Button to submit the selected location */}
                </button>
            </div>
            <MapContainer
                center={[51.505, -0.09]} // Initial center of the map
                zoom={13} // Initial zoom level
                style={{ height: '400px', width: '100%', marginTop: '20px' }} // Styling for the map container
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // URL for the tile layer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' // Attribution for the tile layer
                />
                <LocationSelector onLocationChange={handleLocationSelect} /> {/* Component to handle location selection on the map */}
            </MapContainer>
        </div>
    );
};

export default ParentComponent; // Exporting the ParentComponent as default