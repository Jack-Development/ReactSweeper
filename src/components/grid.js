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

// The main Grid component
class Grid extends React.Component {
    constructor(props) {
        super(props);
        const { width, height, bombs } = this.props;
        const squares = Array(height).fill().map(() => Array(width).fill(null));

        // Generate bombs
        let bombLocations = [];
        while (bombLocations.length < bombs) {
            let bombLocation = [Math.floor(Math.random()*width), Math.floor(Math.random()*height)];
            if (!bombLocations.some(location => location[0] === bombLocation[0] && location[1] === bombLocation[1])) {
                bombLocations.push(bombLocation);
            }
        }

        const bombSquare = bombLocations.reduce((acc, curr) => {
            acc[curr[1]][curr[0]] = true;
            return acc;
        }, squares);

        this.state = {
            squares: bombSquare.map((row, rowIndex) =>
                row.map((col, colIndex) =>
                    ({
                        isBomb: col,
                        clicked: false,
                        isFlagged: false,
                        adjacentBombs: this.calculateAdjacentBombs(bombSquare, rowIndex, colIndex)
                    })
                )
            ),
            isGameWon: false
        };
    }

    calculateAdjacentBombs(squares, row, col) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        return directions.reduce((acc, curr) => {
            const newRow = row + curr[0];
            const newCol = col + curr[1];

            if(newRow >= 0 && newRow < squares.length && newCol >= 0 && newCol < squares[0].length) {
                return acc + (squares[newRow][newCol] ? 1 : 0);
            }

            return acc;
        }, 0);
    }

    handleClick = (row, col) => {
        this.setState(state => {
            const newSquares = state.squares.map((rowSquares, rowIndex) =>
                rowSquares.map((square, colIndex) => {
                    if (rowIndex === row && colIndex === col) {
                        if(square.isFlagged) {
                            // If square is flagged, ignore the click.
                            return square;
                        } else if (square.isBomb) {
                            // If the clicked square is a bomb, set clicked to true for all squares
                            return {...square, clicked: true};
                        } else {
                            return {...square, clicked: true};
                        }
                    } else {
                        return square;
                    }
                })
            );

            if(!newSquares[row][col].isFlagged) {
                if (newSquares[row][col].isBomb) {
                    // if the clicked square is a bomb, set clicked to true for all squares
                    for (let i = 0; i < newSquares.length; i++) {
                        for (let j = 0; j < newSquares[i].length; j++) {
                            newSquares[i][j].clicked = true;
                        }
                    }
                } else if (newSquares[row][col].adjacentBombs === 0) {
                    const directions = [
                        [-1, -1], [-1, 0], [-1, 1],
                        [0, -1], [0, 1],
                        [1, -1], [1, 0], [1, 1]
                    ];

                    for (let direction of directions) {
                        const newRow = row + direction[0];
                        const newCol = col + direction[1];
                        if (newRow >= 0 && newRow < state.squares.length && newCol >= 0 && newCol < state.squares[0].length) {
                            if (!newSquares[newRow][newCol].clicked) {
                                newSquares[newRow][newCol].clicked = true;
                                if (newSquares[newRow][newCol].adjacentBombs === 0) {
                                    this.handleClick(newRow, newCol);
                                }
                            }
                        }
                    }
                }
            }

            // If all non-bomb squares are clicked, reveal all squares
            const nonBombCount = state.squares.reduce((count, rowSquares) =>
                count + rowSquares.reduce((rowCount, square) => rowCount + (square.isBomb ? 0 : 1), 0), 0);
            const clickedCount = newSquares.reduce((count, rowSquares) =>
                count + rowSquares.reduce((rowCount, square) => rowCount + (square.clicked ? 1 : 0), 0), 0);

            if (nonBombCount === clickedCount) {
                newSquares.forEach(rowSquares => rowSquares.forEach(square => square.clicked = true));
                return {squares: newSquares, isGameWon: true};
            }

            return {squares: newSquares};
        });
    }

    handleRightClick = (event, row, col) => {
        event.preventDefault();
        this.setState(state => {
            const newSquares = state.squares.map((rowSquares, rowIndex) =>
                rowSquares.map((square, colIndex) => {
                    if (rowIndex === row && colIndex === col && !square.clicked) {
                        return {...square, isFlagged: !square.isFlagged};
                    } else {
                        return square;
                    }
                })
            );

            // If all bombs are flagged, reveal all squares
            const bombCount = state.squares.reduce((count, rowSquares) =>
                count + rowSquares.reduce((rowCount, square) => rowCount + (square.isBomb ? 1 : 0), 0), 0);
            const flagCount = newSquares.reduce((count, rowSquares) =>
                count + rowSquares.reduce((rowCount, square) => rowCount + (square.isFlagged ? 1 : 0), 0), 0);
            const correctFlags = newSquares.reduce((count, rowSquares) =>
                count + rowSquares.reduce((rowCount, square) => rowCount + (square.isFlagged ? (square.isBomb ? 1 : 0) : 0), 0), 0);

            if (bombCount === correctFlags && flagCount === correctFlags) {
                newSquares.forEach(rowSquares => rowSquares.forEach(square => {
                    square.clicked = true;
                    if (square.isBomb) {
                        square.isFlagged = true;
                    }
                }));
                return {squares: newSquares, isGameWon: true};
            }

            return {squares: newSquares};
        });
    }

    render() {
        const { width, height, size } = this.props;
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${width}, 1fr)`,
                gridTemplateRows: `repeat(${height}, 1fr)`,
                gridGap: '0',
                width: `${size * width}px`,
                height: `${size * height}px`
            }}>
                {this.state.squares.flatMap((row, i) =>
                    row.map((square, j) => <Square key={`square-${i}-${j}`} size={size} isBomb={square.isBomb}
                                                   adjacentBombs={square.adjacentBombs} clicked={square.clicked}
                                                   onClick={() => this.handleClick(i, j)}
                                                   onRightClick={(e) => this.handleRightClick(e, i, j)} isFlagged={square.isFlagged}
                                                   isGameWon={this.state.isGameWon}
                    />)
                )}
            </div>
        );
    }
}

export default Grid;
