import { createContext, useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { loginUser, fetchUser } from "../shared/services/authService";
import { handleServerDown } from "../shared/utils/serverDownHandler.js";
import { useServerStatus } from "../context/serverStatusContext.jsx";
import { socket } from "../shared/services/socketService.js";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { isServerUp, setIsServerUp } = useServerStatus();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (token) => {
    try {
      const userData = await fetchUser(token);
      setUser(userData);
      console.log(userData);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await loginUser({ email, password });
      console.log(data);
      const { message, token } = data;

      localStorage.setItem("token", token);
      socket.connect();
      
      return {
        success: true,
        message,
      };

    } catch (err) {
      if (handleServerDown(error, setIsServerUp, navigate)) return;
      return {
        success: false,
        // message: err.response?.data?.message || "Login failed",
        message: "Login failed",
      };
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    socket.disconnect()
    toast.success("Logged out successfully!");
    navigate("iris/");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
