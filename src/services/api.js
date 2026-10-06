import axios from "axios";

const api = axios.create({
  baseURL: "https://portfolio-cms-backend-8k6y.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
