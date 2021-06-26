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
    const [champion, setChampion] = React.useState<string | null>(null)
    const shapes = [alienlogo, clownlogo, frieslogo, nerdlogo, pumpkinlogo];

    const onPlayerMoveHandler = (index1: number, index2: number) => {
        const newmoves = [...moves];

        if(moves[index1][index2] !== ''){
            return;
        }

        if(player === "Player1") {
            newmoves[index1][index2] = "0";
            setMoves(newmoves);
            const result = checkWinner(newmoves);
            if(result !== null) {
                if(result === '0') {
                    setChampion("Player1")
                } 
                else if(result === 'tie') {
                    setChampion("Tied")
                }
                setView("result")
                return
            }
            setPlayer("Player2");
        }
        else {
            newmoves[index1][index2] = "1";
            setMoves(newmoves);
            const result = checkWinner(newmoves);
            if(result !== null) {
                if(result === '1') {
                    setChampion("Player2")
                } 
                else if(result === 'tie') {
                    setChampion("Tied")
                }
                setView("result")
                return
            }
            setPlayer("Player1");
        }
    }

    const onShapeHandler = (index: number) => {
        const newicons = [...icons];

        newicons[0] = shapes[index];
        shapes.splice(index, 1);
        newicons[1] = shapes[Math.floor(Math.random() * 4)];

        setIcons(newicons);
        setView("board");
    }

    function checkEquality(a:string ,b: string,c: string): boolean {
        return a === b && b === c && a !== '';
    }

    function checkWinner(board: string[][]) : string | null {
        let winner = null;
        let slotsleft = 0;

        for(let i=0; i<3; i++) {
            if(checkEquality(board[i][0], board[i][1], board[i][2])) {
                winner = board[i][0];
            }
        }

        for(let i=0; i<3; i++) {
            if(checkEquality(board[0][i], board[1][i], board[2][i])) {
                winner = board[0][i];
            }
        }

        if(checkEquality(board[0][0], board[1][1], board[2][2]) || checkEquality(board[0][2], board[1][1], board[2][0])) {
            winner = board[1][1];
        }

        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                if(board[i][j] === '') {
                    slotsleft = slotsleft + 1;
                }
            }
        }

        if(winner === null && slotsleft === 0) {
            return 'tie'
        }
        else {
            return winner
        }
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
                                                        onClick={() => onPlayerMoveHandler(rowid, cubeid)}>
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
                        </div> :
                            view === "result" ? 
                                <div className="Game--Result">
                                    {champion}
                                </div> : null
            }
        </div>
    )
}

export default Game;