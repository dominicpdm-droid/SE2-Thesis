import React from "react";

export default function Gray_Button({ buttonText, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-fit bg-[#A1A2A6] text-title secondary-text shadow-outside-dropshadow px-10 py-6 rounded-2xl cursor-pointer hover:bg-[#b1b1b1] hover:scale-105 transition-transform duration-300">
      {buttonText}
    </button>
  );
}
