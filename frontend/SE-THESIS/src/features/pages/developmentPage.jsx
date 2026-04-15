// frontend/SE-THESIS/src/features/pages/developmentPage.jsx
import { useEffect, useRef, useState } from "react";
import { getRooms } from "../../shared/services/roomService";
import {   } from "../../shared/services/pointService";


export default function DevelopmentPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const pointsRef = useRef({});

  const [rooms, setRooms] = useState([]);
  const [roomResults, setRoomResults] = useState({});
  const [frame, setFrame] = useState(null);
  const [points, setPoints] = useState({});

  // 1. FETCH ROOMS FROM SERVER
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        console.log("DATA GATHERED FOR DEVELOPMENT:", data);
        setRooms(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const results = await Promise.all(
          rooms.map(async (room) => {
            const data = await getROIPoints(room._id);

            const rawPoints = data.points || data;

            const cleanedPoints = rawPoints.map(p => ({
              x: p.point_x,
              y: p.point_y,
              roi: p.point_index,
              order: p.point_order
            }));

            return {
              roomId: room._id,
              data: cleanedPoints
            };
          })
        );

        const formatted = {};
        results.forEach(({ roomId, data }) => {
          formatted[roomId] = data;
        });

        console.log("POINTS SET ONCE:", formatted);

        setPoints(formatted);

      } catch (err) {
        console.error(err);
      }
    };

    if (rooms.length > 0 && Object.keys(points).length === 0) {
      fetchPoints();
    }
  }, [rooms]);

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  // 2. CAMERA + DETECTION LOOP
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
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    let isProcessing = false; // Flag to prevent overlapping captures
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

            const roomPoints = pointsRef.current?.[room._id] ?? [];

            console.log("ROOM:", room._id);
            console.log("POINTS FOUND:", roomPoints);

            const backendPoints = roomPoints.map(p => ({
              point_x: p.x,
              point_y: p.y,
              point_index: p.roi,
              point_order: p.order
            }));

            formData.append("exit_points", JSON.stringify(backendPoints));

            return fetch("http://localhost:8000/detect", {
              method: "POST",
              body: formData,
            })
              .then((res) => res.json())
              .then((data) => {
                setFrame(data.image_url);

                setRoomResults((prev) => ({
                  ...prev,
                  [room._id]: data,
                }));
              });
          })
        );
      } catch (error) {
        console.error("Error sending frames:", error);
      } finally {
        isProcessing = false; // ✅ NOW correct
      }
    }, "image/jpeg", 0.8);
  };

    startCamera();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(captureFrame, 3000); // every 3 sec

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [rooms, points]); // rerun when rooms are loaded

  return (
    <div className="w-full h-full flex flex-col items-center gap-6 p-6">
      <h1 className="text-2xl font-bold">Development Page</h1>

      {/* CAMERA */}
      <div className="flex flex-row items-start gap-6">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="rounded-xl shadow-lg w-[400px]"
        />
        <img
          src={frame}
          alt="Placeholder"
          className="rounded-xl shadow-lg w-[400px]"
        />
      </div>
      {/* RESULTS PER ROOM */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {rooms.map((room) => {
          const result = roomResults[room._id];
          const roomPoints = points[room._id] || [];

          return (
            <div
              key={room._id}
              className="p-4 bg-gray-100 rounded-xl shadow-md"
            >
              <h2 className="font-bold text-lg">{room.room_name}</h2>

              {result ? (
                <>
                  <p>State: {result.state}</p>
                  <p>People: {result.features?.people_count}</p>
                  <p>Motion: {result.features?.motion_level?.toFixed(2)}</p>
                  <p>Occupancy: {result.features?.estimated_occupancy}</p>
                </>
              ) : (
                <p className="text-gray-500">Waiting for data...</p>
              )}
              {roomPoints && roomPoints.length > 0 ? (
                <div className="mt-2 text-sm">
                  <p className="font-semibold">Points:</p>                 
                    {roomPoints.map((p, i) => (
                      <p key={i} className="text-xs">
                        ({p.x}, {p.y}) [ROI {p.roi}]
                      </p>
                    ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No points yet</p>
              )}
            </div>
          );
        })}
      </div>

      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
