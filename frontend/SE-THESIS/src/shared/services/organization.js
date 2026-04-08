import axiosClient from "../api/axiosClient.api";

export const addOrganization = async (orgData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized: Unknown user");
    }
    const response = await axiosClient.post("/organization/addOrganization", orgData, {
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

export const getOrganization = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Unauthorized: Unknown user");
    }
    const response = await axiosClient.get("/organization/getOrganization", {
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