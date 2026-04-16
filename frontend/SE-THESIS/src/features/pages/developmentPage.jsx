// frontend/SE-THESIS/src/features/pages/developmentPage.jsx

import { useEffect, useRef, useState } from "react";
import { getRooms } from "../../shared/services/roomService";
import { getROIPoints } from "../../shared/services/pointService";
import { getSchedulesByRoom } from "../../shared/services/scheduleService";

export default function DevelopmentPage() {
  // -------------------------------
  // Refs (persistent across renders)
  // -------------------------------
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  const pointsRef = useRef({});
  const schedulesRef = useRef({});

  // -------------------------------
  // State Management
  // -------------------------------
  const [rooms, setRooms] = useState([]);
  const [roomResults, setRoomResults] = useState({});
  const [frame, setFrame] = useState(null);

  const [points, setPoints] = useState({});
  const [schedules, setSchedules] = useState({});

  // =========================================================
  // 1. FETCH ROOMS
  // =========================================================
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();

        console.log("[DEV] Rooms fetched:", data);

        setRooms(data);
      } catch (err) {
        console.error("[ERROR] Failed to fetch rooms:", err);
      }
    };

    fetchRooms();
  }, []);

  // =========================================================
  // 2. FETCH EXIT POINTS (ROI)
  // =========================================================
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const results = await Promise.all(
          rooms.map(async (room) => {
            const data = await getROIPoints(room._id);

            const rawPoints = data.points || data;

            const cleanedPoints = rawPoints.map((p) => ({
              x: p.point_x,
              y: p.point_y,
              roi: p.point_index,
              order: p.point_order,
            }));

            return {
              roomId: room._id,
              data: cleanedPoints,
            };
          })
        );

        const formatted = {};
        results.forEach(({ roomId, data }) => {
          formatted[roomId] = data;
        });

        console.log("[DEV] Exit points initialized:", formatted);

        setPoints(formatted);
      } catch (err) {
        console.error("[ERROR] Failed to fetch exit points:", err);
      }
    };

    if (rooms.length > 0 && Object.keys(points).length === 0) {
      fetchPoints();
    }
  }, [rooms]);

  // =========================================================
  // 3. FETCH SCHEDULES PER ROOM
  // =========================================================
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const results = await Promise.all(
          rooms.map(async (room) => {
            const data = await getSchedulesByRoom(room._id);

            return {
              roomId: room._id,
              data: data || [],
            };
          })
        );

        const formatted = {};
        results.forEach(({ roomId, data }) => {
          formatted[roomId] = data;
        });

        console.log("[DEV] Schedules loaded:", formatted);

        setSchedules(formatted);
      } catch (err) {
        console.error("[ERROR] Failed to fetch schedules:", err);
      }
    };

    if (rooms.length > 0 && Object.keys(schedules).length === 0) {
      fetchSchedules();
    }
  }, [rooms]);

  // =========================================================
  // Sync refs (avoid stale closures in interval loop)
  // =========================================================
  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    schedulesRef.current = schedules;
  }, [schedules]);

  // =========================================================
  // 4. HELPER: DETERMINE ACTIVE SCHEDULE
  // =========================================================
  const getActiveSchedule = (roomSchedules) => {
    if (!roomSchedules || roomSchedules.length === 0) return null;

    const now = new Date();
    const currentDay = now.toLocaleString("en-US", { weekday: "long" });

    return (
      roomSchedules.find((sched) => {
        if (sched.day !== currentDay) return false;

        const [startH, startM] = sched.time_start.split(":").map(Number);
        const [endH, endM] = sched.time_end.split(":").map(Number);

        const start = new Date();
        start.setHours(startH, startM, 0);

        const end = new Date();
        end.setHours(endH, endM, 0);

        return now >= start && now <= end;
      }) || null
    );
  };

  // =========================================================
  // 5. CAMERA INITIALIZATION + DETECTION LOOP
  // =========================================================
  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        console.log("[DEV] Camera initialized");
      } catch (err) {
        console.error("[ERROR] Camera access failed:", err);
      }
    };

    let isProcessing = false;

    const captureFrame = () => {
      if (isProcessing) return;
      isProcessing = true;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || rooms.length === 0) {
        isProcessing = false;
        return;
      }

      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) {
          isProcessing = false;
          return;
        }

        try {
          await Promise.all(
            rooms.map(async (room) => {
              const formData = new FormData();
              formData.append("file", blob, "frame.jpg");
              formData.append("room_id", room._id);

              // -------------------------------
              // Exit Points Handling
              // -------------------------------
              const roomPoints = pointsRef.current?.[room._id] ?? [];

              const backendPoints = roomPoints.map((p) => ({
                point_x: p.x,
                point_y: p.y,
                point_index: p.roi,
                point_order: p.order,
              }));

              formData.append("exit_points", JSON.stringify(backendPoints));

              // -------------------------------
              // Schedule Handling
              // -------------------------------
              const roomSchedules =
                schedulesRef.current?.[room._id] ?? [];

              const activeSchedule =
                getActiveSchedule(roomSchedules);

              formData.append(
                "schedule",
                activeSchedule
                  ? JSON.stringify(activeSchedule)
                  : ""
              );

              // -------------------------------
              // Logging (Frontend Debug)
              // -------------------------------
              console.log("[FRAME SEND]", {
                room: room.room_name,
                activeSchedule,
                points: backendPoints.length,
              });

              return fetch("http://localhost:8000/detect", {
                method: "POST",
                body: formData,
              })
                .then((res) => res.json())
                .then((data) => {
                  // -------------------------------
                  // Logging response (important)
                  // -------------------------------
                  console.log("[FRAME RESULT]", {
                    room: room.room_name,
                    state: data.state,
                    occupancy: data.features?.estimated_occupancy,
                    belief: data.belief,
                  });

                  // console.log("Full response:", data);

                  setFrame(data.image_url);

                  setRoomResults((prev) => ({
                    ...prev,
                    [room._id]: data,
                  }));
                });
            })
          );
        } catch (error) {
          console.error("[ERROR] Frame processing failed:", error);
        } finally {
          isProcessing = false;
        }
      }, "image/jpeg", 0.8);
    };

    startCamera();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(captureFrame, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [rooms, points]);

  // =========================================================
  // UI RENDER
  // =========================================================
  return (
    <div className="w-full h-full flex flex-col items-center gap-6 p-6">
      <h1 className="text-2xl font-bold">Development Page</h1>

      {/* Camera Feed */}
      <div className="flex flex-row items-start gap-6">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="rounded-xl shadow-lg w-[400px]"
        />
        <img
          src={frame}
          alt="Processed"
          className="rounded-xl shadow-lg w-[400px]"
        />
      </div>

      {/* Room Results */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {rooms.map((room) => {
          const result = roomResults[room._id];
          const roomPoints = points[room._id] || [];

          return (
            <div
              key={room._id}
              className="p-4 bg-gray-100 rounded-xl shadow-md"
            >
              <h2 className="font-bold text-lg">
                {room.room_name}
              </h2>

              {result ? (
                <>
                  <p>State: {result.state}</p>
                  <p>People: {result.features?.people_count}</p>
                  <p>
                    Motion:{" "}
                    {result.features?.motion_level?.toFixed(2)}
                  </p>
                  <p>
                    Occupancy:{" "}
                    {result.features?.estimated_occupancy}
                  </p>
                </>
              ) : (
                <p className="text-gray-500">
                  Waiting for data...
                </p>
              )}

              {/* ROI Points */}
              {roomPoints.length > 0 ? (
                <div className="mt-2 text-sm">
                  <p className="font-semibold">Points:</p>
                  {roomPoints.map((p, i) => (
                    <p key={i} className="text-xs">
                      ({p.x}, {p.y}) [ROI {p.roi}]
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  No points yet
                </p>
              )}
            </div>
          );
        })}
      </div>

      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}