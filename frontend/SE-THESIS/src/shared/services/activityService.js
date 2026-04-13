import axiosClient from "../api/axiosClient.api";

export const recordActivity = async (activityData) => {
  console.log("Recording activity with data:", activityData);
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized: Unknown user");
    const response = await axiosClient.post("/activity/add", activityData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const listActivity = async (roomId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized: Unknown user");
    const response = await axiosClient.get(`/activity/list/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};