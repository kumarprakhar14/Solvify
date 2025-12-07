// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
});

export const googleAuth = (code) =>
  api.get(`/api/auth/google?code=${code}`);

export default api;
