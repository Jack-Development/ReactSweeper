import React from 'react';
import './App.scss';

function App() {
    let gridSizeX = 30;
    let gridSizeY = 15;
    let gridTile = generateGrid(gridSizeY, gridSizeX);

    return (
        <div className="grid">
            <table>
            {gridTile.map(gridTile => {
                    return (<tr>{gridTile.map(tile => {
                            tile.setNum(0);
                            return (
                                <td>
                                <Box tile={tile}/>
                                </td>
                            )
                        }
                    )}</tr>)
                }
            )}
            </table>
        </div>
    );
}

function generateGrid(gridSizeX, gridSizeY){
    let tempGrid = [[]];
    for (let i = 0; i < gridSizeX; i++) {
        tempGrid[i] = [];
        for (let j = 0; j < gridSizeY; j++) {
            if(i === 0 && j === 0)
                tempGrid[i][j] = new Tile(i, j, true, false);
            else
                tempGrid[i][j] = new Tile(i, j, false, false);
        }
    }
    return tempGrid;
}

class Box extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBomb: props.tile.checkBomb(),
            isVisible: props.tile.getVisible(),
            tile: props.tile
        };
        this.blockClick = this.blockClick.bind(this);
    }

    blockClick(){
        this.setState({
            isVisible: true
        });
    }

    render() {
        return (
            <div className='block'>
                <button onClick={this.blockClick} className={`${this.state.isVisible ? "isClicked" : ""}`}>
                    <p>{this.state.tile.checkBomb() ? "X" : ""}</p>
                </button>
            </div>
        )
    }
}

class Tile {
    constructor(posX, posY, isBomb, isVisible) {
        this.posX = posX;
        this.posY = posY;
        this.isBomb = isBomb;
        this.isVisible = isVisible;
    }

    checkBomb() {
        return this.isBomb;
    }
    setVisible(isvisible){
        this.isVisible = isvisible;
    }
    getVisible(){
        return this.isVisible;
    }

    setNum(num) {
        this.num = num;
    }

    getNum() {
        return this.num;
    }

}

export default App;
