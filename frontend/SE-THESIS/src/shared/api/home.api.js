// frontend/SE-THESIS/src/shared/api/home.api.js
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const getHomeMessage = async () => {
  const res = await axios.get(SERVER_URL + "/home");
  return res.data.message;
};

export const getPeopleCount = async () => {
  const res = await axios.get(DET_URL, {
    params: {
      image_path: "/sample2.jpg",
    },
  });
  return res.data;
};

