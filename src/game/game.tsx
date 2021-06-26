import React from 'react';

import alienlogo from '../images/alien.png';
import clownlogo from '../images/clown.png';
import frieslogo from '../images/fries.png';
import nerdlogo from '../images/nerd.png';
import pumpkinlogo from '../images/pumpkin.png';
import './game.css';


const Game = () => {

    const [view, setView] = React.useState<string>("choose");
    const [player, setPlayer] = React.useState<string>("Player");
    const [moves, setMoves] = React.useState<string[][]>([["","",""],["","",""],["","",""]]);
    const [icons, setIcons] = React.useState([alienlogo, clownlogo]);
    const [champion, setChampion] = React.useState<string | null>(null)

    const shapes = [alienlogo, clownlogo, frieslogo, nerdlogo, pumpkinlogo];

    const onMoveHandler = (index1: number, index2: number) => {
        const newmoves = [...moves];

        if(player === "Player") {
            newmoves[index1][index2] = "0";
            setMoves(newmoves)
            const result = checkWinner(moves);
            if(result !== null) {
                if(result === 1) {
                    setChampion("Player")
                } 
                else if(result === 0) {
                    setChampion("Tied")
                }
                setView("result")
            }
            setPlayer("Computer");
        }
        else {
            newmoves[index1][index2] = "1";
            setMoves(newmoves);
            setPlayer("Player");
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

    function checkWinner(board: string[][]) : number | null {
        let winner = null;
        let winnerfound = false;
        let slotsleft = false;

        // Checking horizontally
        for(let i=0; i<3; i++) {
            if(checkEquality(board[i][0], board[i][1], board[i][2])) {
                winnerfound = true;
            }
        }

        //Checking vertically
        for(let i=0; i<3; i++) {
            if(checkEquality(board[0][i], board[1][i], board[2][i])) {
                winnerfound = true;
            }
        }

        //Checking diagonally
        if(checkEquality(board[0][0], board[1][1], board[2][2]) || checkEquality(board[0][2], board[1][1], board[2][0])) {
            winnerfound = true;
        }

        //Checking slot availability
        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                if(board[i][j] === '') {
                    slotsleft = true;
                    break;
                }
            }
        }

        if(!slotsleft && !winnerfound) {
            winner = 0;
        }
        else if(slotsleft) {
            if(winnerfound) {
                winner = player === "Player" ? 1 : -1
            }
        }

        return winner
    }

    // const computerAI = (board: string[][], depth: number, isMaximizing: boolean) => {
    //     if(isMaximizing)
    // }

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