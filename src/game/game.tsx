import React from 'react';

import alienlogo from '../images/alien.png';
import clownlogo from '../images/clown.png';
import frieslogo from '../images/fries.png';
import nerdlogo from '../images/nerd.png';
import pumpkinlogo from '../images/pumpkin.png';
import './game.css';

interface Props {
    type: string
}

const Game : React.FC<Props> = (props) => {

    const [player, setPlayer] = React.useState<string>("Player1");
    const [moves, setMoves] = React.useState<string[][]>([["","",""],["","",""],["","",""]]);

    const onMoveHandler = (index1: number, index2: number) => {
        const newmoves = [...moves];
        if(player === "Player1") {
            newmoves[index1][index2] = "0";
            setPlayer("Player2");
        }
        else {
            newmoves[index1][index2] = "X";
            setPlayer("Player1");
        }
        setMoves(newmoves);
    }

    return (
        <div className="Game">
            <div className="Game--Board">
                {
                    moves.map((rows, rowid) => {
                        return (
                            <div className="Game--BoardRow" key={rowid}>
                                {
                                    rows.map((cube, cubeid) => {
                                        return(
                                            <div className="Game--BoardCube" key={cubeid} onClick={() => onMoveHandler(rowid, cubeid)}>{cube}</div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Game;