import React, { useState } from 'react';
import Grid from './components/grid.js';
import './App.css';

function App() {
    const [width, setWidth] = useState(5);
    const [height, setHeight] = useState(5);
    const [size, setSize] = useState(70);
    const [bombs, setBombs] = useState(5);
    const [seed, setSeed] = useState('');
    const [reset, setReset] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="App">
            <div className={`sidebar ${showSettings ? 'show' : ''}`}>
                <button className="close-btn" onClick={() => setShowSettings(!showSettings)}>X</button>
                <div className="input-item">
                    <label>Width: </label>
                    <input type="number" value={width} onChange={e => setWidth(e.target.value)} />
                </div>
                <div className="input-item">
                    <label>Height: </label>
                    <input type="number" value={height} onChange={e => setHeight(e.target.value)} />
                </div>
                <div className="input-item">
                    <label>Size: </label>
                    <input type="number" value={size} onChange={e => setSize(e.target.value)} />
                </div>
                <div className="input-item">
                    <label>Bombs: </label>
                    <input type="number" value={bombs} onChange={e => setBombs(e.target.value)} />
                </div>
                <div className="input-item">
                    <label>Seed: </label>
                    <input type="text" value={seed} onChange={e => setSeed(e.target.value)} />
                </div>
                <button className="reset-button" onClick={() => setReset(!reset)}>
                    New Game
                </button>
            </div>
            <button className="hamburger" onClick={() => setShowSettings(!showSettings)}>≡</button>
            <div className="Grid">
                <Grid width={width} height={height} size={size} bombs={bombs} reset={reset} seed={seed}/>
            </div>
        </div>
    );
}

export default App;
