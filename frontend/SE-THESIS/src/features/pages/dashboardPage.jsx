// !Libraries
import { useState, useEffect } from "react";
// !Componenets
import { checkFirstTime } from "../../shared/services/authService";
import { socket } from "../../shared/services/socketService.js";
// import { getRooms } from "../../shared/services/roomService.js";
import { useRooms } from "../../context/roomContext.jsx";
import { useCamera } from "../../context/cameraContext.jsx";
import { getDevice } from "../../shared/services/deviceService.js";

export default function dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showGuide, setShowGuide] = useState(false);
  const { rooms } = useRooms();
  const emptyRooms = rooms.filter((room) => room.room_occupants > 0).length;
  const vacantRoom = rooms.filter((room) => room.room_occupants === 0).length;
  const { startCamera, startFrameCapture } = useCamera();
  const [availableCameras, setAvailableCameras] = useState([]);

  useEffect(() => {
    const handleConnect = () => console.log("Socket connected!", socket.id);

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, []);

  useEffect(() => {
    if (!rooms.length || !availableCameras.length) return;

    async function initializeAllRoomCameras() {
      try {
        for (const room of rooms) {
          const devices = await getDevice(room._id);

          if (!devices.length) {
            console.log("No saved device for room:", room.room_name);
            continue;
          }

          const savedDevice = devices[0];

          const matchedCamera = availableCameras.find(
            (cam) => cam.label === savedDevice.device_label,
          );

          if (!matchedCamera) {
            console.warn(
              "No matching browser camera for room:",
              room.room_name,
              savedDevice.device_label,
            );
            continue;
          }

          console.log(
            "INITIALIZING CAMERA:",
            room.room_name,
            matchedCamera.label,
          );

          await startCamera(room._id, matchedCamera.deviceId);
          startFrameCapture(room._id);
        }
      } catch (err) {
        console.error("Error initializing room cameras:", err);
      }
    }

    initializeAllRoomCameras();
  }, [rooms, availableCameras]);
  
  useEffect(() => {
    async function loadAvailableCameras() {
      try {
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        const devices = await navigator.mediaDevices.enumerateDevices();

        const videoInputs = devices.filter(
          (device) => device.kind === "videoinput",
        );

        setAvailableCameras(videoInputs);
        console.log("AVAILABLE CAMERAS:", videoInputs);
      } catch (err) {
        console.error("Error loading available cameras:", err);
      }
    }

    loadAvailableCameras();
  }, []);

  useEffect(() => {
    // getRooms();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Listen for new rooms in real-time
    const handleNewRoom = (room) => setRooms((prev) => [...prev, room]);
    socket.on("roomAdded", handleNewRoom);

    return () => {
      socket.off("roomAdded", handleNewRoom);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="w-full h-full bg-[#E4E3E1]">
      <section className="relative w-full h-full flex flex-col gap-6">
        <div className="w-full flex flex-row items-end justify-between text-[#1E1E1E] opacity-75">
          <h1 className="text-subheader font-bold">Dashboard</h1>
          <h2 className="text-subtitle">
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            |{" "}
            {currentTime.toLocaleDateString([], {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </h2>
        </div>

        <div className="relative w-full h-[30vh] flex flex-row items-center justify-start gap-6 font-bold">
          <div className="flex flex-col items-start gap-4 primary-text">
            <h2 className="text-title">Occupied Rooms</h2>
            <div className="w-[20vw] aspect-video rounded-2xl shadow-outside-dropshadow flex justify-center items-center text-header">
              {emptyRooms}
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 primary-text">
            <h2 className="text-title">Vacant Rooms</h2>
            <div className="w-[20vw] aspect-video rounded-2xl shadow-outside-dropshadow flex justify-center items-center text-header">
              {vacantRoom}
            </div>
          </div>
          <div className="flex flex-col w-full h-full items-start gap-4 primary-text">
            <h2 className="text-title">Activity History</h2>
            <div className="w-full h-full rounded-2xl shadow-outside-dropshadow"></div>
          </div>
        </div>

        <div className="relative w-full h-full flex flex-col gap-4">
          <h1 className="text-title primary-text font-bold">
            Classroom Status
          </h1>
          <div className="w-full h-full rounded-2xl shadow-outside-dropshadow"></div>
        </div>
      </section>
    </div>
  );
}
