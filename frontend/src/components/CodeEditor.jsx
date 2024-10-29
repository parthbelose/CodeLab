import React from 'react';
import { ResizableBox } from 'react-resizable';
import MonacoEditor from '@monaco-editor/react';

function CodeEditor({ language, code, setCode }) {
  return (
    <ResizableBox 
      width={600} 
      height={400} 
      minConstraints={[300, 200]} 
      maxConstraints={[1000, 600]} 
      style={{ border: '1px solid #4A5568' }}
    >
      <MonacoEditor
        height="100%"
        language={language}
        value={code}
        onChange={(newValue) => setCode(newValue)}
        theme="vs-dark"
      />
    </ResizableBox>
  );
}

export default CodeEditor;
