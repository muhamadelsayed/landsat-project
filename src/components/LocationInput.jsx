import React, { useState } from 'react';

const LocationInput = ({ onLocationChange }) => {
    const [locationType, setLocationType] = useState('name'); // 'name' or 'coordinates'
    const [placeName, setPlaceName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    // Handle change for place name
    const handlePlaceNameChange = (e) => {
        setPlaceName(e.target.value);
        onLocationChange({ type: 'name', value: e.target.value });
    };

    // Handle change for coordinates
    const handleLatitudeChange = (e) => {
        setLatitude(e.target.value);
        onLocationChange({ type: 'coordinates', lat: e.target.value, lng: longitude });
    };

    const handleLongitudeChange = (e) => {
        setLongitude(e.target.value);
        onLocationChange({ type: 'coordinates', lat: latitude, lng: e.target.value });
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Select Target Location</h3>
            <div className="flex space-x-4">
                <label className="flex items-center">
                    <input
                        type="radio"
                        value="name"
                        checked={locationType === 'name'}
                        onChange={() => setLocationType('name')}
                        className="form-radio"
                    />
                    <span className="ml-2">Place Name</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="radio"
                        value="coordinates"
                        checked={locationType === 'coordinates'}
                        onChange={() => setLocationType('coordinates')}
                        className="form-radio"
                    />
                    <span className="ml-2">Latitude/Longitude</span>
                </label>
            </div>

            {locationType === 'name' && (
                <div className="space-y-2">
                    <label htmlFor="placeName" className="block text-sm font-medium text-gray-700">Place Name:</label>
                    <input
                        id="placeName"
                        type="text"
                        value={placeName}
                        onChange={handlePlaceNameChange}
                        placeholder="Enter a place name"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            )}

            {locationType === 'coordinates' && (
                <div className="space-y-2">
                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude:</label>
                    <input
                        id="latitude"
                        type="number"
                        value={latitude}
                        onChange={handleLatitudeChange}
                        placeholder="Enter latitude"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude:</label>
                    <input
                        id="longitude"
                        type="number"
                        value={longitude}
                        onChange={handleLongitudeChange}
                        placeholder="Enter longitude"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            )}
        </div>
    );
};

export default LocationInput;
