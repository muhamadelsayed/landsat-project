import axios from 'axios';

export const fetchLandsatData = async (location) => {
  const response = await axios.get(`/api/landsat-data?lat=${location.lat}&lng=${location.lng}`);
  return response.data;
};
