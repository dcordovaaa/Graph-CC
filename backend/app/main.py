from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.websockets import router as websocket_router

app = FastAPI(title="Motor de Grafos API")

# Evitar bloqueos de CORS entre los puertos locales (Vite usa el 5173 y FastAPI el 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registramos la ruta del WebSocket
app.include_router(websocket_router)