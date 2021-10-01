import React, {useRef} from "react";
import ReactDOM from "react-dom";
import './grid.scss';

const gridSizeX = 30;
const gridSizeY = 15;
let grid = null;

function Grid() {
    grid = createGrid();
    console.log(grid);
    return (
        <div className="grid">
            <table>
                <tbody>
                {[...Array(gridSizeY)].map((Tiles, j) => {
                        return (<tr>{[...Array(gridSizeX)].map((Tile, i) => {
                                return (
                                    <td key={`${i},${j}`}>
                                        {makeBox(i, j)}
                                    </td>
                                )
                            }
                        )}</tr>)
                    }
                )}</tbody>
            </table>
        </div>
    );
}

function createGrid() {
    let tempGrid = [[]];
    for (let i = 0; i < gridSizeX; i++) {
        tempGrid[i] = [];
        for (let j = 0; j < gridSizeY; j++) {
            let number = Math.floor(Math.random() * 9);
            let bomb = false;
            tempGrid[i][j] = new Properties(number, false, bomb);
        }
    }
    return tempGrid;
}

function makeBox(x, y) {
    return <Box posX={x} posY={y} key={`${x},${y} Tile`}/>;
}

function revealNeighbour(posX, posY){
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            let gridX = posX + i;
            let gridY = posY + j;
            if (gridX >= 0 && gridX < gridSizeX && gridY >= 0 && gridY < gridSizeY) {
                if (!grid[posX][posY].getBomb() && grid[posX][posY].getNumber() === 0 && !grid[posX][posY].getVisible()){
                    grid[gridX][gridY].setVisible(true);
                    revealNeighbour(gridX, gridY);
                }else {
                    grid[gridX][gridY].setVisible(true);
                }
            }
        }
    }
}

class Properties {
    constructor(number, isVisible, isBomb) {
        this.number = number;
        this.isVisible = isVisible;
        this.isBomb = isBomb;
    }

    setVisible(newVisible){
        this.isVisible = newVisible;
    }

    getNumber(){
        return this.number;
    }
    getVisible(){
        return this.isVisible;
    }
    getBomb(){
        return this.isBomb;
    }

}

class Box extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posX: props.posX,
            posY: props.posY,
            isFlag: props.isFlag
        };
        this.blockClick = this.blockClick.bind(this);
        this.tileRef = React.createRef();
    }

    getPosX() {
        return this.constructor.name
    }

    getPosY() {
        return this;
    }

    blockClick(event) {
        if (event.button === 0 && !this.state.isFlag && !grid[this.state.posX][this.state.posY].getVisible()) {
            grid[this.state.posX][this.state.posY].setVisible(true);
            if (!grid[this.state.posX][this.state.posY].getBomb() && grid[this.state.posX][this.state.posY].getNumber() === 0) {
                revealNeighbour(this.state.posX, this.state.posY);
            }
            this.forceUpdate();
        } else if (event.button === 2) {
            event.preventDefault();
            this.setState({
                isFlag: !this.state.isFlag
            })
        }
        console.log(grid[this.state.posX][this.state.posY].getVisible());
    }

    setText() {
        // Can be expressed as:
        // this.state.isVisible ? `${this.state.tile.checkBomb() ? "X" : `${this.state.tile.getNum() || ""}`}` : `${this.state.isFlag ? '?' : ''}`
        if (grid[this.state.posX][this.state.posY].getVisible()) {
            if (grid[this.state.posX][this.state.posY].getBomb()) {
                return "X";
            } else {
                return (grid[this.state.posX][this.state.posY].getNumber() || "");
            }
        } else {
            if (this.state.isFlag) {
                return "?";
            } else {
                return "";
            }
        }
    }

    render() {
        return (
            <div className='block' id={`${this.state.posY},${this.state.posX} Tile`} ref={this.tileRef}>
                <button onClick={this.blockClick} onContextMenu={this.blockClick}
                        className={`${grid[this.state.posX][this.state.posY].getVisible() ? `isClicked ${grid[this.state.posX][this.state.posY].getBomb() ? "isBomb" : ""}` : ""}`}>
                    <p>{this.setText()}</p>
                </button>
            </div>
        )
    }
}

export default Grid;