import { useRef, useState, useEffect } from "react";

const INITIAL_DISTANCE = 20;
const SPEED_MULTIPLIER = 0.01;

const Players = ({ gameAreaRef }) => {
  const playerOneRef = useRef();
  const [playerOnePosition, setPlayerOnePosition] = useState({ x: 0, y: 0 });
  const [playerOneDistance, setPlayerOneDistance] = useState(INITIAL_DISTANCE);
  const [pressedKeys, setPressedKeys] = useState({});

  const handleKeyDown = (e) => {
    setPressedKeys((prev) => ({ ...prev, [e.key]: true }));
  };

  const handleKeyUp = (e) => {
    setPressedKeys((prev) => ({ ...prev, [e.key]: false }));
    setPlayerOneDistance(INITIAL_DISTANCE);
  };

  const movePlayer = () => {
    let deltaX = 0;
    let deltaY = 0;

    if (pressedKeys["ArrowUp"]) {
      deltaY -= playerOneDistance;
    }
    if (pressedKeys["ArrowDown"]) {
      deltaY += playerOneDistance;
    }
    if (pressedKeys["ArrowRight"]) {
      deltaX += playerOneDistance;
    }
    if (pressedKeys["ArrowLeft"]) {
      deltaX -= playerOneDistance;
    }

    if (
      playerOneRef.current.getBoundingClientRect().left <
      gameAreaRef.current.getBoundingClientRect().left
    ) {
      setPlayerOnePosition((prev) => ({
        ...prev,
        x: gameAreaRef.current.getBoundingClientRect().left,
        y: prev.y + deltaY,
      }));
    } else {
      setPlayerOnePosition((prev) => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
    }

    setPlayerOneDistance((prev) => {
      if (
        pressedKeys["ArrowUp"] ||
        pressedKeys["ArrowDown"] ||
        pressedKeys["ArrowRight"] ||
        pressedKeys["ArrowLeft"]
      ) {
        const newDistance = prev + prev * SPEED_MULTIPLIER;
        return Math.min(newDistance, INITIAL_DISTANCE * 100); // Limiting maximum speed
      }
      return prev;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      return Object.values(pressedKeys).includes(true) && movePlayer();
    }, 16); // Run the movePlayer function approximately every 16ms (60fps)
    return () => clearInterval(interval);
  }, [pressedKeys]);

  useEffect(() => {
    if (
      playerOneRef.current.getBoundingClientRect().left <
      gameAreaRef.current.getBoundingClientRect().left
    ) {
      playerOneRef.current.style.transform = `translate(${
        gameAreaRef.current.getBoundingClientRect().left
      }px, ${playerOnePosition.y}px)`;
    } else
      playerOneRef.current.style.transform = `translate(${playerOnePosition.x}px, ${playerOnePosition.y}px)`;
  }, [playerOnePosition]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <>
      <div
        ref={playerOneRef}
        className="absolute top-0 left-0 w-20 h-20 rounded-full bg-slate-500 transition-all duration-0 ease-in-out"
        id="playerOne"
      ></div>
      <div className="w-20 h-20 rounded-full bg-slate-500" id="playerTwo"></div>
      <div
        id="leftWall"
        className="w-4 h-40 bg-black absolute z-10 top-1/2 -ml-4 -translate-y-1/2 left-0"
      ></div>
      <div
        id="rightWall"
        className="w-4 h-40 bg-black absolute z-10 top-1/2 -mr-4 -translate-y-1/2 right-0"
      ></div>
      <div
        id="middleLine"
        className="w-2 h-full bg-white absolute -translate-x-1/2 top-0 left-1/2"
      ></div>
      <div
        id="middleCircle"
        className="w-64 h-64 border-8 border-white rounded-full  absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
      ></div>
    </>
  );
};

export default Players;
