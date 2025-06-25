import { useState, useEffect } from 'react';

export const useAPI = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock API call for development
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock response based on URL
        let mockData = {};
        if (url.includes('pallets')) {
          mockData = { pallets: [], total: 0 };
        } else if (url.includes('warehouse')) {
          mockData = { locations: [], areas: [] };
        }
        
        setData(mockData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error };
};

export default useAPI;