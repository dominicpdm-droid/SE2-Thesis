import React, { useState, useRef, useEffect } from "react";
import { X, SquarePen } from "lucide-react";
import EditClassroom from "./editClassroom";

export default function EditSchedule({ open, onClose, roomId, onEditClassroom}) {
  if (!open) return null;
  const [selectedDay, setSelectedDay] = useState("");
  const [isOpen, setIsOpen] = useState(false); // controls dropdown visibility
  const [isEditClassroomOpen, setIsEditClassroomOpen] = useState(false); // controls EditClassroom modal visibility
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditClassroom = () => {
    setIsEditClassroomOpen(true);
  };

  const handleCloseEditClassroom = () => {
    setIsEditClassroomOpen(false);
  };

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
          <div className="pointer-events-auto bg-[#DFDEDA] rounded-lg shadow-2xl overflow-hidden w-[85vw] h-[85vh] max-w-6xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className=" px-8 py-6 flex items-center justify-between">
              <h2 className="text-title font-bold text-[#4F4F4F]">
                Classroom Schedule
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
              <div className="shadow-inner-neumorphic p-2 flex justify-center items-center w-full h-[75%] rounded-lg"></div>
              <div className="w-full h-[5%] flex flex-row justify-between">
                <div className="relative w-48">
                  <div className="relative w-48" ref={dropdownRef}>
                    {/* Button */}
                    <button
                      className="w-full p-3 bg-white border rounded-lg shadow-md text-left"
                      onClick={() => setIsOpen(!isOpen)} // toggle dropdown
                    >
                      {selectedDay || "Select a day"}
                    </button>

                    {/* Dropdown menu */}
                    {isOpen && (
                      <ul className="absolute w-full bg-white border rounded-lg shadow-lg bottom-full mb-1">
                        {days.map((day) => (
                          <li
                            key={day}
                            onClick={() => {
                              setSelectedDay(day);
                              setIsOpen(false); // close after selection
                            }}
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                          >
                            {day}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {/* <select
                  name="selectedFruit"
                  className="shadow-inner-neumorphic flex flex-row p-5 gap-5 items-center justify-between w-[20%] h-full rounded-lg"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select> */}
                <button
                  onClick={handleEditClassroom}
                  className="cursor-pointer flex items-center gap-2 hover:scale-102 transition-transform duration-150 p-2 rounded-full hover:bg-black/10"
                >
                  <SquarePen size={24} color="#4F4F4F" /> Edit Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <EditClassroom 
        open={isEditClassroomOpen} 
        onClose={handleCloseEditClassroom} 
        roomId={roomId} 
      />
    </div>
  );
}
