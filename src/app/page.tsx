"use client";

import { Toaster } from "@/components/ui/toaster";
import Home from "@/components/layout/home";

const App = () => {
  return (
    <div id="home">
      <Home />
      <Toaster />
    </div>
  );
};

export default App;
