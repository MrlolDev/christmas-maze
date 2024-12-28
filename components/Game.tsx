"use client";
import { useState, useEffect } from "react";
import Button from "./Button";
import { MazeInterpreter } from "./MazeInterpreter";
import Key from "./Key";
import { generateMaze } from "@/lib/mazes";
import { calculateScore } from "@/lib/scoring";
import { useSession } from "next-auth/react";

export default function Game() {
  const { data: session } = useSession();
  const [gameStatus, setGameStatus] = useState<
    "start" | "playing" | "end" | "banned"
  >("start");
  const [maze, setMaze] = useState<string[][]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMazeIndex, setCurrentMazeIndex] = useState(0);
  const [mazeTimes, setMazeTimes] = useState<number[]>([]);

  const [position, setPosition] = useState(() => {
    for (let i = 0; i < maze.length; i++) {
      for (let j = 0; j < maze[i].length; j++) {
        if (maze[i][j] === "X") {
          return { row: i, col: j };
        }
      }
    }
    return { row: 5, col: 5 };
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (gameStatus !== "playing" || isGenerating) return;

    setActiveKey(event.key);
    console.log(event.key);
    const newPosition = { ...position };

    switch (event.key) {
      case "ArrowUp":
      case "w":
      case "W":
        newPosition.row -= 1;
        break;
      case "ArrowDown":
      case "s":
      case "S":
        newPosition.row += 1;
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        newPosition.col -= 1;
        break;
      case "ArrowRight":
      case "d":
      case "D":
        newPosition.col += 1;
        break;
      case "q":
      case "Q":
        newPosition.row -= 1;
        newPosition.col -= 1;
        break;
      case "e":
      case "E":
        newPosition.row -= 1;
        newPosition.col += 1;
        break;
      case "z":
      case "Z":
        newPosition.row += 1;
        newPosition.col -= 1;
        break;
      case "c":
      case "C":
        newPosition.row += 1;
        newPosition.col += 1;
        break;
      default:
        return;
    }

    if (maze[newPosition.row]?.[newPosition.col] === "#") return;

    if (maze[newPosition.row][newPosition.col] === "E") {
      handleGameEnd();
      return;
    }

    const newMaze = maze.map((row, i) =>
      row.map((cell, j) => {
        if (i === position.row && j === position.col) return " ";
        if (i === newPosition.row && j === newPosition.col) return "X";
        if (cell === "X") return " ";
        return cell;
      })
    );

    setPosition(newPosition);
    setMaze(newMaze);
  };

  const handleKeyPress = (key: string) => {
    const event = { key } as KeyboardEvent;
    handleKeyDown(event);
  };

  const handleStartGame = async () => {
    await handleGenerateMaze();

    setGameStatus("playing");
    setStartTime(Date.now());
  };

  useEffect(() => {
    const handleKeyUp = () => {
      setTimeout(() => {
        setActiveKey(null);
      }, 500);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameStatus, position, maze, handleKeyDown]);

  const handleGenerateMaze = async () => {
    setIsGenerating(true);
    try {
      const newMaze = generateMaze();

      let newPosition = { row: 5, col: 5 };
      for (let i = 0; i < newMaze.length; i++) {
        for (let j = 0; j < newMaze[i].length; j++) {
          if (newMaze[i][j] === "X") {
            newPosition = { row: i, col: j };
            break;
          }
        }
      }

      setPosition(newPosition);
      setMaze(newMaze);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (session?.user?.banned) {
      setGameStatus("banned");
    }
  }, [session]);

  const handleGameEnd = async () => {
    if (!startTime || !session?.user?.id) return;

    const endTimeNow = Date.now();

    const timeInSeconds = (endTimeNow - startTime) / 1000;
    setMazeTimes((prev) => [...prev, timeInSeconds]);

    if (currentMazeIndex < 2) {
      // Move to next maze
      setCurrentMazeIndex((prev) => prev + 1);
      await handleGenerateMaze();
      setStartTime(Date.now());
      return;
    }

    // Calculate final score after all mazes
    const totalTime = [...mazeTimes, timeInSeconds].reduce((a, b) => a + b, 0);
    const averageTime = totalTime / 3;
    const calculatedScore = calculateScore(averageTime);

    if (calculatedScore === null) {
      await fetch("/api/users/ban", {
        method: "POST",
      });
      setGameStatus("banned");
      return;
    }

    setScore(calculatedScore);
    setGameStatus("end");

    // Submit score to API
    try {
      await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score: calculatedScore }),
      });
    } catch (error) {
      console.error("Failed to submit score:", error);
    }
  };

  return (
    <div className="flex flex-col mt-64 items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-red-800">Christmas Maze</h1>

      {gameStatus === "banned" && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            You have been banned for suspicious activity
          </h2>
          <p className="text-gray-600">
            Completing the maze too quickly is not allowed.
          </p>
        </div>
      )}

      {gameStatus === "start" && !session?.user?.banned && (
        <Button onClick={handleStartGame}>Start</Button>
      )}

      {gameStatus === "playing" && (
        <>
          <div className="text-xl font-bold text-red-800 mb-4">
            Maze {currentMazeIndex + 1} of 3
          </div>
          <MazeInterpreter maze={maze} />
          <div className="mt-8 flex flex-col items-center gap-2 w-50">
            <div className="flex justify-between gap-2">
              <Key
                direction="up"
                onPress={handleKeyPress}
                active={activeKey === "ArrowUp"}
              />
            </div>
            <div className="flex justify-between gap-2">
              <Key
                direction="left"
                onPress={handleKeyPress}
                active={activeKey === "ArrowLeft"}
              />
              <Key
                direction="down"
                onPress={handleKeyPress}
                active={activeKey === "ArrowDown"}
              />
              <Key
                direction="right"
                onPress={handleKeyPress}
                active={activeKey === "ArrowRight"}
              />
            </div>

            <Button
              onClick={() => {
                setGameStatus("start");
                setMaze([]);
                setStartTime(null);
                setScore(null);
              }}
              className="mt-4 button"
            >
              Back to Lobby
            </Button>
          </div>
        </>
      )}
      {gameStatus === "end" && (
        <div className="text-center flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Congratulations! You completed all mazes!
          </h2>
          <div className="flex flex-col items-center justify-center nav rounded-md p-4 mb-4">
            {mazeTimes.map((time, index) => (
              <p key={index} className="text-xl mb-2">
                Maze {index + 1}: {time.toFixed(2)} seconds
              </p>
            ))}
            <p className="text-xl mb-2">
              Average Time:{" "}
              {(
                mazeTimes.reduce((a, b) => a + b, 0) / mazeTimes.length
              ).toFixed(2)}{" "}
              seconds
            </p>
            {score !== null && (
              <p className="text-xl font-bold">Score: {score} points</p>
            )}
          </div>
          <Button
            onClick={() => {
              setGameStatus("playing");
              handleStartGame();
              setStartTime(Date.now());
              setScore(null);
              setCurrentMazeIndex(0);
              setMazeTimes([]);
            }}
          >
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
}