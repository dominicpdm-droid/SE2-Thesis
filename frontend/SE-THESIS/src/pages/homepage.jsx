import { useEffect, useState } from "react";
import Logo from "../../public/images/slanted_logo.png";
import Logo2 from "../../public/images/slanted_logo2.png";
import { getHomeMessage, getPeopleCount } from "../api/home.api.js";
import GrayButton from "../components/common/grayButton.jsx";
import { useNavigate } from "react-router-dom";

import Bulb from "../../public/icons/bulb.png";
import Target from "../../public/icons/target.png";
import Copy from "../../public/icons/copy.png";

export default function HomePage() {
  const [message, setMessage] = useState("Offline");
  const image = "/sample.jpg";
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const detectImage = () => {
    getPeopleCount().then((data) => {
      setData(data);
      console.log("IMAGE DETECTED:", data);
    });
  };

  return (
    <div className="w-screen h-screen font-montserrat bg-[#E4E3E1] p-10 flex items-end justify-center overflow-hidden">
      <section className="absolute w-[30%] h-fit flex flex-row gap-6 top-[2vw] left-[3vw]">
        <div className="flex flex-col gap-6">
          <div className="w-28 aspect-square bg-[#ABAAA9] flex flex-col p-4 items-start justify-between rounded-2xl shadow-inner-neumorphic hover:scale-105 hover:bg-[#b1b1b1] transition-transform duration-300 cursor-pointer">
            <img src={Bulb} alt="Bulb Icon" className="w-9 aspect-square" />
            <p className="text-subtitle text-[#E4E3E1]">Smart</p>
          </div>
          <div className="w-28 aspect-square bg-[#ABAAA9] flex flex-col p-4 items-start justify-between rounded-2xl shadow-inner-neumorphic hover:scale-105 hover:bg-[#b1b1b1] transition-transform duration-300 cursor-pointer">
            <img src={Target} alt="Bulb Icon" className="w-9 aspect-square" />
            <p className="text-subtitle text-[#E4E3E1]">Detect</p>
          </div>
          <div className="w-28 aspect-square bg-[#ABAAA9] flex flex-col p-4 items-start justify-between rounded-2xl shadow-inner-neumorphic hover:scale-105 hover:bg-[#b1b1b1] transition-transform duration-300 cursor-pointer">
            <img src={Copy} alt="Bulb Icon" className="w-9 aspect-square" />
            <p className="text-subtitle text-[#E4E3E1]">Adapt</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 justify-between">
          <div className="w-5 aspect-square rounded-full bg-[#C8C8C8]">
          </div>
          <div className="w-5 aspect-square rounded-full bg-[#C8C8C8]">
          </div>
          <div className="w-5 aspect-square rounded-full bg-[#C8C8C8]">
          </div>
          <div className="absolute self-center w-[0.1rem] h-full bg-[#C8C8C8]">
          </div>
        </div>

        <div className="flex flex-col gap-6 font-bold justify-between text-subheader">
          <p className="text-[#505153]">01</p>
          <p className="text-[#505153]">02</p>
          <p className="text-[#505153]">03</p>
        </div>
      </section>

      <section className="relative w-3/4 h-screen group left-[22vw]">
        <img
          src={Logo}
          alt="Logo"
          className="w-full absolute inset-0 transition-opacity duration-1000 ease-in-out opacity-100 group-hover:opacity-0"
        />
        <img
          src={Logo2}
          alt="Logo2"
          className="w-full absolute inset-0 transition-opacity duration-1000 ease-in-out opacity-0 group-hover:opacity-100"
        />
      </section>

      <div className="w-[30%] h-[15vh] flex flex-col items-end text-[#1E1E1E] absolute top-[2vw] right-[3vw] opacity-75">
        <h1 className="text-subheader w-fit font-montserrat font-bold">
          Intelligent Room Interaction System
        </h1>
        <p className="text-subheader font-medium">
          Adapted Spaces for Learning
        </p>
      </div>

      <section className="font-montserrat absolute flex flex-col gap-10 left-[5vw] bottom-[5vw]">
        <h1 className="text-[#1E1E1E] text-header font-bold w-fit leading-tight opacity-75">
          Awareness-Driven
          <br />
          Energy Control
        </h1>
        <GrayButton onClick={() => navigate("/signup")} buttonText="Get Started"/>
      </section>
    </div>
  );
}
