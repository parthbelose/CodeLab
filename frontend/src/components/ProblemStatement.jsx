import React from "react";
import { ResizableBox } from "react-resizable";
import { Textarea } from "@chakra-ui/react";

function ProblemStatement({ problem, setProblem }) {
  return (
    <ResizableBox
      width={600}
      height={200}
      minConstraints={[300, 100]}
      maxConstraints={[1000, 300]}
    >
      <Textarea
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        placeholder="Write your problem statement here..."
        backgroundColor="gray.800"
        color="white"
        height="100%"
        border="1px solid #4A5568"
      />
    </ResizableBox>
  );
}

export default ProblemStatement;
