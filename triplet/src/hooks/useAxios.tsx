import { useEffect, useState } from 'react';
import axiosInstance from '../services/axios';

const useAxios = (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance({
          url,
          method,
          data: body,
        });
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, method, body]);

  return { data, loading, error };
};

export default useAxios;
