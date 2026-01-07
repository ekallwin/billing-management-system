import axios from 'axios';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    if (error.response && error.response.status === 401) {
        try {
            await signOut(auth);
            window.location.href = '/login';
        } catch (e) {
            console.error("Error signing out", e);
        }
    }
    return Promise.reject(error);
});

export default api;
