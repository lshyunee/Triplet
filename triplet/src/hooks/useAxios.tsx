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
  const [trigger, setTrigger] = useState<number>(0); // refetch를 위한 트리거
  const [hasError, setHasError] = useState<boolean>(false); // 오류 상태 추가

  const fetchData = async () => {
    setLoading(true);
    setHasError(false); // 오류 초기화
    try {
      const response = await axiosInstance({
        url,
        method,
        data: body,
        headers,
      });
      setData(response.data);
      setStatus(response.status);
      setError(null); // 오류 없을 때는 null로 설정
    } catch (err: any) {
      setError(err);
      setHasError(true); // 오류 상태 설정
      if (err.response) {
        setStatus(err.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 오류 상태일 때 요청을 중단하여 무한 요청 방지
    if (!hasError) {
      fetchData();
    }
  }, [url, method, body, trigger]); // trigger가 변경될 때마다 useEffect 실행

  // refetch 함수 정의
  const refetch = () => {
    setTrigger(prev => prev + 1); // trigger 값을 변경하여 useEffect를 트리거
  };

  return { data, loading, error, status, refetch };
};

export default useAxios;
