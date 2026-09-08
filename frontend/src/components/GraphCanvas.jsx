import React from 'react';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background
} from 'reactflow';
import 'reactflow/dist/style.css';

export default function GraphCanvas({ nodes, edges, onNodesChange, onEdgesChange, onConnect }) {
  return (
    <div style={{ width: '100%', height: '500px', border: '1px solid #ccc', backgroundColor: '#fff' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}