import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://j11b202.p.ssafy.io/api/v1',
    timeout: 10000,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러 처리: 토큰이 만료되었을 가능성
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;  // 재시도를 방지하는 플래그
            try {
                // 토큰 재발급 요청
                const reissueResponse = await axiosInstance.post('/reissue');
                
                // 토큰 재발급이 성공하면 새로운 토큰을 저장 (예: 로컬 스토리지나 상태에 저장)
                const newAccessToken = reissueResponse.data.accessToken;

                // 새로운 토큰을 Authorization 헤더에 추가
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                // 원래의 요청을 재시도
                return axiosInstance(originalRequest);
            } catch (reissueError) {
                // reissue 요청이 실패하면 로그인 페이지로 리다이렉트하거나 에러 처리
                console.error('Token reissue failed', reissueError);
                return Promise.reject(reissueError);  // 재시도하지 않고 에러 반환
            }
        }
        
        // 다른 에러는 그대로 처리
        return Promise.reject(error);
    }
);

export default axiosInstance;
