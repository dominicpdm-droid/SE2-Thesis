import { useState, useEffect } from "react";
import EditIcon from "@/assets/icons/edit.png";
import { useAuth } from "../../context/authContext";

export default function PersonalInfo() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
      <div className="w-full h-full flex flex-col items-end justify-between gap-8 p-8">
        <div className="w-full flex flex-col gap-5">
          <div className="w-full flex flex-row items-end gap-4">
            <div className="w-1/2 flex flex-col gap-2">
              <label className="text-base">First Name</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder=""
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="flex-1 bg-[#E4E3E1] primary-text rounded-3xl px-6 py-4 shadow-inside-dropshadow-small font-light text-subtitle placeholder:text-[#858585] outline-none focus:ring-2 focus:ring-[#C4C4C4]"
                />
                <button
                  type="button"
                  className="flex items-center justify-center p-2 transition hover:opacity-80"
                >
                  <img src={EditIcon} alt="Edit" className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="w-1/2 flex flex-col gap-2">
              <label className="text-base">Last Name</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder=""
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="flex-1 bg-[#E4E3E1] primary-text rounded-3xl px-6 py-4 shadow-inside-dropshadow-small font-light text-subtitle placeholder:text-[#858585] outline-none focus:ring-2 focus:ring-[#C4C4C4]"
                />
                <button
                  type="button"
                  className="flex items-center justify-center p-2 transition hover:opacity-80"
                >
                  <img src={EditIcon} alt="Edit" className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-base">Email Address</label>
            <div className="flex items-center gap-3">
              <input
                type="email"
                placeholder=""
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="flex-1 bg-[#E4E3E1] primary-text rounded-3xl px-6 py-4 shadow-inside-dropshadow-small font-light text-subtitle placeholder:text-[#858585] outline-none focus:ring-2 focus:ring-[#C4C4C4]"
              />
              <button
                type="button"
                className="flex items-center justify-center p-2 transition hover:opacity-80"
              >
                <img src={EditIcon} alt="Edit" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base">Password</label>
            <div className="flex items-center gap-3">
              <input
                type="password"
                placeholder=""
                className="flex-1 bg-[#E4E3E1] primary-text rounded-3xl px-6 py-4 shadow-inside-dropshadow-small font-light text-subtitle placeholder:text-[#858585] outline-none focus:ring-2 focus:ring-[#C4C4C4]"
              />
              <button
                type="button"
                className="flex items-center justify-center p-2 transition hover:opacity-80"
              >
                <img src={EditIcon} alt="Edit" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        

      <div className="flex justify-end pt-4">
        <button className="w-62 h-10 bg-[#A1A2A6] text-white px-6 rounded-lg text-base hover:bg-[#7E808C] transition-colors duration-300 tp-30">
            Save Changes
          </button>
      </div>
    </div>
  );
}
