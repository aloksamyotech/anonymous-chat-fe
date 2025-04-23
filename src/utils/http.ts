import axios from 'axios';
import { getToken } from './getToken';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(
  (config) => {
    const token = getToken();
    config.headers.Authorization = `Bearer ${token ? token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwicm9sZSI6IlVzZXIifQ.FB-AquYlL3ZRPitAcjfgSZm_q2Tk0PlHM8E5t075r08'}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default http;
