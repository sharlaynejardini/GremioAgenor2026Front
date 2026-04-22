// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gremio-agenor2026back.vercel.app/',
});

export default api;
