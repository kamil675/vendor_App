import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vendor-backend-1-jzk6.onrender.com/api',
  timeout: 15000,
});

export default api;
