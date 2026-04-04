// !Libraries
import { useState, useEffect } from "react";
// !Componenets
import { checkFirstTime } from "../../shared/services/authService";
import { socket } from "../../shared/services/socketService.js";
// import { getRooms } from "../../shared/services/roomService.js";
import { useRooms } from "../../context/roomContext.jsx";
import { useCamera } from "../../context/cameraContext.jsx";
import { useActivity } from "../../context/activityContext.jsx";
import { getDevice } from "../../shared/services/deviceService.js";

export default function dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showGuide, setShowGuide] = useState(false);
  const { rooms } = useRooms();
  const { activities } = useActivity();
  const emptyRooms = rooms.filter((room) => room.room_occupants > 0).length;
  const vacantRoom = rooms.filter((room) => room.room_occupants === 0).length;
  const { startCamera, startFrameCapture } = useCamera();
  const [availableCameras, setAvailableCameras] = useState([]);
  
  // Get 5 most recent activities
  const recentActivities = activities.slice(0, 5);

  const renderActivityMessage = (activity) => {
    // Handle old message format for backward compatibility
    if (activity.message) {
      // Match patterns like: Fans in "classroom 3" have been turned on
      const deviceMatch = activity.message.match(/(Fans|Lights)/i);
      const roomMatch = activity.message.match(/["']([^"']+)["']/);
      const actionMatch = activity.message.match(/(turned on|turned off|have been turned on|have been turned off)/i);
      
      if (deviceMatch && roomMatch && actionMatch) {
        const device = deviceMatch[1].toLowerCase();
        const room = roomMatch[1];
        const action = actionMatch[1]
          .replace("have been ", "")
          .toLowerCase();
        
        return (
          <span>
            <span className="font-bold">{room}</span>
            {` ${device} ${action}`}
          </span>
        );
      }
      
      // Fallback for old room creation/deletion format
      const cleanedMessage = activity.message
        .replace(/Classroom\s+["']([^"']+)["']\s*/i, "")
        .trim();
      
      const roomName = roomMatch ? roomMatch[1] : "";
      
      return (
        <span>
          <span className="font-bold">{roomName}</span>
          {cleanedMessage && ` ${cleanedMessage}`}
        </span>
      );
    }
    
    const { roomName, action, target } = activity;
    
    let actionText = "";
    if (action === "created") {
      actionText = " has been created";
    } else if (action === "removed") {
      actionText = " has been removed";
    } else if (action === "turned_on" || action === "turned_off") {
      const targetName = target ? target.toLowerCase() : "device";
      const onOff = action === "turned_on" ? "turned on" : "turned off";
      actionText = ` ${targetName} ${onOff}`;
    }
    
    return (
      <span>
        <span className="font-bold">{roomName}</span>
        {actionText}
      </span>
    );
  };

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
      <style>{`
        .activity-scroll::-webkit-scrollbar {
          width: 30px;
        }
        .activity-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .activity-scroll::-webkit-scrollbar-thumb {
          background: #A7A7A4;
          border-radius: 15px;
          border: 10px solid transparent;
          background-clip: padding-box;
        }
        .activity-scroll::-webkit-scrollbar-thumb:hover {
          background: #999;
          background-clip: padding-box;
        }
      `}</style>
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
          <div className="flex flex-col w-full h-61 items-start gap-4 pad-4 primary-text">
            <h2 className="text-title">Activity History</h2>
            <div className="w-full h-full rounded-2xl shadow-outside-dropshadow overflow-y-auto p-4 flex flex-col gap-3 pr-6 activity-scroll">
              {recentActivities.length === 0 ? (
                <p className="text-subtitle text-[#999] font-light">No activities yet</p>
              ) : (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex flex-row items-start gap-3 pb-3 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#A7A7A4] flex items-center justify-center text-[#E4E3E1] font-bold text-lg">
                      !
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-m text-[#4F4F4F]">
                        {renderActivityMessage(activity)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
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
