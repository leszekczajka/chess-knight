import React, { useState } from 'react';
import './Board.css';

export default function Board({ board, squareClick }) {
    return (
        <div className="board">
            {board.map((cols, rowIndex) =>
                <div key={rowIndex} className="board-row">
                    {cols.map((field, colIndex) =>
                        <button
                            key={(rowIndex * board.length) + (colIndex + 1)}
                            className={"board-field" + (field === 's' ? " board-field-start" : "") + (field === 'e' ? " board-field-end" : "")}
                            onClick={() => squareClick(rowIndex, colIndex)}
                        >{field}</button>
                    )}
                </div>
            )}
        </div>
    )
}