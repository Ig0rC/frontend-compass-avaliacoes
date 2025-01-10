import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://compass-platform-7f04be208f7d.herokuapp.com',
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
