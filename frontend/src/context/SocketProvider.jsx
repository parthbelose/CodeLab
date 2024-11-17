import React, { createContext, useContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

// Create a context
const SocketContext = createContext(null);

// Custom hook to use the socket context
export const useSocket = () => useContext(SocketContext);

// Define the provider component
export const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io("http://localhost:3000"), []); // Initialize once
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
