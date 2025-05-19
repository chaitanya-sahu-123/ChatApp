import axios from 'axios';


export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE==='development'? "http://localhost:3000/api/login":'/api/login',
    // baseURL: '/api/login',
    withCredentials: true,
  });
