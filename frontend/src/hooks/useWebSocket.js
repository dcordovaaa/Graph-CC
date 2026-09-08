import { useState, useEffect, useRef, useCallback } from 'react';

export default function useWebSocket(url) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  // Inicializar la conexión
  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => setIsConnected(true);
    
    ws.current.onclose = () => setIsConnected(false);
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [url]);

  // Limpiar el historial de mensajes al reiniciar el algoritmo
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Enviar acciones al backend (start, next)
  const sendMessage = useCallback((action, data = null) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action, data }));
    } else {
      console.error("El WebSocket no está conectado.");
    }
  }, []);

  return { isConnected, messages, sendMessage, clearMessages };
}