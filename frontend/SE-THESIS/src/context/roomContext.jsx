import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../shared/services/socketService";
import { getRooms } from "../shared/services/roomService";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const token = localStorage.getItem("token");

  const resetRooms = () => {
    setRooms([]);
  };

  const fetchRooms = async () => {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRooms();
    const handleNewRoom = (room) => {
      setRooms((prev) => {
        const exists = prev.some((r) => r._id === room._id);
        if (exists) return prev;
        return [...prev, room];
      });
    };

    socket.on("roomAdded", handleNewRoom);

    return () => {
      socket.off("roomAdded", handleNewRoom);
    };
  }, []);

  return (
    <RoomContext.Provider value={{ rooms, setRooms, fetchRooms, resetRooms }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRooms = () => useContext(RoomContext);
