import React from 'react';

export default function AdjacencyMatrix({ nodes, edges }) {
  const n = nodes.length;
  if (n === 0) return null;

  // Inicializar matriz n x n con ceros
  const matrix = Array(n).fill().map(() => Array(n).fill(0));

  // Llenar la matriz basándose en las aristas (grafo no dirigido)
  edges.forEach((edge) => {
    const u = parseInt(edge.source, 10);
    const v = parseInt(edge.target, 10);
    if (!isNaN(u) && !isNaN(v)) {
      matrix[u][v] = 1;
      matrix[v][u] = 1; // Espejo, ya que la conexión es bidireccional
    }
  });

  return (
    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0 }}>Matriz de Adyacencia</h3>
      <table style={{ borderCollapse: 'collapse', textAlign: 'center', backgroundColor: '#fff' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px', border: '1px solid #ccc', backgroundColor: '#eee' }}>V</th>
            {nodes.map((node) => (
              <th key={`col-${node.id}`} style={{ padding: '8px', border: '1px solid #ccc', backgroundColor: '#eee' }}>
                {node.data.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={`row-${i}`}>
              <td style={{ padding: '8px', border: '1px solid #ccc', backgroundColor: '#eee', fontWeight: 'bold' }}>
                {i}
              </td>
              {row.map((val, j) => (
                <td 
                  key={`cell-${i}-${j}`} 
                  style={{ 
                    padding: '8px', 
                    border: '1px solid #ccc',
                    color: val === 1 ? '#d32f2f' : '#ccc', // Resaltar los 1s
                    fontWeight: val === 1 ? 'bold' : 'normal'
                  }}
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}