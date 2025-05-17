import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/auth/success`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setUser(res.data.user);
        return true;  // Successfully fetched user (for authSuccess component)
      } else {
        setUser(null);
        return false; 
      }

    } catch (err) {
      console.error("Auth error :" , err);
      setUser(null);
      return false;
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // // listen for auth success redirect from passport (auth routes -> success redirect /auth-success )
    // // Check if we're on the auth success page
    // const isAuthSuccessPage = window.location.pathname === '/auth-success';

    // // Only fetch user data once
    // fetchUser().then(() => {
    //   // If we're on the auth success page, clean up the URL after fetching
    //   if (isAuthSuccessPage) {
    //     window.history.replaceState({}, document.title, '/');
    //   }
    // });

    // only fetch user data on initial load
    fetchUser();
  }, []);

  const logout = async () => {
      try {
      await axios.get(`${API_URL}/auth/logout`, {
        withCredentials: true,
      });
      setUser(null);
      window.location.reload();
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
