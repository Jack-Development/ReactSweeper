import React from 'react';

// Define a small Square component for each gray square
const Square = ({ size, isBomb, adjacentBombs, clicked, onClick, onRightClick, isFlagged, isGameWon}) => {
    const color = clicked ? (isBomb ? (isGameWon ? 'green' : 'red') : 'lightgrey') : 'grey';
    const darkerColor = clicked && isBomb ? (isGameWon ? 'darkgreen' : 'darkred') : 'darkgrey';
    const lighterColor = clicked && isBomb ? (isGameWon ? 'lightgreen' : 'lightcoral') : 'white';

    // Scale inset relative to the size of the box
    const insetSize = size * 0.07;  // Change the multiplier as needed to adjust the scale

    return (
        <div
            onClick={onClick}
            onContextMenu={onRightClick}
            className="Square"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                fontSize: `${size / 2}px`,
                boxShadow: `inset ${insetSize}px ${insetSize}px 0 ${lighterColor}, inset -${insetSize}px -${insetSize}px 0 ${darkerColor}`,
            }}
        >
            {!clicked && isFlagged && "🚩"}
            {clicked && !isBomb && adjacentBombs > 0 && adjacentBombs}
        </div>
    );
};

export default Square;