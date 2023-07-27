import React from 'react';
import Square from './square.js';
import seedrandom from 'seedrandom';

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// The main Grid component
class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: this.props.width,
            height: this.props.height,
            reset: false,
            seed: getRndInteger(1000000000, 9999999999),
            squares: this.generateSquares(this.props.width, this.props.height, this.props.bombs, this.props.seed),
            isGameWon: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.width !== this.props.width ||
            prevProps.height !== this.props.height ||
            prevProps.bombs !== this.props.bombs ||
            prevProps.reset !== this.props.reset ||
            prevProps.seed !== this.props.seed
        ) {
            this.setState({
                width: this.props.width,
                height: this.props.height,
                reset: this.props.reset,
                seed: this.props.seed,
                squares: this.generateSquares(this.props.width, this.props.height, this.props.bombs, (this.props.seed === "" ? getRndInteger(1000000000, 9999999999) : this.props.seed)),
                isGameWon: false,
            });
        }
    }

    generateSquares(width, height, bombs, seed) {
        // Initialize the squares
        const squares = Array.from({length: height}, () => Array.from({length: width}, () => null));

        if(bombs > width * height){
            bombs = width * height;
        }

        // Generate bombs
        let rng = seedrandom(seed);
        let bombLocations = [];
        while (bombLocations.length < bombs) {
            let bombLocation = [Math.floor(rng() * width), Math.floor(rng() * height)];
            if (!bombLocations.some(location => location[0] === bombLocation[0] && location[1] === bombLocation[1])) {
                bombLocations.push(bombLocation);
            }
        }

        const bombSquare = bombLocations.reduce((acc, curr) => {
            acc[curr[1]][curr[0]] = true;
            return acc;
        }, squares);

        this.setState({
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
        });

        return bombSquare.map((row, rowIndex) =>
            row.map((col, colIndex) =>
                ({
                    isBomb: col,
                    clicked: false,
                    isFlagged: false,
                    adjacentBombs: this.calculateAdjacentBombs(bombSquare, rowIndex, colIndex)
                })
            )
        );
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
                    for (let i = 0; i < this.state.height; i++) {
                        for (let j = 0; j < this.state.width; j++) {
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
