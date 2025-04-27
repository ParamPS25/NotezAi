import React from "react";
import Home from "./pages/Home";
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Home />
      <Toaster />
    </div>
  );
};

export default App;
