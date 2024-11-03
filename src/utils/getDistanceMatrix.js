// src/utils/getDistanceMatrix.js
export async function getDistanceMatrix(coordinates) {
  const coordinatesString = coordinates.map((coord) => `${coord.lng},${coord.lat}`).join(';');
  const url = `http://router.project-osrm.org/table/v1/driving/${coordinatesString}?annotations=distance`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.distances;
  } catch (error) {
    console.error("Error fetching distance matrix:", error);
    return null;
  }
}
