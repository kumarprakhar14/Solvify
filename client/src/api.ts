// src/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const googleAuth = async (code) => {
  return api.get(`/api/auth/google?code=${code}`);
}

export default api;
