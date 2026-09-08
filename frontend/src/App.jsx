import React, { useState, useCallback, useEffect } from 'react';
import SetupPanel from './components/SetupPanel';
import GraphCanvas from './components/GraphCanvas';
import AdjacencyMatrix from './components/AdjacencyMatrix';
import ControlPanel from './components/ControlPanel';
import useWebSocket from './hooks/useWebSocket';
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';

// URL local del backend
const WS_URL = "ws://127.0.0.1:8000/ws/algorithm";

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [statusText, setStatusText] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  // Hook de WebSocket
  const { isConnected, messages, sendMessage, clearMessages } = useWebSocket(WS_URL);

  const nodeStyle = {
    borderRadius: '50%', width: 50, height: 50, display: 'flex',
    justifyContent: 'center', alignItems: 'center', fontWeight: 'bold',
    border: '2px solid #333', backgroundColor: '#fff', color: '#333',
    transition: 'background-color 0.3s ease'
  };

  // Escuchar los mensajes del backend para actualizar los colores de los nodos
  useEffect(() => {
    if (messages.length === 0) return;
    
    const latestMessage = messages[messages.length - 1];
    
    // Mostrar el texto de acción en el panel
    if (latestMessage.action) setStatusText(latestMessage.action);
    
    if (latestMessage.status === 'finished') {
      setIsFinished(true);
    }

    // Actualizar colores basándose en la respuesta del backend
    if (latestMessage.node_colors) {
      setNodes((nds) => 
        nds.map((node) => {
          const color = latestMessage.node_colors[parseInt(node.id)];
          
          // Si el nodo actual está en análisis (RF-08), lo pintamos amarillo
          if (latestMessage.current_node !== undefined && latestMessage.current_node.toString() === node.id) {
             return { ...node, style: { ...nodeStyle, backgroundColor: '#ffeb3b' } };
          }
          
          // Si el nodo ya tiene un color de componente asignado (RF-09)
          if (color) {
            return { ...node, style: { ...nodeStyle, backgroundColor: color, color: '#fff' } };
          }
          
          return node;
        })
      );
    }
  }, [messages]);


  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const handleGenerateGraph = (n, mode) => {
    // ... (Mismo código de generación de nodos y aristas de la Fase 3) ...
    // NOTA: Asegúrate de mantener aquí la lógica de distribución circular y aristas aleatorias
    
    const newNodes = [];
    const newEdges = [];
    const radius = 150;
    const centerX = 250;
    const centerY = 250;

    for (let i = 0; i < n; i++) {
      const angle = (i / n) * (2 * Math.PI);
      newNodes.push({
        id: i.toString(),
        position: { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) },
        data: { label: i.toString() },
        style: { ...nodeStyle }
      });
    }

    if (mode === 'aleatorio') {
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          if (Math.random() > 0.6) {
            newEdges.push({ id: `e${i}-${j}`, source: i.toString(), target: j.toString() });
          }
        }
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
    clearMessages();
    setIsFinished(false);
    setStatusText("Grafo generado. Esperando inicio.");
  };

  // Función auxiliar para extraer la matriz de adyacencia pura a partir del estado de React
  const getMatrixForBackend = () => {
    const n = nodes.length;
    const matrix = Array(n).fill().map(() => Array(n).fill(0));
    edges.forEach((edge) => {
      const u = parseInt(edge.source, 10);
      const v = parseInt(edge.target, 10);
      matrix[u][v] = 1;
      matrix[v][u] = 1; 
    });
    return matrix;
  };

  const handleStartAlgorithm = () => {
    clearMessages();
    setIsFinished(false);
    
    // Limpiamos los colores visuales antes de iniciar
    setNodes((nds) => nds.map(node => ({ ...node, style: { ...nodeStyle } })));

    sendMessage("start", {
      num_nodes: nodes.length,
      adjacency_matrix: getMatrixForBackend()
    });
  };

  const handleNextStep = () => {
    sendMessage("next");
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Búsqueda de Componentes Conexas</h2>
      <SetupPanel onGenerate={handleGenerateGraph} />
      
      {nodes.length > 0 && (
        <>
          <ControlPanel 
            onStart={handleStartAlgorithm} 
            onNext={handleNextStep} 
            statusText={statusText}
            isConnected={isConnected}
            isFinished={isFinished}
          />
          <div style={{ display: 'flex', gap: '20px', flexDirection: 'column', marginTop: '20px' }}>
            <GraphCanvas nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} />
            <AdjacencyMatrix nodes={nodes} edges={edges} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;