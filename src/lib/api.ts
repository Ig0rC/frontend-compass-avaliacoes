import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
})

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      localStorage.removeItem("accessToken");
    }
  }
)
