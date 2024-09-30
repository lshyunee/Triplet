import { useEffect, useState } from 'react';
import axiosInstance from '../services/axios';

const useAxios = (
  url: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE', 
  body?: any, 
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
        ...(body ? { data: body } : {}), // GET 요청 시 body를 보내지 않도록 처리
        headers,
      });
      setData(response.data);
      setStatus(response.status);
      setError(null); // 성공 시 오류 초기화
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

  useEffect(() => {
    // 컴포넌트 마운트 시 자동으로 fetchData 호출
    fetchData();
  }, [url, method, body, headers]);

  // refetch 함수 정의
  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, status, refetch };
};

export default useAxios;
