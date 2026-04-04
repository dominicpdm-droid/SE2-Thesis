import React, { useState, useEffect, useRef } from "react";
import { useActivity } from "../../context/activityContext";
import UnderConstruction from "@/assets/images/under_construction.png";

export default function ActivityPage() {
  const [selectedButton, setSelectedButton] = useState(0);
  const [displayedCounts, setDisplayedCounts] = useState({ 0: 10, 1: 10, 2: 10 });
  const scrollContainerRef = useRef(null);
  const { getActivitiesByDate } = useActivity();
  const buttons = ["Today", "This Week", "This Month"];

  const filterMap = {
    0: "today",
    1: "week",
    2: "month",
  };

  const filteredActivities = getActivitiesByDate(filterMap[selectedButton]);
  const currentDisplayCount = displayedCounts[selectedButton];
  const displayedActivities = filteredActivities.slice(0, currentDisplayCount);
  const hasMoreActivities = filteredActivities.length > currentDisplayCount;

  // Reset displayed count when filter changes
  useEffect(() => {
    setDisplayedCounts((prev) => ({ ...prev, [selectedButton]: 10 }));
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [selectedButton]);

  const handleLoadMore = () => {
    setDisplayedCounts((prev) => ({
      ...prev,
      [selectedButton]: prev[selectedButton] + 10,
    }));
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const renderActivityMessage = (activity) => {
    // Handle old message format for backward compatibility
    if (activity.message) {
      const message = activity.message;
      
      // Match patterns like: Lights in "classroom 3" have been turned on
      const deviceMatch = message.match(/(Lights|Fans)/i);
      const roomMatch = message.match(/["']([^"']+)["']/);
      
      if (deviceMatch && roomMatch) {
        const device = deviceMatch[1].toLowerCase();
        const room = roomMatch[1];
        
        // Extract action (turned on/off)
        if (message.toLowerCase().includes("turned on")) {
          return (
            <span>
              <span className="font-bold">{room}</span>
              {` ${device} turned on`}
            </span>
          );
        } else if (message.toLowerCase().includes("turned off")) {
          return (
            <span>
              <span className="font-bold">{room}</span>
              {` ${device} turned off`}
            </span>
          );
        }
      }
      
      // Parse old room creation/deletion format: classroom "[name]" has been removed/created
      const roomCreationMatch = message.match(/classroom\s+["']([^"']+)["']\s+(has been created|has been removed)/i);
      if (roomCreationMatch) {
        const room = roomCreationMatch[1];
        const action = roomCreationMatch[2].toLowerCase();
        
        return (
          <span>
            <span className="font-bold">{room}</span>
            {` ${action}`}
          </span>
        );
      }
      
      // Fallback: just return the message as-is
      return <span>{message}</span>;
    }
    
    // Handle new structured format
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
            <div
              ref={scrollContainerRef}
              className="w-full h-full overflow-y-scroll rounded-xl shadow-inside-dropshadow-small flex flex-col"
            >
              {filteredActivities.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-subtitle text-[#999] font-light">
                    No activities for {buttons[selectedButton].toLowerCase()}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    {displayedActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="w-full border-b border-gray-300 p-5 primary-text flex flex-row items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex flex-col gap-1">
                          <p className="text-subtitle text-[#4F4F4F]">
                            {renderActivityMessage(activity)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTime(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {hasMoreActivities && (
                    <div className="w-full p-4 flex justify-center border-t border-gray-300">
                      <button
                        onClick={handleLoadMore}
                        className="px-6 py-2 bg-transparent text-[#A7A7A4] rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
