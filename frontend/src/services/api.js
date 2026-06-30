import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

export const predictMood = (data) => API.post("/predict", data);

export const getHistory = () => API.get("/history");

export const getInsight = () => API.get("/insight");

export default API;