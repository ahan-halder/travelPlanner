// src/utils/getDistanceMatrix.js

// Function to get the distance matrix from OSRM (Open Source Routing Machine)
export async function getDistanceMatrix(coordinates) {
  // Convert coordinates to a string format: "lng,lat;lng,lat"
  const coordinatesString = coordinates.map((coord) => `${coord.lng},${coord.lat}`).join(';');
  
  // Construct the URL for the OSRM distance matrix API
  const url = `http://router.project-osrm.org/table/v1/driving/${coordinatesString}?annotations=distance`;

  try {
    // Fetch the distance matrix from the API
    const response = await fetch(url);
    const data = await response.json();
    return data.distances; // Return the distance matrix
  } catch (error) {
    // Log any errors that occur during the fetch
    console.error("Error fetching distance matrix:", error);
    return null; // Return null in case of an error
  }
}
