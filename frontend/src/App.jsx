import React from "react";
import Home from "./pages/Home";
import { Toaster } from "@/components/ui/sonner";
import AuthSuccess from "./components/AuthSuccess";

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
