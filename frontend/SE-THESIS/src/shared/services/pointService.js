import axiosClient from "../api/axiosClient.api";

export const addPoints = async (pointData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized: Unknown user");
    }
    const response = await axiosClient.post("/points/add", pointData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
