import { useEffect, useState } from 'react';
import axiosInstance from '../services/axios';

const useAxios = (
  url: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE', 
  params?: any, // GET 요청을 위한 params
  body?: any,   // POST, PUT, DELETE 요청을 위한 body
  headers = {}
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [status, setStatus] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance({
        url,
        method,
        ...(method === 'GET' ? { params } : { data: body instanceof FormData ? body : JSON.stringify(body) }),
        headers: body instanceof FormData 
          ? { ...headers } 
          : { 'Content-Type': 'application/json', ...headers }, 
      });
      setData(response.data);
      setStatus(response.status);
      setError(null); // 오류 없을 때는 null로 설정
    } catch (err: any) {
      setData(null);
      setError(err);
      if (err.response) {
        setStatus(err.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  // refetch 함수 정의
  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, status, refetch };
};

export default useAxios;