import React, { useRef, useState, useCallback, useEffect } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import {
  Button,
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
} from "@chakra-ui/react";
import { FaEraser, FaPen, FaUndo, FaRedo, FaDownload } from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useSocket } from "../context/SocketProvider";

function WhiteBoard({ roomId }) {
  const canvasRef = useRef(null);
  const [isErasing, setIsErasing] = useState(false);
  const [strokeColor, setStrokeColor] = useState("black");
  const socket = useSocket();

  const handleCanvasChange = useCallback(async () => {
    if (canvasRef.current) {
      const paths = await canvasRef.current.exportPaths();
      socket.emit("whiteboard_update", { roomId, paths });
    }
  }, [roomId, socket]);

  useEffect(() => {
    if (socket) {
      socket.on("whiteboard_update", ({ paths }) => {
        if (canvasRef.current) canvasRef.current.loadPaths(paths);
      });

      socket.on("whiteboard_clear", () => canvasRef.current.clearCanvas());
      socket.on("whiteboard_reset", () => canvasRef.current.resetCanvas());
    }

    return () => {
      socket.off("whiteboard_update");
      socket.off("whiteboard_clear");
      socket.off("whiteboard_reset");
    };
  }, [socket]);

  const toggleErase = useCallback(() => {
    setIsErasing((prev) => {
      if (canvasRef.current) canvasRef.current.eraseMode(!prev);
      return !prev;
    });
  }, []);

  const clearCanvas = useCallback(() => {
    canvasRef.current.clearCanvas();
    socket.emit("whiteboard_clear", { roomId });
  }, [roomId, socket]);

  const resetCanvas = useCallback(() => {
    canvasRef.current.resetCanvas();
    socket.emit("whiteboard_reset", { roomId });
  }, [roomId, socket]);

  const undoAction = useCallback(() => canvasRef.current.undo(), []);
  const redoAction = useCallback(() => canvasRef.current.redo(), []);

  const exportCanvasImage = async () => {
    const image = await canvasRef.current.exportImage("png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "whiteboard.png";
    link.click();
  };

  return (
    <Box>
      <Box
        resize="both"
        overflow="auto"
        border="1px solid #4A5568"
        borderRadius="md"
        p={2}
        width="600px"
        height="400px"
        minW="300px"
        minH="200px"
        maxW="1000px"
        maxH="600px"
      >
        <ReactSketchCanvas
          ref={canvasRef}
          strokeColor={strokeColor}
          strokeWidth={4}
          style={{ width: "100%", height: "100%" }}
          onChange={handleCanvasChange}
        />
      </Box>
      <Flex mt={2} wrap="wrap">
        <IconButton
          icon={isErasing ? <FaPen /> : <FaEraser />}
          onClick={toggleErase}
          colorScheme={isErasing ? "red" : "blue"}
          aria-label="Toggle Erase Mode"
          mr={2}
          title={isErasing ? "Switch to Pen Mode" : "Switch to Erase Mode"}
        />
        <IconButton
          icon={<FaUndo />}
          onClick={undoAction}
          colorScheme="green"
          aria-label="Undo"
          mr={2}
          title="Undo"
        />
        <IconButton
          icon={<FaRedo />}
          onClick={redoAction}
          colorScheme="green"
          aria-label="Redo"
          mr={2}
          title="Redo"
        />
        <IconButton
          icon={<FaDownload />}
          onClick={exportCanvasImage}
          colorScheme="teal"
          aria-label="Save as Image"
          mr={2}
          title="Save as Image"
        />

        <Input
          type="color"
          value={strokeColor}
          onChange={(e) => setStrokeColor(e.target.value)}
          width="50px"
          height="auto"
          p={0}
          border="none"
          bg="transparent"
          cursor="pointer"
          mr={2}
          title="Select Stroke Color"
        />

        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            colorScheme="orange"
            title="More Actions"
          >
            More Actions
          </MenuButton>
          <MenuList>
            <MenuItem onClick={clearCanvas}>Clear Canvas</MenuItem>
            <MenuItem onClick={resetCanvas}>Reset Canvas</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
}

export default WhiteBoard;
