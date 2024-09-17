import React, { useEffect, useState } from "react";
import { calculaterWinner } from "./assets/lib/calculaterWinner";

function PlayerName({ player, setPlayer }) {
    const handleNameChange = (e) => {
        const { name, value } = e.target;
        setPlayer({
            ...player,
            [name]: value,
        });
    }

    const handleForm = (e) => {
        e.preventDefault();
        localStorage.setItem('playerName', JSON.stringify(player));
    }

    return (
        <form className="flex flex-col flex-wrap gap-3 w-1/2" onSubmit={handleForm}>
            <div className="flex flex-col flex-wrap w-full">
                <input
                    className="text-base font-medium border-none outline-none py-2 px-2.5 rounded w-full bg-transparent ring-2 ring-slate-800"
                    name="firstPlayer"
                    value={player.firstPlayer}
                    onChange={handleNameChange}
                    type="text"
                    placeholder="First Player"
                />
            </div>
            <div className="flex flex-col flex-wrap w-full">
                <input
                    className="text-base font-medium border-none outline-none py-2 px-2.5 rounded border w-full bg-transparent ring-2 ring-slate-800"
                    name="secondPlayer"
                    value={player.secondPlayer}
                    onChange={handleNameChange}
                    type="text"
                    placeholder="Second Player"
                />
            </div>
            <div className="flex flex-col flex-wrap justify-center items-center w-full">
                <button className="text-base font-semibold rounded py-2.5 px-5 border-none outline-none ring-2 ring-slate-800 w-[50%]" type="submit">Send</button>
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
            const storedWinners = JSON.parse(localStorage.getItem('winners')) || [];
            setWinners(storedWinners);
        }
    }, [winner, saveWinner]);
    return (
        <div className="flex flex-col flex-wrap justify-center items-center w-1/2 rounded border-2 border-slate-700">
            <h2 className="text-base lg:text-xl font-bold relative border-b-2 border-slate-800">
                Winner Lists
            </h2>
            <ul className="flex flex-col flex-wrap justify-center items-center gap-y-1 mt-2.5 w-full">
                {winners.slice(-5).map((winner, index) => (
                    <li className="text-base font-semibold" key={index}>{`${winners.length - 5 + index + 1}${"."}`} Number Game Winner: {winner}</li>
                ))}
            </ul>
        </div>
    );
}

function NextPlayer({ status }) {
    return (
        <div className="flex flex-col flex-wrap justify-center items-center w-full">
            <h4 className="text-base font-semibold">Next Player : {status}</h4>
        </div>
    );
}

function NewGameStart({ handleNewGameStart }) {
    return (
        <div className="flex flex-col flex-wrap justify-center items-center w-full">
            <button className="border-2 border-slate-800 w-[55%] py-2.5 rounded text-base font-semibold" type="button" onClick={handleNewGameStart}>New Game Start</button>
        </div>
    );
}

function WinnerPlayer({ winnerPlayer }) {
    return (
        <div className="flex flex-col flex-wrap justify-center items-center w-full">
            <h4 className="text-base font-semibold">Winner Player : {winnerPlayer}</h4>
        </div>
    );
}

function Square({ onSquaresClick, value }) {
    return (
        <button
            className="flex flex-col flex-wrap w-full justify-center items-center h-28 lg:h-36 text-white text-lg font-semibold rounded border-2 border-gray-600"
            type="button"
            onClick={onSquaresClick}
        >
            {value}
        </button>
    );
}

function GameBorad({ squares, xIsNext, onPlay, player }) {
    const handleSquare = (index) => {
        if (squares[index] || calculaterWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[index] = xIsNext ? player.firstPlayer : player.secondPlayer;
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
        <section className="relative top-0 left-0 right-0 w-full h-full">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full h-full">
                <div className="flex flex-col flex-wrap justify-center items-center gap-y-10 w-full h-full">

                    <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center items-start w-full">
                        <PlayerName player={player} setPlayer={setPlayer} />
                        <WinnerLists winner={winner} saveWinner={saveWinner} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 justify-center items-center w-full">
                        <NextPlayer status={status} />
                        <NewGameStart handleNewGameStart={handleNewGameStart} />
                        <WinnerPlayer winnerPlayer={winner} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 lg:gap-64 w-full">
                        <GameBorad
                            squares={currentSquares}
                            xIsNext={xIsNext}
                            onPlay={handlePlay}
                            player={player}
                        />
                        <div className="flex flex-col flex-wrap w-full rounded border-2 border-gray-600">
                            <div className="flex flex-col flex-wrap items-center  px-2.5 py-2.5 w-full">
                                <h2 className="text-xl font-bold relative after:absolute after:border-b-2 after:bottom-[-5px] after:left-[-20%] after:w-[100px] after:border-slate-800">History</h2>
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
