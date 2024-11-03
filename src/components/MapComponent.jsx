// src/components/MapComponent.jsx

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';
import { getDistanceMatrix } from '../utils/getDistanceMatrix';
import { dijkstraAlgorithm } from '../utils/dijkstra';
import L from 'leaflet';

// Configuring Leaflet default icon settings
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function MapComponent() {
  // State variables for managing markers, graph, distance matrix, optimal path, and path details
  const [markers, setMarkers] = useState([]);
  const [graph, setGraph] = useState({});
  const [distanceMatrix, setDistanceMatrix] = useState([]);
  const [optimalPath, setOptimalPath] = useState([]);
  const [pathDetails, setPathDetails] = useState(null);
  const [pathText, setPathText] = useState('');

  // Function to add a new marker to the map
  const addMarker = (newMarker) => {
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  };

  // Function to calculate the shortest path using Dijkstra's algorithm
  const calculateShortestPath = async () => {
    if (markers.length < 2) return;

    // Extracting coordinates from markers
    const coordinates = markers.map((marker) => ({ lat: marker.lat, lng: marker.lng }));
    const distanceMatrix = await getDistanceMatrix(coordinates);
    setDistanceMatrix(distanceMatrix);

    // Building a graph representation from the distance matrix
    const graph = {};
    markers.forEach((_, i) => {
      graph[i] = {};
      markers.forEach((_, j) => {
        if (i !== j) graph[i][j] = distanceMatrix[i][j];
      });
    });
    setGraph(graph);

    // Running Dijkstra's algorithm to get distances and paths from the start node (0)
    const { distances, previousNodes } = dijkstraAlgorithm(graph, 0);

    // Constructing the optimal path using the nearest unvisited nodes
    const path = [];
    const visitedNodes = new Set();
    let currentNode = "0"; // Start from the initial node

    path.push(currentNode);
    visitedNodes.add(currentNode);

    while (visitedNodes.size < markers.length) {
      let nearestNode = null;
      let minDistance = Infinity;

      for (const node in distances) {
        if (!visitedNodes.has(node) && distances[node] < minDistance) {
          nearestNode = node;
          minDistance = distances[node];
        }
      }

      if (nearestNode !== null) {
        path.push(nearestNode);
        visitedNodes.add(nearestNode);
      } else {
        break;
      }
    }

    // Mapping path indices to actual markers
    const validPath = path
      .map((index) => markers[parseInt(index)])
      .filter((marker) => marker !== undefined);

    setOptimalPath(validPath);

    // Generating a textual representation of the path using arrows
    const pathString = path.map((index) => `Point ${parseInt(index) + 1}`).join(" → ");
    setPathText(pathString);

    setPathDetails({ distances, previousNodes });
  };

  // Function to reset the map and clear all states
  const resetMap = () => {
    setMarkers([]);
    setGraph({});
    setDistanceMatrix([]);
    setOptimalPath([]);
    setPathDetails(null);
    setPathText('');
  };

  // Event handler for adding markers on map click
  const MapEvents = () => {
    useMapEvents({
      click(event) {
        addMarker(event.latlng);
      },
    });
    return null;
  };

  return (
    <div className="map-container">
      <MapContainer center={[23.2599, 77.4126]} zoom={5} className="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <MapEvents />

        {markers.map((position, index) => (
          <Marker key={index} position={position}>
            <Popup>Marker {index + 1}</Popup>
          </Marker>
        ))}

        {optimalPath.length > 1 && (
          <Polyline positions={optimalPath} color="blue" />
        )}
      </MapContainer>

      <div className="sidebar">
        <h2>Selected Locations</h2>
        <ul>
          {markers.map((marker, index) => (
            <li key={index}>
              Point {index + 1}: {marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}
            </li>
          ))}
        </ul>
        <div className="button-group">
          <button className="submit-btn" onClick={calculateShortestPath}>Calculate Optimal Path</button>
          <button className="reset-btn" onClick={resetMap}>Reset</button>
        </div>

        <div className="dijkstra-details">
          <h3>Dijkstra Algorithm Details</h3>
          <h4>Distance Matrix:</h4>
          <pre>{JSON.stringify(distanceMatrix, null, 2)}</pre>

          <h4>Graph:</h4>
          <pre>{JSON.stringify(graph, null, 2)}</pre>

          {pathDetails && (
            <>
              <h4>Distances:</h4>
              <pre>{JSON.stringify(pathDetails.distances, null, 2)}</pre>

              {/* <h4>Previous Nodes:</h4>
              <pre>{JSON.stringify(pathDetails.previousNodes, null, 2)}</pre> */}
            </>
          )}

          <h4>Optimal Path:</h4>
          <p>{pathText}</p>
        </div>
      </div>
    </div>
  );
}

export default MapComponent;
