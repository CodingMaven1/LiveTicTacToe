import React, { useEffect } from 'react';
import { io } from "socket.io-client";
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { url } from '../data/constants';

import alienlogo from '../images/alien.png';
import clownlogo from '../images/clown.png';
import frieslogo from '../images/fries.png';
import nerdlogo from '../images/nerd.png';
import pumpkinlogo from '../images/pumpkin.png';
import replaylogo from '../images/replay.png';
import './game.css';

const Game = () => {

    const socket = io(url);
    const [view, setView] = React.useState<string>("initialize");
    const [newgame, setNewGame] = React.useState<null | boolean>(null);
    const [player, setPlayer] = React.useState<string>("");
    const [name, setName] = React.useState<string[]>(["",""]);
    const [roomURL, setRoomURL] = React.useState<string>("");
    const [roomID, setRoomID] = React.useState<string>("");
    const [moves, setMoves] = React.useState<string[][]>([["","",""],["","",""],["","",""]]);
    const [icons, setIcons] = React.useState([undefined, undefined]);
    const [champion, setChampion] = React.useState<string | null>(null);
    const [copied, setCopied] = React.useState<boolean>(false);
    const [shapes, setShapes] = React.useState([alienlogo, clownlogo, frieslogo, nerdlogo, pumpkinlogo]);

    const fixedshapes = [alienlogo, clownlogo, frieslogo, nerdlogo, pumpkinlogo];

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const roomid = query.get('roomid');

        if(roomid !== null) {
            setRoomURL(window.location.href);
        }

    }, []);

    useEffect(() => {
        socket.on('newgame', data => {
            setRoomURL(data.url);
            setRoomID(data.room);
        });

        if(newgame) {
            socket.on('creator', data => {
                const newicons = [...icons];
                const newname = [...name];
                newicons[1] = fixedshapes[data.icon];
                newname[1] = data.name;
                setIcons(newicons);
                setName(newname);
                setPlayer(newname[0]);
            });
        }
        else {
            socket.on('opponent', () => {
                setView("board");
                setPlayer(name[1]);
            });
        }

        socket.on('turnplayed', data => {
            const newmoves = [...moves];
            newmoves[parseInt(data.index1)][parseInt(data.index2)] = data.chance === name[0] ? "1" : "0";
            setMoves(newmoves);
            setPlayer(data.chance);
        });

        socket.on('gameend', data => {
            setChampion(data.champion);
            setView("result");
        });

    });

    const onTypeHandler = (event: React.MouseEvent, type: string) => {
        event.preventDefault();

        if(type === "new") {
            setNewGame(true)
            setView("choose");
        }
        else {
            setNewGame(false);
            const query = new URLSearchParams(window.location.search);
            const roomid = query.get('roomid');
            const creator = query.get('name');
            const icon = query.get('icon');
            if( icon !== null && creator !== null && roomid !== null ) {
                const index = parseInt(icon);
                const newicons = [...icons];
                const newname = [...name];
                newicons[1] = shapes[index];
                newname[1] = creator;
                setIcons(newicons);
                shapes.splice(index, 1);
                setShapes(shapes);
                setName(newname);
                setView("choose");
                setRoomID(roomid);
            }
        }
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        switch(type) {
            case "name":
                const newname = [...name];
                newname[0] = e.target.value;
                setName(newname);
                break;
            case "room":
                setRoomURL(e.target.value);
                break;
            default: 
                break;
        }
    }

    const onShapeHandler = (index: number) => {
        const newicons = [...icons];

        newicons[0] = shapes[index];
        setIcons(newicons);
    }

    const onGameStartHandler = () => {

        if(newgame) {
            const index = shapes.indexOf(icons[0])
            const data = {
                name: name[0],
                icon: index
            }
            socket.emit('creategame', data);
            setView("board");
        }
        else {
            const index = fixedshapes.indexOf(icons[0]);
            const data = {
                name: name[0],
                icon: index,
                room: roomID
            }
            socket.emit('joingame', data);
        }
    }

    const onPlayerMoveHandler = (index1: number, index2: number) => {
        const newmoves = [...moves];

        if(moves[index1][index2] !== '' || player !== name[0]){
            return;
        }

        newmoves[index1][index2] = "0";
        setMoves(newmoves);

        const data = {
            room: roomID,
            index1,
            index2,
            chance: name[1]
        }

        socket.emit('playturn', data);

        let winner = "";
        const result = checkWinner(newmoves);
        
        if(result !== null) {
            if(result === '0') {
                setChampion(name[0]);
                winner = name[0];
            } 
            else if(result === '1') {
                setChampion(name[1]);
                winner = name[1];
            }
            else if(result === 'tie') {
                setChampion("Tied");
                winner = "Tied"
            }
            setView("result");
            
            const windata = {
                champion: winner,
                room: roomID
            };

            socket.emit('gamecomplete', windata);
        }
    }

    const onRestartHandler = () => {
        setView("initialize");
        setPlayer("");
        setMoves([["","",""],["","",""],["","",""]]);
        setIcons([undefined, undefined]);
        setChampion(null);
        setRoomURL("");
        setRoomID("");
        setShapes([alienlogo, clownlogo, frieslogo, nerdlogo, pumpkinlogo]);
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
            <h1 className="Game--Title">TIC TAC TOE</h1>
            {
                 view === "initialize" ? 
                    <div className="Game--Container">
                        <div className="Game--Div">
                            <h1 className="Game--Subtitle">Create A New Game</h1>
                            <input type="submit" className="Game--SubmitButton" onClick={(e) => onTypeHandler(e,"new")} value="Next" />
                        </div>
                        <div className="Game--Div">
                            <h1 className="Game--Subtitle">OR</h1>
                        </div>
                        <div className="Game--Div">
                            <h1 className="Game--Subtitle">Join A Game</h1>
                            <input className="Game--Input" type="text" placeholder="Paste the game link" value={roomURL} onChange={(event) => onChangeHandler(event,"room")} />
                            {
                                roomURL === "" ? null :
                                    <input type="submit" className="Game--SubmitButton" onClick={(e) => onTypeHandler(e,"old")} value="Next" />
                            }
                        </div>
                    </div> :
                    view === "choose" ? 
                        <div className="Game--Container">
                            <div className="Game--Div">
                                <h1 className="Game--Subtitle">Enter Your Name!</h1>
                                <input className="Game--Input" type="text" value={name[0]} onChange={(event) => onChangeHandler(event,"name")} />
                            </div>
                            <div className="Game--Div">
                                <h1 className="Game--Subtitle">Choose Your Avatar!</h1>
                                <div className="Game--Choose">
                                    {
                                        shapes.map((shape, shapeid) => {
                                            return (
                                                <div className="Game--ChooseCube" key={shapeid} 
                                                    style={{ backgroundColor: shape === icons[0] ? '#FFD651' : "transparent" }}
                                                    onClick={() => onShapeHandler(shapeid)}>
                                                    <img src={shape} className="Game--BoardIcon" alt="shape" />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            {
                                ( name[0] === "" || icons[0] === undefined ) ? null :
                                    <input type="submit" className="Game--SubmitButton" onClick={onGameStartHandler} value={newgame ? "Create" : "Join"} />
                            }
                        </div> : 
                        view === "board" ? 
                            <React.Fragment>
                                {
                                    icons[1] === undefined ? 
                                        <React.Fragment>
                                            <div className="Game--Div">
                                                <h1 className="Game--Subtitle">Send the Game Link To Them!</h1>
                                                <input className="Game--Input" type="text" value={roomURL} readOnly />
                                                <CopyToClipboard text={roomURL} onCopy={() => setCopied(true)} >
                                                    <div className="Game--SubmitButton">
                                                        {
                                                            copied ? 'Copied!' : 'Copy Link'
                                                        }
                                                    </div>
                                                </CopyToClipboard>
                                            </div> 
                                            <div className="Game--Div">
                                                <h1 className="Game--Subtitle">Waiting For The Other Player To Join...</h1>
                                            </div>
                                        </React.Fragment> :
                                        <div className="Game--Div">
                                            <h1 className="Game--Subtitle">{player === name[0] ? "Your" : `${player}'s`} Turn</h1>
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
                                            </div> 
                                            <div className="Game--Options">
                                                <div className="Game--OptionsDiv">
                                                    <h1 className="Game--Subtitle" style={{ paddingBottom: '0' }}>You - </h1>
                                                    <img src={icons[0]} className="Game--OptionIcon" alt="player1icon" />
                                                </div>
                                                <div className="Game--OptionsDiv">
                                                    <h1 className="Game--Subtitle" style={{ paddingBottom: '0' }}>{name[1]} - </h1>
                                                    <img src={icons[1]} className="Game--OptionIcon" alt="player1icon" />
                                                </div>
                                            </div>
                                        </div>
                                }
                            </React.Fragment>:
                                view === "result" ? 
                                    <div className="Game--Result">
                                        <h1 className="Game--Subtitle" style={{color: '#000'}}>
                                            {
                                                champion === name[0] ? 'You won the game!' : 
                                                champion === name[1] ? `You lost. ${name[1]} won the game!` :
                                                'It is a tie!'
                                            }
                                        </h1>
                                        <div className="Game--Restart">
                                            <img src={replaylogo} className="Game--RestartLogo" alt="restart" />
                                            <h1 className="Game--Subtitle" onClick={() => onRestartHandler()}
                                                style={{color: '#331281', paddingLeft: '1rem', paddingBottom: '0'}}>
                                                    RESTART
                                            </h1>
                                        </div>
                                    </div> : null
            }
        </div>
    )
}

export default Game;