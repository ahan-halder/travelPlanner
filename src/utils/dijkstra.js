// src/utils/dijkstra.js

// Dijkstra's algorithm to find the shortest path from a start node in a graph
export function dijkstraAlgorithm(graph, startNode) {
  const distances = {};  // Object to store the shortest distance to each node
  const visited = new Set();  // Set to track visited nodes
  const previousNodes = {};  // Object to store the previous node in the optimal path

  // Initialize distances and previous nodes
  for (const node in graph) {
    distances[node] = Infinity;  // Set initial distances to infinity
    previousNodes[node] = null;  // Set previous nodes to null
  }
  distances[startNode] = 0;  // Distance to the start node is 0

  // Loop until all nodes are visited
  while (visited.size < Object.keys(graph).length) {
    // Find the closest unvisited node
    const [closestNode] = Object.entries(distances)
      .filter(([node]) => !visited.has(node))
      .reduce(([minNode, minDist], [node, dist]) => (dist < minDist ? [node, dist] : [minNode, minDist]), [null, Infinity]);

    visited.add(closestNode);  // Mark the node as visited

    // Update distances to neighboring nodes
    for (const neighbor in graph[closestNode]) {
      const distance = distances[closestNode] + graph[closestNode][neighbor];
      if (distance < distances[neighbor]) {  // Check if a shorter path is found
        distances[neighbor] = distance;  // Update the shortest distance
        previousNodes[neighbor] = closestNode;  // Update the previous node
      }
    }
  }

  // Return the distances and the path details
  return { distances, previousNodes };
}
