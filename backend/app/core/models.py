from pydantic import BaseModel, Field, field_validator
from typing import List

class GraphRequest(BaseModel):
    # RF-01: Validación estricta del número de nodos entre 4 y 12[cite: 1]
    num_nodes: int = Field(..., ge=4, le=12, description="Cantidad de nodos n")
    
    # RF-06: Matriz de adyacencia[cite: 1]
    adjacency_matrix: List[List[int]]

    @field_validator('adjacency_matrix')
    def validate_matrix_size(cls, v, info):
        n = info.data.get('num_nodes')
        if n is not None:
            if len(v) != n or any(len(row) != n for row in v):
                raise ValueError(f"La matriz debe ser de tamaño {n}x{n}")
        return v