
export const logoutUser = (navigate, resetRooms, socket) => {
  resetRooms();
  localStorage.removeItem("token");
  socket.disconnect()
  navigate("/iris/login");
};