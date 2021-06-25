import React from 'react';

import './board.css';

interface Props {
    type: string
}

const Board : React.FC<Props> = (props) => {

    const [player, setPlayer] = React.useState<string>("Player1");
    const [moves, setMoves] = React.useState<string[][]>([["","",""],["","",""],["","",""]]);

    return (
        <div className="Board">
            {
                moves.map((rows, rowid) => {
                    return (
                        <div className="Board--Row" key={rowid}>
                            {
                                rows.map((cube, cubeid) => {
                                    return(
                                        <div className="Board--Cube" key={cubeid}>{cube}</div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Board;