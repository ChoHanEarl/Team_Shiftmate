import axios from 'axios';
import { getMemoryToken } from '../store/authStore';

const axiosInstance = axios.create({
    baseURL: 'https://shiftmate.site',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true, // 쿠키 기반 확장 시 대비
});

axiosInstance.interceptors.request.use((config) => {
    const token = getMemoryToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;