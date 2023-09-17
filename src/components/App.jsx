import React, { useEffect, useState } from 'react';
import Board from './Board';
import './App.css';

export default function App() {
    const MAX_BOARD_SIZE = 30;
    const SELECT_START = 0;
    const SELECT_END = 1;
    const SELECT_CALC = 2;

    const [selectPhase, setSelectPhase] = useState(SELECT_START);
    const [boardSize, setBoardSize] = useState(8);
    const [board, setBoard] = useState(Array(boardSize).fill(Array(boardSize).fill('')));
    const [startPoint, setStartPoint] = useState({});
    const [endPoint, setEndPoint] = useState({});
    const [inCalc, setInCalc] = useState(false);
    const [pathLength, setPathLength] = useState(0);
    
    function changeBoardSize(event) {
        let newBoardSize = Number(event.target.value);
        if (newBoardSize > MAX_BOARD_SIZE) newBoardSize = MAX_BOARD_SIZE;
        setBoardSize(newBoardSize);
        setBoard(Array(newBoardSize).fill(Array(newBoardSize).fill('')));
        setSelectPhase(SELECT_START);
        setStartPoint({});
        setEndPoint({});
        setInCalc(false);
        setPathLength(0);
    }

    function squareClick(row, col) {
        let newBoard = board.map(cols => cols.slice());
        let currentValue = newBoard[row][col];
        switch (currentValue) {
            case 's':
                if (selectPhase === SELECT_CALC) {
                    newBoard = board.map(cols => cols.map(cell => ''));
                    newBoard[row][col] = 's';
                    setStartPoint({ row, col });
                    setEndPoint({});
                    setSelectPhase(SELECT_END);
                } else {
                    newBoard[row][col] = '';
                    setStartPoint({});
                    setSelectPhase(SELECT_START);
                };
                break;
            case 'e':
                newBoard = board.map(cols => cols.map(cell => ''));
                setEndPoint({});
                newBoard[row][col] = 's';
                setStartPoint({ row, col });
                setSelectPhase(SELECT_END);
                break;
            default:
                switch (selectPhase) {
                    case SELECT_START:
                        newBoard[row][col] = 's';
                        setStartPoint({ row, col });
                        setSelectPhase(SELECT_END);
                        break;
                    case SELECT_END:
                        newBoard[row][col] = 'e';
                        setEndPoint({ row, col });
                        setSelectPhase(SELECT_CALC);
                        setInCalc(true);
                        break;
                    case SELECT_CALC:
                        newBoard = board.map(cols => cols.map(cell => ''));
                        newBoard[row][col] = 's';
                        setStartPoint({ row, col });
                        setEndPoint({});
                        setSelectPhase(SELECT_END);
                        break;
                    default:
                        break;
                }
        };
        setBoard(newBoard);
    }

    function calculate() {
        let newBoard = board.map(cols => cols.slice());
        let found = false;
        let checkQueue = [startPoint];
        let point = undefined;
        let pointValue = 0;

        function checkNewPoint(row, col) {
            if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) return false;
            if (newBoard[row][col] === 'e') {
                setPathLength(pointValue + 1);
                return true;
            };
            if (newBoard[row][col] === '') {
                newBoard[row][col] = pointValue + 1;
                checkQueue.push({ row, col });
            };
            return false;
        };

        while (!found && checkQueue.length > 0) {
            point = checkQueue.shift();
            pointValue = (newBoard[point.row][point.col] === 's' ? 0 : newBoard[point.row][point.col]);
            // row-2, col+1
            found = checkNewPoint(point.row - 2, point.col + 1);
            // row-1, col+2
            if (!found) found = checkNewPoint(point.row - 1, point.col + 2);
            // row+1, col+2
            if (!found) found = checkNewPoint(point.row + 1, point.col + 2);
            // row+2, col+1
            if (!found) found = checkNewPoint(point.row + 2, point.col + 1);
            // row+2, col-1
            if (!found) found = checkNewPoint(point.row + 2, point.col - 1);
            // row+1, col-2
            if (!found) found = checkNewPoint(point.row + 1, point.col - 2);
            // row-1, col-2
            if (!found) found = checkNewPoint(point.row - 1, point.col - 2);
            // row-2, col-1
            if (!found) found = checkNewPoint(point.row - 2, point.col - 1);
        };
        if (found) setBoard(newBoard);
    }

    useEffect(() => {
        if (inCalc) {
            calculate();
            setInCalc(false);
        };
    }, [inCalc]);

    return (
        <div className='AppWrapper'>
            <h1>Skoczek szachowy</h1>
            <div><span>Rozmiar planszy:&nbsp;</span><input type='number' max={MAX_BOARD_SIZE} value={boardSize ? boardSize : undefined} onChange={changeBoardSize} /></div>
            <p />
            <div style={{ display: 'flex' }}>
                <Board board={board} squareClick={squareClick} />
                <div style={{ marginLeft: '10px' }}>
                    <div>{selectPhase === SELECT_START ? "Wybierz punkt startu" : "Start: " + JSON.stringify(startPoint)}</div>
                    <div>{selectPhase === SELECT_END ? "Wybierz punkt końca" : "Koniec: " + JSON.stringify(endPoint)}</div>
                    <div><br />{selectPhase === SELECT_CALC ? (inCalc ? "Obliczam..." : "Gotowe, długość: " + pathLength) : ""}</div>
                </div>
            </div>
        </div>
    )
}