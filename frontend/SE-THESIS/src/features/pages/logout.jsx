export default function Logout() {
  return (
    <div className="w-full h-full flex flex-col gap-6 p-8 justify-center items-center">
      <div className="w-47 h-47 rounded-full bg-[#A7A7A4] flex items-center justify-center text-[#E4E3E1] font-bold text-7xl">
        !
      </div>
      <h2 className="text-2xl font-bold text-[#1E1E1E]">You're leaving IRIS</h2>
      <p className="text-lg text-[#858585] pb-15">Are you sure you want to logout your account?</p>
      <button
        onClick={() => { window.location.href = "/"; }}
        className="w-63 h-12 bg-[#A1A2A6] text-white px-6 py-2 rounded-lg text-base hover:bg-[#7E808C] transition-colors duration-300"
      >
        Logout
      </button>
    </div>
  );
}