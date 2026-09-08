import React from 'react';

export default function ControlPanel({ onStart, onNext, statusText, isConnected, isFinished }) {
  return (
    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0 }}>Ejecución del Algoritmo (DFS)</h3>
      
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
        <button 
          onClick={onStart}
          disabled={!isConnected}
          style={{ padding: '8px 16px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: isConnected ? 'pointer' : 'not-allowed' }}
        >
          Iniciar Algoritmo
        </button>
        
        <button 
          onClick={onNext}
          disabled={!isConnected || isFinished}
          style={{ padding: '8px 16px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: (!isConnected || isFinished) ? 'not-allowed' : 'pointer' }}
        >
          Siguiente Paso
        </button>

        <span style={{ fontSize: '14px', fontWeight: 'bold', color: isConnected ? 'green' : 'red' }}>
          {isConnected ? '● Servidor Conectado' : '○ Desconectado'}
        </span>
      </div>

      <div style={{ padding: '10px', backgroundColor: '#fff', border: '1px dashed #ccc', minHeight: '40px' }}>
        <strong>Estado actual: </strong> {statusText || 'Esperando inicio...'}
      </div>
    </div>
  );
}