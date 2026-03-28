import React, { useState } from "react";
import UnderConstruction from "@/assets/images/under_construction.png";

export default function NotificationPage() {
  const [selectedButton, setSelectedButton] = useState(null); // store selected button
  const buttons = ["Today", "This Week", "This Month"];
  return (
    <div className="w-full h-full bg-[#E4E3E1] min-h-0">
      <section className="relative w-full h-full flex flex-col gap-6 min-h-0">
        <div className="w-full flex flex-row items-end justify-between text-[#1E1E1E] opacity-75">
          <h1 className="text-subheader font-bold">Notifications</h1>
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
            {/* Sample Log, will haveto change this */}
            <div className="w-full h-screen overflow-scroll rounded-xl shadow-inside-dropshadow-small small">
              <div className="w-full border-b border-gray-400 p-5 primary-text flex flex-row">
                <h2 className="text-title">Activity Name</h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
