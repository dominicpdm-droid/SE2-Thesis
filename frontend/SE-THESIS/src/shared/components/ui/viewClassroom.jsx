import { useState, useRef, useEffect } from "react";
import { X, ChevronLeft, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import Dialog from "@mui/material/Dialog";
import Switch from "@mui/material/Switch";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Draggable from "react-draggable";
import Small_Logo from "@/assets/images/small_logo.png";
import { addCamera } from "../../services/deviceService";
import { deleteRoom } from "../../services/roomService";
import { handleServerDown } from "../../utils/serverDownHandler";
import { useServerStatus } from "../../../context/serverStatusContext";
import { useActivity } from "../../../context/activityContext";
import { useDeviceState } from "../../../context/deviceStateContext";
import { useNavigate } from "react-router-dom";
import { socket } from "../../services/socketService";
import { Toaster } from "../../components/ui/sonner";
import { useCamera } from "../../../context/cameraContext";
import { toast } from "sonner";

function PaperComponent(props) {
  const nodeRef = useRef(null);

  return (
    <Draggable
      nodeRef={nodeRef}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}
function VideoModal({ room, stream, onClose }) {
  const modalVideoRef = useRef(null);
  const [isMarking, setIsMarking] = useState(false);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    if (modalVideoRef.current && stream) {
      modalVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (points.length === 4) {
      console.log(
        "ROI VIDEO COORDS:",
        points.map((p) => ({
          x: p.videoX,
          y: p.videoY,
        })),
      );
    }
  }, [points]);

  const handleOverlayClick = (e) => {
    const overlayRect = e.currentTarget.getBoundingClientRect();
    const videoEl = modalVideoRef.current;

    if (!videoEl || !videoEl.videoWidth || !videoEl.videoHeight) {
      return;
    }

    const clickX = e.clientX - overlayRect.left;
    const clickY = e.clientY - overlayRect.top;

    const boxWidth = overlayRect.width;
    const boxHeight = overlayRect.height;

    const videoWidth = videoEl.videoWidth;
    const videoHeight = videoEl.videoHeight;

    const videoAspect = videoWidth / videoHeight;
    const boxAspect = boxWidth / boxHeight;

    let renderedWidth, renderedHeight, offsetX, offsetY;

    if (videoAspect > boxAspect) {
      renderedWidth = boxWidth;
      renderedHeight = boxWidth / videoAspect;
      offsetX = 0;
      offsetY = (boxHeight - renderedHeight) / 2;
    } else {
      renderedHeight = boxHeight;
      renderedWidth = boxHeight * videoAspect;
      offsetX = (boxWidth - renderedWidth) / 2;
      offsetY = 0;
    }

    const isInsideRenderedVideo =
      clickX >= offsetX &&
      clickX <= offsetX + renderedWidth &&
      clickY >= offsetY &&
      clickY <= offsetY + renderedHeight;

    if (!isInsideRenderedVideo) return;

    const normalizedX = (clickX - offsetX) / renderedWidth;
    const normalizedY = (clickY - offsetY) / renderedHeight;

    const newPoint = {
      displayX: clickX,
      displayY: clickY,
      videoX: Math.round(normalizedX * videoWidth),
      videoY: Math.round(normalizedY * videoHeight),
    };

    setPoints((prev) => {
      if (prev.length >= 4) return prev;

      console.log("POINT:", newPoint);
      return [...prev, newPoint];
    });
  };

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-[90vw] h-[85vh] bg-[#DFDEDA] rounded-xl p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 bg-black/20 hover:bg-black/30 rounded-full p-2"
        >
          <X size={22} color="#4F4F4F" />
        </button>

        <button
          onClick={() => {
            setIsMarking((prev) => !prev);
            setPoints([]);
          }}
          className="absolute top-3 left-3 z-20 px-4 py-2 rounded-lg bg-black/60 text-white hover:bg-black/75 transition"
        >
          {isMarking ? "Cancel Marking" : "Mark Area"}
        </button>

        <div className="relative w-full h-full rounded-lg overflow-hidden">
          <video
            ref={modalVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain bg-black"
          />
          <svg
            className="absolute inset-0 z-10 pointer-events-none w-full h-full"
            width="100%"
            height="100%"
            viewBox={`0 0 ${modalVideoRef.current?.clientWidth || 0} ${modalVideoRef.current?.clientHeight || 0}`}
            preserveAspectRatio="none"
          >
            {points.length > 1 && points.length < 4 && (
              <polyline
                points={points
                  .map((p) => `${p.displayX},${p.displayY}`)
                  .join(" ")}
                fill="none"
                stroke="lime"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {points.length === 4 && (
              <polygon
                points={points
                  .map((p) => `${p.displayX},${p.displayY}`)
                  .join(" ")}
                fill="none"
                stroke="lime"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>

          {points.map((point, index) => (
            <div
              key={index}
              className="absolute z-20 w-4 h-4 bg-red-500 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${point.displayX}px`,
                top: `${point.displayY}px`,
              }}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-white text-xs font-bold">
                {index + 1}
              </span>
            </div>
          ))}

          {isMarking && (
            <div
              className="absolute inset-0 z-10 cursor-crosshair bg-transparent"
              onClick={handleOverlayClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default function ViewClassroom({
  open,
  onClose,
  roomId,
  roomName,
  onRoomDeleted,
}) {
  const navigate = useNavigate();
  const { isServerUp, setIsServerUp } = useServerStatus();
  const { addActivity } = useActivity();
  const { getDeviceState, setDeviceState } = useDeviceState();
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [lightsOn, setLightsOn] = useState(false);
  const [fansOn, setFansOn] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const videoRef = useRef(null);
  const [cameras, setCameras] = useState([]);
  const [openDevices, setOpenDevices] = useState(false);
  const streamRef = useRef(null);
  const { getStream } = useCamera();
  const [selectedRoom, setSelectedRoom] = useState(null);

  //! Load device states from context when modal opens
  //! Bali ito yung for electronic devices
  useEffect(() => {
    if (open && roomId) {
      const { lightsOn: savedLightsOn, fansOn: savedFansOn } =
        getDeviceState(roomId);
      setLightsOn(savedLightsOn);
      setFansOn(savedFansOn);
    }
  }, [open, roomId]);

  //! Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setLightsOn(false);
      setFansOn(false);
      setIsDeleting(false);
    }
  }, [open]);

  //! This gets all the available cameras from the browser
  //! and list them as options to connect to the classroom
  useEffect(() => {
    async function getCameras() {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });

        const devices = await navigator.mediaDevices.enumerateDevices();

        const videoInputs = devices.filter(
          (device) => device.kind === "videoinput",
        );

        setCameras(videoInputs);
      } catch (err) {
        console.error("Error getting cameras:", err);
      }
    }

    getCameras();
  }, []);

  //! This updates the video feed whenever the selected camera changes or when the modal is opened
  useEffect(() => {
    if (!open || !roomId || !videoRef.current) return;

    const stream = getStream(roomId);

    videoRef.current.srcObject = null;

    if (stream) {
      videoRef.current.srcObject = stream;
      console.log("ATTACHED STREAM FOR ROOM:", roomId);
    } else {
      console.warn("No stream found for room:", roomId);
    }
    socket.on("deviceAdded", getStream);
  }, [roomId, open, getStream]);

  //! This handles the camera stream whenever a new camera is selected
  useEffect(() => {
    async function startCamera() {
      if (!selectedCamera) return;

      try {
        // stop previous stream FIRST
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: selectedCamera.deviceId },
          },
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    }

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedCamera]);

  //! This handles adding the camera to the classroom in the database
  const handleAddCamera = async (data) => {
    try {
      const res = await addCamera({
        device_location: roomId,
        device_type: "Camera",
        device_label: selectedCamera.label,
      });
      toast.success(res.message);
    } catch (error) {
      if (handleServerDown(error, setIsServerUp, navigate)) return;
      // ?If it's not, then the status error message will be displayed
      toast.error(error.response?.data?.message || "Something failed");
    }
  };

  const handleClickOpen = () => {
    setOpenDevices(true);
  };

  const handleClose = () => {
    setOpenDevices(false);
  };

  const handleRemoveClassroom = async () => {
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to remove "${roomName}"? This action cannot be undone.`,
    );

    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      await deleteRoom(roomId);

      if (onRoomDeleted) {
        onRoomDeleted(roomId);
      }

      addActivity(roomName, "removed");
      toast.success("Classroom removed successfully");
      onClose();
    } catch (error) {
      setIsDeleting(false);

      if (handleServerDown(error, setIsServerUp, navigate)) return;

      const message =
        error.response?.data?.message || "Failed to remove classroom";
      toast.error(message);
    }
  };

  const toggleLights = () => {
    const newState = !lightsOn;
    setLightsOn(newState);
    setDeviceState(roomId, newState, fansOn);
    const action = newState ? "turned_on" : "turned_off";
    addActivity(roomName, action, "lights");
    toast.success(newState ? "Lights turned on" : "Lights turned off");
  };

  const toggleFans = () => {
    const newState = !fansOn;
    setFansOn(newState);
    setDeviceState(roomId, lightsOn, newState);
    const action = newState ? "turned_on" : "turned_off";
    addActivity(roomName, action, "fans");
    toast.success(newState ? "Fans turned on" : "Fans turned off");
  };

  if (!open) return null;

  const ToggleSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 50,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(24px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#A7A7A4",
          opacity: 1,
          border: 0,
          ...theme.applyStyles("dark", {
            backgroundColor: "#A7A7A4",
          }),
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          backgroundColor: "#A7A7A4",
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.grey[100],
        ...theme.applyStyles("dark", {
          color: theme.palette.grey[600],
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.7,
        ...theme.applyStyles("dark", {
          opacity: 0.3,
        }),
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: "#A7A7A4",
      boxShadow:
        "inset 1px 2px 2px rgba(0, 0, 0, 0.4), inset -1px -1px 2px rgba(0, 0, 0, 0.2)",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
      ...theme.applyStyles("dark", {
        backgroundColor: "#39393D",
      }),
    },
  }));

  return (
    <div className="fixed inset-0 z-50">
      {/* Dark overlay backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal container */}
      <section className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-[#DFDEDA] shadow-black/70 shadow-lg w-[60%] h-[80%] min-h-0 rounded-lg">
          <div className="pointer-events-auto rounded-lg overflow-hidden w-full h-full flex flex-col">
            {/* Header */}
            <div className=" px-8 py-6 flex items-center justify-between">
              <h2 className="text-title font-bold text-[#4F4F4F]">
                {roomName} Live Feed
              </h2>
              <button
                onClick={onClose}
                className="cursor-pointer hover:scale-110 transition-transform duration-150 p-2 rounded-full hover:bg-black/10"
              >
                <X size={24} color="#4F4F4F" />
              </button>
            </div>

            {/* Content area - blank for now */}
            <div className="flex w-full h-full flex-col gap-6 px-8 py-5 min-h-0">
              {/* Content will be added here */}
              <div className="shadow-inner-neumorphic p-5 flex justify-center items-center w-full h-[65%] rounded-lg">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover rounded-lg"
                  onClick={() => {
                    console.log("CLICKED VIDEO");
                    setSelectedRoom(roomId);
                  }}
                />
              </div>
              <div className="shadow-inner-neumorphic flex flex-row p-5 gap-5 items-center justify-between w-full h-[15%] rounded-lg">
                <button
                  onClick={handleRemoveClassroom}
                  disabled={isDeleting}
                  className="w-full text-subtitle primary-text shadow-black/40 shadow-md px-10 py-6 rounded-2xl cursor-pointer hover:bg-[#b1b1b1] hover:scale-101 transition-transform duration-300 flex items-center justify-center gap-3 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={20} />
                  {isDeleting ? "Removing..." : "Remove Classroom"}
                </button>
                <button
                  onClick={toggleLights}
                  className={`w-full text-subtitle shadow-black/40 shadow-md px-10 py-6 rounded-2xl cursor-pointer hover:scale-101 transition-all duration-300 flex items-center justify-center gap-3 whitespace-nowrap ${
                    lightsOn
                      ? "bg-[#A1A2A6] text-black"
                      : "primary-text hover:bg-[#b1b1b1]"
                  }`}
                >
                  {lightsOn ? (
                    <ToggleRight size={25} />
                  ) : (
                    <ToggleLeft size={25} />
                  )}
                  Manual Lights
                </button>
                <button
                  onClick={toggleFans}
                  className={`w-full text-subtitle shadow-black/40 shadow-md px-10 py-6 rounded-2xl cursor-pointer hover:scale-101 transition-all duration-300 flex items-center justify-center gap-3 whitespace-nowrap ${
                    fansOn
                      ? "bg-[#A1A2A6] text-black"
                      : "primary-text hover:bg-[#b1b1b1]"
                  }`}
                >
                  {fansOn ? (
                    <ToggleRight size={25} />
                  ) : (
                    <ToggleLeft size={25} />
                  )}
                  Manual Fans
                </button>
              </div>

              <div className="flex flex-row justify-end gap-5 w-full h-[10%]">
                <button className="w-fit bg-[#A1A2A6] text-subtitle secondary-text shadow-outside-dropshadow px-10 py-6 rounded-2xl cursor-pointer hover:bg-[#b1b1b1] hover:scale-101 transition-transform duration-300">
                  View Devices
                </button>
                <button
                  onClick={handleClickOpen}
                  className="w-fit bg-[#A1A2A6] text-subtitle secondary-text shadow-outside-dropshadow px-10 py-6 rounded-2xl cursor-pointer hover:bg-[#b1b1b1] hover:scale-101 transition-transform duration-300"
                >
                  Add Sensor
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog
        open={openDevices}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        PaperProps={{
          className: "w-[60vw] h-[60vh]",
          sx: {
            borderRadius: "16px",
            background: "#DFDEDA",
          },
        }}
      >
        <section className="w-full h-full flex flex-col">
          <div
            className="w-full shadow-lg shadow-gray h-fit p-3 flex flex-row items-center justify-between cursor-grab active:cursor-grabbing"
            id="draggable-dialog-title"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={handleClose}
                className="cursor-pointer hover:-translate-x-1 transition-all duration-150 "
              >
                <ChevronLeft size={30} color="#4F4F4F" />
              </button>
              <h1 className="text-title">Sensors</h1>
            </div>
            <ToggleSwitch sx={{ m: 1 }} />
          </div>
          <div className="w-full border-b border-[#C8C8C8] h-fit px-5 py-3 flex flex-col">
            <h2 className="text-title font-medium">Connected Device</h2>
          </div>
          <div className="w-full h-fit px-5 py-3 flex flex-col">
            <h2 className="text-title font-medium">Available Devices</h2>
          </div>
          <div className="w-full h-full flex flex-col  overflow-y-scroll px-10 py-5">
            <ul className="flex flex-col gap-5">
              {cameras.map((cam) => (
                <div
                  key={cam.deviceId}
                  className="flex items-center gap-2 text-subtitle cursor-pointer"
                  onClick={() => {
                    setSelectedCamera(cam);
                  }}
                >
                  <img
                    src={Small_Logo}
                    alt="cam"
                    className="w-10 aspect-auto"
                  />
                  <li>{cam.label || "Unknown Camera"}</li>
                </div>
              ))}
            </ul>
          </div>
          <button
            onClick={handleAddCamera}
            className="w-fit mx-2 my-3 bg-[#A1A2A6] text-subtitle secondary-text shadow-outside-dropshadow px-8 py-4 rounded-2xl cursor-pointer hover:bg-[#b1b1b1] hover:scale-101 transition-transform duration-300"
          >
            Connect
          </button>
        </section>
      </Dialog>
      {selectedRoom && (
        <VideoModal
          room={selectedRoom}
          stream={getStream(selectedRoom)}
          onClose={() => setSelectedRoom(null)}
        />
      )}
      {/* <Toaster richColors expand position="bottom-right" /> */}
    </div>
  );
}
