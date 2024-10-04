import { useState, useEffect } from 'react';
import { fetchLandsatData } from '../services/landsatApi';

const useLandsatData = (location) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchLandsatData(location);
      setData(result);
    };
    getData();
  }, [location]);

  return data;
};

export default useLandsatData;
