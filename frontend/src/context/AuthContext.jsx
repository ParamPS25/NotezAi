import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const API = import.meta.env.VITE_API_URL;

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API}/auth/success`, {
        withCredentials: true,
      });
      console.log("User data fetched:", res.data); // debugging
      setUser(res.data.user);
    } catch (err) {
      console.error("Error fetching user data:", err); // debugging
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
