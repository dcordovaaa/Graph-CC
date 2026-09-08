def get_connected_components_dfs(num_nodes: int, adj_matrix: list[list[int]]):
    visited = [False] * num_nodes
    components = []
    
    # Paleta de colores para diferenciar componentes (RF-09)[cite: 1]
    colors = ["#FF5733", "#33FF57", "#3357FF", "#F033FF", "#33FFF0", 
              "#FFC300", "#C70039", "#900C3F", "#581845", "#1A5276", 
              "#117864", "#D35400"]
    color_idx = 0
    node_colors = {}

    for i in range(num_nodes):
        if not visited[i]:
            current_component = []
            stack = [i]
            current_color = colors[color_idx % len(colors)]
            color_idx += 1

            while stack:
                curr = stack.pop()
                
                if not visited[curr]:
                    visited[curr] = True
                    current_component.append(curr)
                    node_colors[curr] = current_color
                    
                    # RF-08: Estado visual durante el análisis[cite: 1]
                    yield {
                        "status": "in_progress",
                        "action": f"Visitando vértice {curr}",
                        "current_node": curr,
                        "visited": list(visited),
                        "node_colors": dict(node_colors)
                    }

                    # Agregar vecinos a la pila
                    for j in range(num_nodes - 1, -1, -1):
                        if adj_matrix[curr][j] == 1 and not visited[j]:
                            stack.append(j)
            
            components.append({
                "component_id": color_idx,
                "color": current_color,
                "nodes": current_component
            })
            
            # RF-09: Componente descubierta[cite: 1]
            yield {
                "status": "component_found",
                "action": f"Componente conexa {color_idx} identificada",
                "completed_component": current_component,
                "node_colors": dict(node_colors)
            }
            
    # RF-10 y RF-11: Reporte final y lista detallada[cite: 1]
    yield {
        "status": "finished",
        "action": "Algoritmo finalizado",
        "total_components": len(components),
        "components_details": components
    }