import React, { useState } from "react";
import { calculaterWinner } from "./assets/lib/calculaterWinner";

function Logo() {
    return (
        <div className="flex flex-col flex-wrap w-full">
            <h2 className="text-2xl font-bold">
                <a href={"/"}>Programmerwebrm</a>
            </h2>
        </div>
    );
}

function PlayerName() {
    const [player, setPlayer] = useState({ firstPlayer: "", secondPlayer: "" });

    const handleNameChange = (e) => {
        const name = e.target.name;
        setPlayer({
            ...player,
            [name]: e.target.value,
        });
    };

    const handleForm = (e) => {
        e.preventDefault();
        localStorage.clear();
    };

    return (
        <form onSubmit={handleForm}>
            <div>
                <input
                    name="firstPlayer"
                    value={player.firstPlayer}
                    onChange={handleNameChange}
                    type="text"
                    placeholder={"Guest 1"}
                />
            </div>
            <div>
                <input
                    name="secondPlayer"
                    value={player.secondPlayer}
                    onChange={handleNameChange}
                    type="text"
                    placeholder={"Guest 2"}
                />
            </div>
            <div>
                <button type="submit">Send</button>
            </div>
        </form>
    );
}

function WinnerLists() {
    return (
        <div>
            <h2>Winner Lists</h2>
        </div>
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
    const winner = calculaterWinner(squares);

    let status;
    if (winner) {
        status = `Winner : ${winner}`;
    } else {
        status = "Next Player : " + (xIsNext ? "X" : "O");
    }

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

    const currentSquares = history[currentMove];

    const handlePlay = (nextSquares) => {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setXIsNext(!xIsNext);
    }

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
        <section className="relative top-0 left-0 right-0 w-screen h-screen bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full h-full">
                <div className="flex flex-col flex-wrap w-full h-full">
                    <div className="grid grid-cols-3 gap-10 w-full">
                        <Logo />
                        <PlayerName />
                        <WinnerLists />
                    </div>

                    <div className="grid grid-cols-3 gap-10 w-full">

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
    );
}
