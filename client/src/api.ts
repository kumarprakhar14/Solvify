// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  withCredentials: true,
});

export const googleAuth = (code) =>
  api.get(`/auth/google?code=${code}`);

export default api;
