import axios from "axios";

const api = axios.create({
    baseURL: "https://mern-backend-0wzw.onrender.com/",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
