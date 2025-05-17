import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { FaGoogle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import LoadingSpinner from "./ui/spinner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UserAuthStatus = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate(); 

  const handleLogin = () => {
    // Redirect to Google auth on the backend
    window.open(`${API_URL}/auth/google`, "_self");
  };

  const handleLogout = async () => {
    try {
      await logout()
      // navigate("/")                              
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading){
      return <LoadingSpinner />
  }

  if (!user) {
    return (
      <Button
        onClick={handleLogin}
        className="bg-blue-300 text-black px-4 py-2 rounded font-bold hover:bg-blue-400 transition duration-200"
      >
            <FaGoogle size={12} />
                Sign in 
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4">
        
      <img
        src={user.photo}
        alt="profile"
        className="w-11 h-11 rounded-full border"
      />
      <div className="hidden sm:flex flex-col items-start">
        <span className="text-md font-semibold">{user.name}</span>
        <span className="text-sm text-gray-500">{user.email}</span>
      </div>

      <Button
        onClick={handleLogout}
        className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-2"
      >
        <MdLogout size={20} />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  );
};

export default UserAuthStatus;
