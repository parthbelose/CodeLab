import React from "react";
import { ResizableBox } from "react-resizable";
import MonacoEditor from "@monaco-editor/react";
import { IconButton, Tooltip } from "@chakra-ui/react";
import { FiCopy } from "react-icons/fi";
function CodeEditor({ code, setCode, language }) {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => alert("Code copied to clipboard!"))
      .catch((err) => console.error("Failed to copy code:", err));
  };

  return (
    <div style={{ position: "relative" }}>
      <ResizableBox
        width={600}
        height={400}
        minConstraints={[300, 200]}
        maxConstraints={[1000, 600]}
        style={{ border: "1px solid #4A5568" }}
      >
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          onChange={(newValue) => setCode(newValue)}
          theme="vs-dark"
        />
      </ResizableBox>
      <Tooltip label="Copy Code" aria-label="Copy Code">
        <IconButton
          icon={<FiCopy />}
          size="sm"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "5px 10px",
          }}
          ml={3}
          onClick={handleCopy}
          colorScheme="blue"
        />
      </Tooltip>
    </div>
  );
}

export default CodeEditor;
