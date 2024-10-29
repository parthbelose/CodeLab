// src/components/OutputScreen.jsx
import React from 'react';
import { ResizableBox } from 'react-resizable';

function OutputScreen({ output }) {
  return (
    <ResizableBox width={400} height={200} minConstraints={[300, 100]} maxConstraints={[600, 400]}>
      <div style={{ backgroundColor: '#2D3748', color: 'white', padding: '10px', borderRadius: 'md', height: '100%' }}>
        {output || "Output will be displayed here..."}
      </div>
    </ResizableBox>
  );
}

export default OutputScreen;
