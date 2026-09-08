from app.core.algorithms import get_connected_components_dfs

def test_dfs_identifies_components_correctly():
    # Grafo de 4 nodos: {0, 1} están conectados, {2, 3} están conectados
    num_nodes = 4
    matrix = [
        [0, 1, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 1],
        [0, 0, 1, 0]
    ]
    
    # Ejecutamos el generador hasta el final
    generator = get_connected_components_dfs(num_nodes, matrix)
    final_state = None
    
    for state in generator:
        final_state = state
        
    assert final_state is not None
    assert final_state["status"] == "finished"
    assert final_state["total_components"] == 2 # Debe detectar exactamente 2 componentes
    
    # Verificamos la lista detallada de nodos por componente
    components = final_state["components_details"]
    assert set(components[0]["nodes"]) == {0, 1}
    assert set(components[1]["nodes"]) == {2, 3}