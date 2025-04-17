import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:"https://gamegpt-backend.onrender.com",
    headers: {
        "Content-Type": "application/json",
      }
})