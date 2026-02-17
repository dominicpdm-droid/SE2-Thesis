import React from "react";
import Logo from "../../public/icons/logo.png";
import { useNavigate } from "react-router-dom";

import SlideUp from "../components/animations/slideUp";

export default function SignUpPage() {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen font-montserrat flex-col gap-9 bg-[#E4E3E1] p-10 flex items-center justify-center overflow-hidden">
      <SlideUp duration={0.7}>
        <section className="mb-[5%] w-[40%] h-fit bg-[#DFDEDA] flex flex-col p-12 gap-9 items-center rounded-4xl shadow-outside-dropshadow">
          <h1 className="primary-text font-bold">Sign Up</h1>
          <form
            action="submit"
            className=" w-full flex flex-col items-center gap-5"
          >
            <input
              className="w-[90%] bg-[#E4E3E1] primary-text rounded-3xl px-6 py-4 shadow-inside-dropshadow-small font-light text-subtitle"
              type="text"
              name=""
              id=""
              placeholder="Username"
            />
            <input
              className="w-[90%] bg-[#E4E3E1] primary-text rounded-3xl px-6 py-4 shadow-inside-dropshadow-small font-light text-subtitle"
              type="text"
              name=""
              id=""
              placeholder="Email"
            />
            <input
              className="w-[90%] bg-[#E4E3E1] primary-text rounded-3xl px-6 py-4 shadow-inside-dropshadow-small font-light text-subtitle"
              type="text"
              name=""
              id=""
              placeholder="Password"
            />
            <input
              className="w-[90%] bg-[#E4E3E1] primary-text rounded-3xl px-6 py-4 shadow-inside-dropshadow-small font-light text-subtitle"
              type="text"
              name=""
              id=""
              placeholder="Confirm Password"
            />
          </form>
          <button onClick={() => navigate('/iris/home')} className="w-[90%] bg-[#A1A2A6] text-subtitle text-[#E4E3E1] shadow-outside-dropshadow py-4 rounded-3xl cursor-pointer hover:bg-[#8A8B8E] transition-colors duration-300">
            Sign Up
          </button>
          <button
            onClick={() => navigate("/iris/login")}
            className="primary-text hover:text-[#a9a9a9] cursor-pointer"
          >
            Already Have an Account?
          </button>
        </section>
      </SlideUp>

      <SlideUp>
        <section className="absolute bottom-[2vw] flex flex-col items-center gap-2">
          <img src={Logo} alt="Logo" />
          <p className="primary-text text-subtitle font-bold">
            Intelligent Room interaction System
          </p>
        </section>
      </SlideUp>
    </div>
  );
}
