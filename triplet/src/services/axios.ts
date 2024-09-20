import axios from 'axios';

const axiosInstance = axios.create({
    baseURL : 'http://localhost:8080',
    timeout : 10000,
    withCredentials : true,
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

        if (error.response && error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            try {
                await axiosInstance.post('/api/v1/reissue', null, { withCredentials : true });
                return axiosInstance(originalRequest);
            }catch (err){
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

export {};