import React, { useState } from "react";
import { useActivity } from "../../context/activityContext";
import UnderConstruction from "@/assets/images/under_construction.png";

export default function ActivityPage() {
  const [selectedButton, setSelectedButton] = useState(0);
  const { getActivitiesByDate } = useActivity();
  const buttons = ["Today", "This Week", "This Month"];

  const filterMap = {
    0: "today",
    1: "week",
    2: "month",
  };

  const filteredActivities = getActivitiesByDate(filterMap[selectedButton]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      default:
        return "text-[#4F4F4F]";
    }
  };
  return (
    <div className="w-full h-full bg-[#E4E3E1] min-h-0">
      <section className="relative w-full h-full flex flex-col gap-6 min-h-0">
        <div className="w-full flex flex-row items-end justify-between text-[#1E1E1E] opacity-75">
          <h1 className="text-subheader font-bold">Activity Log</h1>
        </div>
        <div className="w-full h-full min-h-0 rounded-2xl shadow-outside-dropshadow flex flex-col bg-[#shadow-black/40 hover:shadow-md]">
          <div className="w-full h-[15%] shadow-lg shadow-gray px-5 py-3">
            <div className="w-full h-full p-4 flex flex-row justify-between gap-5 rounded-xl shadow-inside-dropshadow-small">
              {buttons.map((btn, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedButton(index)}
                  className={`w-full text-subtitle px-5 primary-text rounded-lg cursor-pointer hover:scale-101 transition-transform duration-300
            ${selectedButton === index ? "shadow-black/40 shadow-md" : ""}
          `}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full h-full p-5 flex flex-col min-h-0">
            {/* Activity Log */}
            <div className="w-full h-full overflow-y-scroll rounded-xl shadow-inside-dropshadow-small">
              {filteredActivities.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-subtitle text-[#999] font-light">
                    No activities for {buttons[selectedButton].toLowerCase()}
                  </p>
                </div>
              ) : (
                filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="w-full border-b border-gray-300 p-5 primary-text flex flex-row items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex flex-col gap-1">
                      <p className={`text-subtitle font-medium ${getActivityColor(activity.type)}`}>
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
