// src/App.jsx

import React from 'react'; 
import './App.css';
import MapComponent from './components/MapComponent';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Travel Planner</h1>
      </header>
      <main>
        <MapComponent />
      </main>
    </div>
  );
}

export default App;
// Exporting the App component as the default export
