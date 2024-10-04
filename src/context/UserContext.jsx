import React, { createContext, useContext, useState } from 'react';

// Create a Context for the user settings
const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  // Global state for user settings
  const [location, setLocation] = useState(null); // Default user location is null
  const [cloudThreshold, setCloudThreshold] = useState(15); // Default cloud coverage threshold
  const [notificationSettings, setNotificationSettings] = useState({
    leadTime: 24, // Default lead time is 24 hours
    method: 'Email', // Default notification method
  });

  // Context values that will be passed to consuming components
  const value = {
    location,
    setLocation,
    cloudThreshold,
    setCloudThreshold,
    notificationSettings,
    setNotificationSettings,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
