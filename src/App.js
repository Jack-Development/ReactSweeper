import React from 'react';
import Grid from './components/grid.js';
import './App.css';

function App() {
  return (
      <div className="Grid">
        <Grid width={5} height={5} size={70} bombs={5} />
      </div>
  );
}

export default App;
