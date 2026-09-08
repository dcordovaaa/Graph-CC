from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
from app.core.algorithms import get_connected_components_dfs
from app.core.models import GraphRequest
from pydantic import ValidationError

router = APIRouter()

@router.websocket("/ws/algorithm")
async def websocket_algorithm(websocket: WebSocket):
    await websocket.accept()
    generator = None
    
    try:
        while True:
            # Esperamos comandos desde el frontend
            text_data = await websocket.receive_text()
            payload = json.loads(text_data)
            action = payload.get("action")

            if action == "start":
                try:
                    # Validamos que la matriz y 'n' sean correctos antes de arrancar
                    req = GraphRequest(**payload.get("data", {}))
                    generator = get_connected_components_dfs(req.num_nodes, req.adjacency_matrix)
                    await websocket.send_json({
                        "status": "ready", 
                        "message": "Algoritmo inicializado en el servidor. Esperando el primer paso."
                    })
                except ValidationError as e:
                    await websocket.send_json({
                        "status": "error", 
                        "message": "Error de validación matemática", 
                        "details": e.errors()
                    })
                    
            elif action == "next":
                if generator:
                    try:
                        # Extraemos el siguiente "yield" y lo enviamos a React
                        state = next(generator)
                        await websocket.send_json(state)
                    except StopIteration:
                        await websocket.send_json({"status": "error", "message": "El algoritmo ya ha finalizado."})
                else:
                    await websocket.send_json({"status": "error", "message": "Debes iniciar el algoritmo primero."})
                    
    except WebSocketDisconnect:
        # El usuario cerró la pestaña o actualizó la página
        print("Cliente desconectado. Limpiando memoria.")