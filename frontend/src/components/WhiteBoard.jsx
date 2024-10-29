// import React, { useRef, useState } from 'react';
// import { ResizableBox } from 'react-resizable';
// import { ReactSketchCanvas } from 'react-sketch-canvas';
// import { Button, Box, Flex } from '@chakra-ui/react';

// function WhiteBoard() {
//   const canvasRef = useRef(null); // Reference to the ReactSketchCanvas
//   const [isErasing, setIsErasing] = useState(false);

//   const toggleErase = () => {
//     setIsErasing((prev) => {
//       if (canvasRef.current) {
//         canvasRef.current.eraseMode(!prev); // Switch between pen and eraser mode
//       }
//       return !prev;
//     });
//   };

//   const clearCanvas = () => {
//     if (canvasRef.current) {
//       console.log("Clearing the canvas...");
//       canvasRef.current.clearCanvas(); // Clear the canvas
//     } else {
//       console.error("Canvas reference is null");
//     }
//   };

//   const resetCanvas = () => {
//     if (canvasRef.current) {
//       console.log("Resetting the canvas...");
//       canvasRef.current.resetCanvas(); // Reset the canvas
//     } else {
//       console.error("Canvas reference is null");
//     }
//   };

//   const undoAction = () => {
//     if (canvasRef.current) {
//       canvasRef.current.undo(); // Undo the last action
//     } else {
//       console.error("Canvas reference is null");
//     }
//   };

//   const redoAction = () => {
//     if (canvasRef.current) {
//       canvasRef.current.redo(); // Redo the previous action
//     } else {
//       console.error("Canvas reference is null");
//     }
//   };

//   return (
//     <Box>
//       <ResizableBox width={600} height={400} minConstraints={[300, 200]} maxConstraints={[1000, 600]}>
//         <div style={{ border: '1px solid #4A5568', borderRadius: 'md', padding: '10px', height: '100%' }}>
//           <ReactSketchCanvas
//             ref={canvasRef} // Attach the ref here
//             style={{ border: '1px solid black' }}
//             strokeColor="black"
//             strokeWidth={4}
//           />
//         </div>
//       </ResizableBox>
//       <Flex mt={2}>
//         <Button colorScheme={isErasing ? 'red' : 'blue'} onClick={toggleErase} mr={2}>
//           {isErasing ? 'Switch to Pen Mode' : 'Switch to Erase Mode'}
//         </Button>
//         <Button colorScheme="orange" onClick={clearCanvas} mr={2}>
//           Clear Canvas
//         </Button>
//         <Button colorScheme="yellow" onClick={resetCanvas} mr={2}>
//           Reset Canvas
//         </Button>
//         <Button colorScheme="green" onClick={undoAction} mr={2}>
//           Undo
//         </Button>
//         <Button colorScheme="green" onClick={redoAction}>
//           Redo
//         </Button>
//       </Flex>
//     </Box>
//   );
// }

// export default WhiteBoard;
import React, { useRef, useState, useCallback } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { Button, Box, Flex } from '@chakra-ui/react';

function WhiteBoard() {
  const canvasRef = useRef(null);
  const [isErasing, setIsErasing] = useState(false);

  // Utility function to check canvas reference
  const withCanvas = useCallback((action) => {
    if (canvasRef.current) {
      action(canvasRef.current);
    } else {
      console.error("Canvas reference is null");
    }
  }, []);

  const toggleErase = useCallback(() => {
    setIsErasing((prev) => {
      withCanvas((canvas) => canvas.eraseMode(!prev));
      return !prev;
    });
  }, [withCanvas]);

  const clearCanvas = useCallback(() => withCanvas((canvas) => canvas.clearCanvas()), [withCanvas]);
  const resetCanvas = useCallback(() => withCanvas((canvas) => canvas.resetCanvas()), [withCanvas]);
  const undoAction = useCallback(() => withCanvas((canvas) => canvas.undo()), [withCanvas]);
  const redoAction = useCallback(() => withCanvas((canvas) => canvas.redo()), [withCanvas]);

  return (
    <Box>
      {/* Resizable container */}
      <Box
        resize="both"           // Allows resizing horizontally and vertically
        overflow="auto"          // Ensures the canvas stays within the container when resized
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
          strokeColor="black"
          strokeWidth={4}
          style={{ width: '100%', height: '100%' }}
        />
      </Box>
      {/* Buttons for controls */}
      <Flex mt={2}>
        <Button colorScheme={isErasing ? 'red' : 'blue'} onClick={toggleErase} mr={2}>
          {isErasing ? 'Switch to Pen Mode' : 'Switch to Erase Mode'}
        </Button>
        <Button colorScheme="orange" onClick={clearCanvas} mr={2}>
          Clear Canvas
        </Button>
        <Button colorScheme="yellow" onClick={resetCanvas} mr={2}>
          Reset Canvas
        </Button>
        <Button colorScheme="green" onClick={undoAction} mr={2}>
          Undo
        </Button>
        <Button colorScheme="green" onClick={redoAction}>
          Redo
        </Button>
      </Flex>
    </Box>
  );
}

export default WhiteBoard;
