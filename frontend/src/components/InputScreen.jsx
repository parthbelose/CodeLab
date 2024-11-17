import React from "react";
import { ResizableBox } from "react-resizable";
import { Textarea } from "@chakra-ui/react";

function InputScreen({ input, setInput }) {
  return (
    <ResizableBox
      width={400}
      height={150}
      minConstraints={[300, 100]}
      maxConstraints={[600, 300]}
    >
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter input for your code here..."
        backgroundColor="gray.800"
        color="white"
        height="100%"
        border="1px solid #4A5568"
      />
    </ResizableBox>
  );
}

export default InputScreen;
