import React from 'react';
import './App.scss';

function App() {
  return (
    <div className="grid">
        <Box/>
    </div>
  );
}

class Box extends React.Component{
    constructor() {
        super();
        this.state = {
            posX: 0,
            posY: 0,
            num: 10
        };
    }

  render(){
    return(
      <div className='block'>
            <button>{this.state.num}</button>
      </div>
    )
  }
}

export default App;
