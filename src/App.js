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
            let num = Math.floor(Math.random() * 9);
            tempGrid[i][j].setNum(num);
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
            isFlag: props.tile.getFlag(),
            tile: props.tile
        };
        this.blockClick = this.blockClick.bind(this);
    }

    blockClick(event){
        if(event.button === 0 && !this.state.isFlag) {
            this.setState({
                isVisible: true
            });
            console.log(this.state.tile.getNum());
        }
        else if(event.button === 2){
            event.preventDefault();
            this.setState({
                isFlag: !this.state.isFlag
            })
        }
    }


    render() {
        return (
            <div className='block'>
                <button onClick={this.blockClick} onContextMenu={this.blockClick} className={`${this.state.isVisible ? "isClicked" : ""}`}>
                    <p>{this.state.isVisible ? `${this.state.tile.checkBomb() ? "X" : `${this.state.tile.getNum() || ""}`}` : `${this.state.isFlag ? '?' : ''}`} </p>
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
        this.num = null;
        this.isFlag = false;
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

    setFlag(isFlag){
        this.isFlag = isFlag;
    }
    getFlag(){
        return this.isFlag;
    }

    setNum(num) {
        this.num = num;
    }
    getNum() {
        return this.num;
    }

}

export default App;
