// App.jsx
import React from "react";
import Home from "./pages/Home";
import AuthSuccess from "./components/AuthSuccess";
import { Routes, Route } from "react-router-dom"; // Add Route here
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
