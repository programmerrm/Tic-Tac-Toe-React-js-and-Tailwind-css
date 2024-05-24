import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { calculaterWinner } from "./assets/lib/calculaterWinner";

function Logo() {
    return (
        <div className="flex flex-col flex-wrap w-full">
            <a className="block w-28 h-28" href={"/"}>
                <img className="w-full h-full rounded-full" src="/images/programmerwebrm.jpg" alt="programmerwebrm" />
            </a>
        </div>
    );
}

function PlayerName({ player, setPlayer }) {

    const handleNameChange = (e) => {
        const name = e.target.name;
        setPlayer({
            ...player,
            [name]: e.target.value,
        });
    };

    const handleForm = (e) => {
        e.preventDefault();
        localStorage.setItem('playerNames', JSON.stringify(player));
    };

    useEffect(() => {
        const storedPlayerNames = localStorage.getItem('playerNames');
        if (storedPlayerNames) {
            setPlayer(JSON.parse(storedPlayerNames));
        }
    }, []);

    useEffect(() => {
        const clearStorageTimeout = setTimeout(() => {
            localStorage.removeItem('playerNames');
        }, 24 * 60 * 60 * 1000);

        return () => clearTimeout(clearStorageTimeout);
    }, []);

    return (
        <form className="flex flex-col flex-wrap gap-4 w-full" onSubmit={handleForm}>
            <div className="flex flex-col flex-wrap w-2/3">
                <input
                    className="text-lg font-medium border-none outline-none py-2 px-2.5 rounded w-full bg-transparent ring-2 ring-slate-800"
                    name="firstPlayer"
                    value={player.firstPlayer}
                    onChange={handleNameChange}
                    type="text"
                />
            </div>
            <div className="flex flex-col flex-wrap w-2/3">
                <input
                    className="text-lg font-medium border-none outline-none py-2 px-2.5 rounded border w-full bg-transparent ring-2 ring-slate-800"
                    name="secondPlayer"
                    value={player.secondPlayer}
                    onChange={handleNameChange}
                    type="text"
                />
            </div>
            <div className="flex flex-col flex-wrap w-full">
                <button className="text-lg font-semibold rounded py-2 px-5 border-none outline-none ring-2 ring-slate-800 w-[28%] lg:ml-[21%]" type="submit">Send</button>
            </div>
        </form>
    );
}


function WinnerLists({ winner, saveWinner }) {
    const [winners, setWinners] = useState([]);

    useEffect(() => {
        const storedWinners = JSON.parse(localStorage.getItem('winners')) || [];
        setWinners(storedWinners);
    }, []);
    useEffect(() => {
        if (winner) {
            saveWinner(winner);
        }
    }, [winner, saveWinner]);

    return (
        <div className="flex flex-col flex-wrap justify-center items-center rounded border py-2.5 w-full">
            <h2>Winner Lists</h2>
            <ul className="flex flex-col flex-wrap justify-center items-center w-full">
                {winners.map((winner, index) => (
                    <li key={index}>{index + 1} Number Game Winner : {winner}</li>
                ))}
            </ul>
        </div>
    );
}



function NextPlayer({ status }) {
    return (
        <div>
            Next Player: {status}
        </div>
    );
}

function NewGameStart({ handleNewGameStart }) {
    return (
        <div>
            <button type="button" onClick={handleNewGameStart}>New Game Start</button>
        </div>
    );
}

function WinnerPlayer({ winnerPlayer }) {
    return (
        <div>Winner Player: {winnerPlayer}</div>
    );
}

function Square({ onSquaresClick, value }) {
    return (
        <button
            className="flex flex-col flex-wrap w-full justify-center items-center h-32 text-white text-2xl rounded border-2 border-gray-600"
            type="button"
            onClick={onSquaresClick}
        >
            {value}
        </button>
    );
}

function GameBorad({ squares, xIsNext, onPlay }) {

    const handleSquare = (index) => {
        if (squares[index] || calculaterWinner(squares)) {
            return;
        }

        const nextSquares = squares.slice();
        nextSquares[index] = xIsNext ? "X" : "O";
        onPlay(nextSquares);
    }

    return (
        <div className="grid grid-cols-3 gap-5 w-full">
            {squares.map((value, index) => (
                <Square
                    key={index}
                    value={value}
                    onSquaresClick={() => handleSquare(index)}
                />
            ))}
        </div>
    );
}

export default function App() {


    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [xIsNext, setXIsNext] = useState(true);
    const [currentMove, setCurrentMove] = useState(0);
    const [player, setPlayer] = useState({ firstPlayer: "Guest 1", secondPlayer: "Guest 2" });
    const currentSquares = history[currentMove];

    const winner = calculaterWinner(currentSquares);

    let status;

    if (winner) {
        status = `${winner}`;
    } else {
        status = (xIsNext ? player.firstPlayer : player.secondPlayer);
    }


    const handlePlay = (nextSquares) => {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setXIsNext(!xIsNext);
    }

    const saveWinner = (winner) => {
        const storedWinners = JSON.parse(localStorage.getItem('winners')) || [];
        const updatedWinners = [...storedWinners, winner];
        localStorage.setItem('winners', JSON.stringify(updatedWinners));

        setTimeout(() => {
            localStorage.removeItem('winners');
        }, 24 * 60 * 60 * 1000);
    };


    const handleNewGameStart = () => {
        setHistory([Array(9).fill(null)]);
        setXIsNext(true);
        setCurrentMove(0);
    };

    function jupmTo(move) {
        setCurrentMove(move);
        setXIsNext(move % 2 === 0);
    }

    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = `Go to the move # ${move}`;
        } else {
            description = "Go to start the game";
        }
        return (
            <li key={move}>
                <button className="text-base font-semibold" type="button" onClick={() => jupmTo(move)}>
                    {description}
                </button>
            </li>
        );
    });

    return (
        <>
            <section className="relative top-0 left-0 right-0 py-5 w-full">
                <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full h-full">
                    <div className="flex flex-col flex-wrap justify-center gap-y-10 w-full h-full">
                        <div className="grid grid-cols-3 gap-10 w-full">


                            <Logo />
                            <PlayerName player={player} setPlayer={setPlayer} />
                            <WinnerLists winner={winner} saveWinner={saveWinner} />




                        </div>

                        <div className="grid grid-cols-3 gap-10 w-full">

                            <NextPlayer status={status} />
                            <NewGameStart handleNewGameStart={handleNewGameStart} />
                            <WinnerPlayer winnerPlayer={winner} />

                        </div>

                        <div className="grid grid-cols-2 gap-64 w-full">
                            <GameBorad
                                squares={currentSquares}
                                xIsNext={xIsNext}
                                onPlay={handlePlay}
                            />
                            <div className="flex flex-col flex-wrap w-full rounded border-2 border-gray-600">
                                <div className="flex flex-col flex-wrap items-center  px-2.5 py-2.5 w-full">
                                    <h2 className="text-xl font-bold">History</h2>
                                    <div className="flex flex-col flex-wrap items-center mt-2.5 w-full">
                                        <ol className="flex flex-col flex-wrap gap-y-3">{moves}</ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="relative top-0 left-0 right-0 py-5 w-full">
                <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
                    <div className="flex flex-col flex-wrap justify-center items-center w-full">
                        <p className="text-base font-semibold">Created 2024 by <a href="/">programmerwebrm</a></p>
                    </div>
                </div>
            </footer>
        </>
    );
}
