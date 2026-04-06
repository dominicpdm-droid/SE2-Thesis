import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import changeProfile from "@/assets/icons/changeProfile.png";
import personalInfo from "@/assets/icons/personalInfo.png";
import applyOrg from "@/assets/icons/applyOrg.png";
import logout from "@/assets/icons/logout.png";
import personalInfo_w from "@/assets/icons/personalInfo_w.png";
import applyOrg_w from "@/assets/icons/applyOrg_w.png";
import logout_w from "@/assets/icons/logout_w.png";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <div className="w-full h-full flex flex-col gap-6 p-8">
            <h2 className="text-2xl font-bold text-[#1E1E1E]">Personal Organization</h2>
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-[#858585]">Organization Name</p>
                <p className="text-lg font-semibold text-[#1E1E1E]">Your Organization</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-[#858585]">Members</p>
                <p className="text-lg font-semibold text-[#1E1E1E]">12 members</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-[#858585]">Role</p>
                <p className="text-lg font-semibold text-[#1E1E1E]">Administrator</p>
              </div>
            </div>
          </div>
        );
      case "apply":
        return (
          <div className="w-full h-full flex flex-col gap-6 p-8">
            <div className="flex flex-col gap-4 flex-1">
              <input
                type="text"
                placeholder="Search organizations..."
                className="w-full h-9 px-4 py-1 text-base border border-[#d4d3d1] rounded-full shadow-inner focus:outline-none focus:border-[#858585] bg-[#E4E3E1]"
              />
              <div className="flex-1 bg-[#E4E3E1] border border-[#d4d3d1] rounded-xl shadow-inner overflow-y-auto">
                <div className="">
                  <div className="py-2 px-3 text-lg hover:bg-[#A7A7A3] cursor-pointer rounded">Organization 1</div>
                  <div className="py-2 px-3 text-lg hover:bg-[#A7A7A3] cursor-pointer rounded">Organization 2</div>
                  <div className="py-2 px-3 text-lg hover:bg-[#A7A7A3] cursor-pointer rounded">Organization 3</div>
                  <div className="py-2 px-3 text-lg hover:bg-[#A7A7A3] cursor-pointer rounded">Organization 4</div>
                  <div className="py-2 px-3 text-lg hover:bg-[#A7A7A3] cursor-pointer rounded">Organization 5</div>
                </div>
              </div>
              <div className="flex flex-row gap-4 justify-end">
                <button
                  className="w-62 h-10 bg-[#A1A2A6] text-white px-6 rounded-lg text-base hover:bg-[#7E808C] transition-colors duration-300">
                  Add Organization
                </button>
                <button
                  className="w-62 h-10 bg-[#A1A2A6] text-white px-6 rounded-lg text-base hover:bg-[#7E808C] transition-colors duration-300">
                  Apply
                </button>
              </div>
            </div>
          </div>
        );
      case "logout":
        return (
          <div className="w-full h-full flex flex-col gap-6 p-8 justify-center items-center">
            <div className="w-47 h-47 rounded-full bg-[#A7A7A4] flex items-center justify-center text-[#E4E3E1] font-bold text-7xl">
             !
            </div>
            <h2 className="text-2xl font-bold text-[#1E1E1E]">You're leaving IRIS</h2>
            <p className="text-lg text-[#858585] pb-15">Are you sure you want to logout your account?</p>
            <button
              onClick={() => {
                // Add logout logic here
                window.location.href = "/";
              }}
              className="w-63 h-12 bg-[#A1A2A6] text-white px-6 py-2 rounded-lg text-base hover:bg-[#7E808C] transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="relative w-screen h-screen flex flex-col gap-2 bg-[#E4E3E1] px-12 py-6">
      <div className="w-full h-16 flex flex-row items-center justify-between bg-transparent">
        <h1 className="text-subtitle text-[#1E1E1E] opacity-75 font-bold">
          Intelligent Room Interaction System
        </h1>
      </div>
      <section className="relative w-full h-full flex flex-row items-start justify-start gap-10">
        <div className="relative w-[18vw] h-full aspect-video rounded-2xl shadow-outside-dropshadow flex flex-col justify-start items-center text-header pt-4 px-4">
          <button
            onClick={() => window.history.back()}
            className="absolute top-4 left-4 w-10 h-10 bg-transparent rounded-full flex items-center justify-center cursor-pointer hover:bg-[#d4d3d1] transition-colors duration-300"
          >
            <ChevronLeft size={30} className="text-[#858585]" />
          </button>
          <div className="w-40 aspect-square rounded-full flex items-center justify-center pt-12 bg-transparent cursor-pointer hover:scale-105 transition-transform duration-300">
            <img src={changeProfile} alt="Logo" className="w-40 h-40" />
          </div>
          <h2 className="text-lg font-bold text-[#1E1E1E] mt-4">John Doe</h2>
          <p className="text-sm text-[#858585] mb-6">Organization Name</p>
          
          <div className="flex flex-col gap-3 w-full pt-30">
            <button 
              onClick={() => setActiveTab("personal")}
              className={`w-full py-2 px-4 flex items-center gap-2 rounded-lg text-base font-medium transition-colors duration-300 ${
                activeTab === "personal"
                  ? "bg-[#A7A7A3] text-white shadow-inner"
                  : "bg-transparent text-[#1E1E1E] hover:bg-[#c4c3c1]"
              }`}
            >
              <img src={activeTab === "personal" ? personalInfo_w : personalInfo} alt="Logo" className="w-4 h-4" />
              <span>Personal Information</span>
            </button>
            <button 
              onClick={() => setActiveTab("apply")}
              className={`w-full py-2 px-4 flex items-center gap-2 rounded-lg text-base font-medium transition-colors duration-300 ${
                activeTab === "apply"
                  ? "bg-[#A7A7A3] text-white shadow-inner"
                  : "bg-transparent text-[#1E1E1E] hover:bg-[#c4c3c1]"
              }`}
            >
              <img src={activeTab === "apply" ? applyOrg_w : applyOrg} alt="Logo" className="w-4 h-4" />
              <span>Apply organization</span>
            </button>
            <button 
              onClick={() => setActiveTab("logout")}
              className={`w-full py-2 px-4 flex items-center gap-2 rounded-lg text-base font-medium transition-colors duration-300 ${
                activeTab === "logout"
                  ? "bg-[#A7A7A3] text-white shadow-inner"
                  : "bg-transparent text-[#1E1E1E] hover:bg-[#c4c3c1]"
              }`}
            >
              <img src={activeTab === "logout" ? logout_w : logout} alt="Logo" className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
        <div className="w-4/5 h-full aspect-video rounded-2xl shadow-outside-dropshadow flex justify-center items-center text-header overflow-auto">
          {renderContent()}
        </div>
      </section>
    </section>
    
  );
}
