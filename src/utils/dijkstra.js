// src/utils/dijkstra.js

// Dijkstra's algorithm to find the shortest path
export function dijkstraAlgorithm(graph, startNode) {
  const distances = {};  // Track distances to each node
  const visited = new Set();  // Track visited nodes
  const previousNodes = {};  // Track paths

  for (const node in graph) {
    distances[node] = Infinity;
    previousNodes[node] = null;
  }
  distances[startNode] = 0;

  while (visited.size < Object.keys(graph).length) {
    const [closestNode] = Object.entries(distances)
      .filter(([node]) => !visited.has(node))
      .reduce(([minNode, minDist], [node, dist]) => (dist < minDist ? [node, dist] : [minNode, minDist]), [null, Infinity]);

    visited.add(closestNode);

    for (const neighbor in graph[closestNode]) {
      const distance = distances[closestNode] + graph[closestNode][neighbor];
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        previousNodes[neighbor] = closestNode;
      }
    }
  }

  return { distances, previousNodes };
}
