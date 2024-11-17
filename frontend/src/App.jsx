import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Meetingroom from "./components/Meetingroom";
import { SocketProvider } from "./context/SocketProvider";
import PreCall from "./components/PreCall";
function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/meetingroom/:roomId" element={<Meetingroom />} />
          <Route path="/precall" element={<PreCall />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
