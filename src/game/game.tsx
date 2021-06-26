import React from 'react';

import alienlogo from '../images/alien.png';
import clownlogo from '../images/clown.png';
import frieslogo from '../images/fries.png';
import nerdlogo from '../images/nerd.png';
import pumpkinlogo from '../images/pumpkin.png';
import './game.css';


const Game = () => {

    const [view, setView] = React.useState<string>("choose");
    const [player, setPlayer] = React.useState<string>("Player1");
    const [moves, setMoves] = React.useState<string[][]>([["","",""],["","",""],["","",""]]);
    const [icons, setIcons] = React.useState([alienlogo, clownlogo]);

    const shapes = [alienlogo, clownlogo, frieslogo, nerdlogo, pumpkinlogo];

    const onMoveHandler = (index1: number, index2: number) => {
        const newmoves = [...moves];
        if(player === "Player1") {
            newmoves[index1][index2] = "0";
            setPlayer("Player2");
        }
        else {
            newmoves[index1][index2] = "1";
            setPlayer("Player1");
        }
        setMoves(newmoves);
    }

    const onShapeHandler = (index: number) => {
        const newicons = [...icons];

        newicons[0] = shapes[index];
        shapes.splice(index, 1);
        newicons[1] = shapes[Math.floor(Math.random() * 4)];

        setIcons(newicons);
        setView("board");
    }

    return (
        <div className="Game">
            {
                view === "choose" ? 
                    <div className="Game--Choose">
                        {
                            shapes.map((shape, shapeid) => {
                                return (
                                    <div className="Game--ChooseCube" key={shapeid} onClick={() => onShapeHandler(shapeid)}>
                                        <img src={shape} className="Game--BoardIcon" alt="shape" />
                                    </div>
                                )
                            })
                        }
                    </div> : 
                    view === "board" ? 
                        <div className="Game--Board">
                        {
                            moves.map((rows, rowid) => {
                                return (
                                    <div className="Game--BoardRow" key={rowid}>
                                        {
                                            rows.map((cube, cubeid) => {
                                                return(
                                                    <div className="Game--BoardCube" key={cubeid} 
                                                        style={{ backgroundColor: cube === "0" ? "#FFD651" : cube === "1" ? "#07B4FF" : 'transparent' }}
                                                        onClick={() => onMoveHandler(rowid, cubeid)}>
                                                        {
                                                            cube === "0" ? 
                                                                <img src={icons[0]} className="Game--BoardIcon" alt="player1icon" /> : 
                                                                cube === "1" ?
                                                                    <img src={icons[1]} className="Game--BoardIcon" alt="player1icon" /> : null
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div> : null
            }
        </div>
    )
}

export default Game;