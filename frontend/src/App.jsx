import React, { useState, useCallback } from 'react';
import SetupPanel from './components/SetupPanel';
import GraphCanvas from './components/GraphCanvas';
import AdjacencyMatrix from './components/AdjacencyMatrix';
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const nodeStyle = {
    borderRadius: '50%', width: 50, height: 50, display: 'flex',
    justifyContent: 'center', alignItems: 'center', fontWeight: 'bold',
    border: '2px solid #333', backgroundColor: '#fff', color: '#333'
  };

  // RF-04 y RF-05: Controladores de estado elevados[cite: 1]
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const handleGenerateGraph = (n, mode) => {
    const newNodes = [];
    const newEdges = [];
    const radius = 150;
    const centerX = 250;
    const centerY = 250;

    // Generar Nodos
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * (2 * Math.PI);
      newNodes.push({
        id: i.toString(),
        position: { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) },
        data: { label: i.toString() },
        style: { ...nodeStyle }
      });
    }

    // RF-02: Generación Aleatoria de Aristas[cite: 1]
    if (mode === 'aleatorio') {
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          if (Math.random() > 0.6) { // 40% de probabilidad de conexión
            newEdges.push({
              id: `e${i}-${j}`,
              source: i.toString(),
              target: j.toString(),
            });
          }
        }
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Búsqueda de Componentes Conexas</h2>
      <SetupPanel onGenerate={handleGenerateGraph} />
      
      {nodes.length > 0 ? (
        <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
          <GraphCanvas 
            nodes={nodes} 
            edges={edges} 
            onNodesChange={onNodesChange} 
            onEdgesChange={onEdgesChange} 
            onConnect={onConnect} 
          />
          <AdjacencyMatrix nodes={nodes} edges={edges} />
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666', border: '1px dashed #ccc' }}>
          Configura y genera un grafo para comenzar.
        </div>
      )}
    </div>
  );
}

export default App;