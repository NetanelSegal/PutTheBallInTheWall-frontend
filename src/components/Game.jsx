import React, { useEffect, useState } from "react";
import Field from "./Field";

const PLAYER_RECT = 80;
const DISC_RECT = 56;
const INITIAL_DISTANCE = 5;
const Game = () => {
  const [pressedKeys, setPressedKeys] = useState({});
  const [gameState, setGameState] = useState({
    players: [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
    disc: { x: 0, y: 0 },
  });

  const handleKeyDown = (e) => {
    console.log(e);
    setPressedKeys((prev) => ({ ...prev, [e.key]: true }));
    console.log("pressedKeys:", pressedKeys);
  };

  useEffect(() => {
    console.log(pressedKeys);
  }, [pressedKeys]);

  const handleKeyUp = (e) => {
    setPressedKeys((prev) => ({ ...prev, [e.key]: false }));
  };

  const initialPlayersPosition = () => {
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;

    setGameState((prev) => ({
      ...prev,
      players: [
        {
          x: innerWidth / 2 / 2 - PLAYER_RECT,
          y: innerHeight / 2 - PLAYER_RECT,
        },
        {
          x: innerWidth / 2 + innerWidth / 2 / 2 - PLAYER_RECT,
          y: innerHeight / 2 - PLAYER_RECT,
        },
      ],
      disc: {
        x: window.innerWidth / 2 - DISC_RECT - 10,
        y: window.innerHeight / 2 - DISC_RECT - 8,
      },
    }));
  };

  const movePlayer = () => {
    let deltaX = 0;
    let deltaY = 0;

    // Check for pressed arrow keys and update movement deltas
    if (pressedKeys["ArrowUp"]) {
      deltaY -= INITIAL_DISTANCE; // Player movement distance (adjust as needed)
    }
    if (pressedKeys["ArrowDown"]) {
      deltaY += INITIAL_DISTANCE;
    }
    if (pressedKeys["ArrowRight"]) {
      deltaX += INITIAL_DISTANCE;
    }
    if (pressedKeys["ArrowLeft"]) {
      deltaX -= INITIAL_DISTANCE;
    }

    setGameState((prev) => {
      const updatedPlayers = prev.players.map((player, index) => {
        return {
          ...player,
          x: player.x + deltaX, // Update x position
          y: player.y + deltaY, // Update y position
        };
      });

      return { ...prev, players: updatedPlayers };
    });

    // setGameState((prev) => ({
    //   ...prev,
    //   players: [
    //     {
    //       x: prev.players[0].x + deltaX, // Update x position
    //       y: prev.players[0].y + deltaY, // Update y position
    //     },
    //     ...prev.players,
    //   ],
    // }));
  };

  useEffect(() => {
    let lastTime = Date.now();

    const gameLoop = setInterval(() => {
      const currTime = Date.now();
      // console.log(lastTime - currTime);
      lastTime = currTime;
      movePlayer();
    }, 16); // Call movePlayer every 16ms (roughly 60 FPS)

    return () => clearInterval(gameLoop);
  }, [pressedKeys]);

  useEffect(() => {
    initialPlayersPosition();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="bg-blue-950 h-screen p-9">
      <Field gameState={gameState} />
    </div>
  );
};

export default Game;
