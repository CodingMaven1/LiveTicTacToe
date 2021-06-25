import React from 'react';

import Board from './game/game';

import './app.css';

const App = () => {
    return (
        <div className="App">
            <Board type="cross" />
        </div>
    )
}

export default App;