import React, { useState } from 'react';

export default function SetupPanel({ onGenerate }) {
  const [numNodes, setNumNodes] = useState(4);
  const [mode, setMode] = useState('manual');
  const [error, setError] = useState('');

  const handleGenerate = () => {
    const n = parseInt(numNodes, 10);
    
    // Validación de entradas y manejo de errores (RF-01 y RNF-01)
    if (isNaN(n) || n < 4 || n > 12) {
      setError('Error: La cantidad de nodos debe ser un número entero entre 4 y 12.');
      return;
    }
    
    setError('');
    onGenerate(n, mode);
  };

  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ marginTop: 0 }}>Configuración Inicial</h3>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div>
          <label style={{ fontWeight: 'bold' }}>Cantidad de nodos (n): </label>
          <input 
            type="number" 
            value={numNodes} 
            onChange={(e) => setNumNodes(e.target.value)} 
            min="4" 
            max="12"
            style={{ width: '60px', padding: '5px' }}
          />
        </div>
        <div>
          <label style={{ fontWeight: 'bold' }}>Generación: </label>
          <select value={mode} onChange={(e) => setMode(e.target.value)} style={{ padding: '5px' }}>
            <option value="manual">Manual</option>
            <option value="aleatorio">Aleatorio</option>
          </select>
        </div>
        <button 
          onClick={handleGenerate}
          style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Generar Grafo
        </button>
      </div>
      {error && <p style={{ color: 'red', margin: '10px 0 0 0', fontWeight: 'bold' }}>{error}</p>}
    </div>
  );
}