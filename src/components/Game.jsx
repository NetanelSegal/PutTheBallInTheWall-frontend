import React, { useEffect, useRef, useState } from "react";
import Field from "./Field";
import {
  calculateDiscVelocity,
  getKissingPoint,
  isTouchingDisc,
} from "./functions";

const PLAYER_WIDTH = 8;
const DISC_WIDTH = 5;
const INITIAL_DISTANCE = 2;
const SPEED_MULTIPLIER = 0.02;
const FRICTION = 0.95;

const Game = () => {
  const widthConversionFactor = 100 / window.innerWidth; // Percentage per pixel (width)
  const heightConversionFactor = 100 / window.innerHeight; // Percentage per pixel (height)

  const refP1 = useRef();
  const refP2 = useRef();
  const refDisc = useRef();
  const [isHolding, setIsHolding] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_DISTANCE);
  const [pressedKeys, setPressedKeys] = useState({});
  const [gameState, setGameState] = useState({
    players: [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
    disc: { x: 0, y: 0, velocity: { x: 0, y: 0 } },
  });

  const handleKeyDown = (e) => {
    setPressedKeys((prev) => ({ ...prev, [e.key]: true }));
    setIsHolding(true);
  };

  const handleKeyUp = (e) => {
    setPressedKeys((prev) => ({ ...prev, [e.key]: false }));
    setIsHolding(false);
    setSpeed(INITIAL_DISTANCE);
  };

  const initialPlayersPosition = () => {
    setGameState((prev) => ({
      ...prev,
      players: [
        {
          x: 25 - PLAYER_WIDTH / 2,
          y: 50 - (PLAYER_WIDTH * widthConversionFactor) / 2 - 5,
        }, // Centered players (50% of each axis)
        {
          x: 75 - PLAYER_WIDTH / 2,
          y: 50 - (PLAYER_WIDTH * heightConversionFactor) / 2 - 5,
        }, // Centered players (50% of each axis)
      ],
      disc: {
        x: 50 - DISC_WIDTH / 2,
        y: 50 - DISC_WIDTH / 2 - 1.2,
        velocity: { x: 0, y: 0 },
      },
    }));
  };

  const updateGameState = () => {
    let deltaX = 0;
    let deltaY = 0;

    // Check for pressed arrow keys and update movement deltas
    if (pressedKeys["ArrowUp"]) {
      deltaY -= speed; // Player movement distance (adjust as needed)
    }
    if (pressedKeys["ArrowDown"]) {
      deltaY += speed;
    }
    if (pressedKeys["ArrowRight"]) {
      deltaX += speed;
    }
    if (pressedKeys["ArrowLeft"]) {
      deltaX -= speed;
    }

    setGameState((prev) => {
      return {
        ...prev,
        players: [
          {
            x: prev.players[0].x + deltaX, // Update x position
            y: prev.players[0].y + deltaY, // Update y position
          },
          prev.players[1],
        ],
      };
    });

    if (isHolding) setSpeed((prev) => prev + prev * SPEED_MULTIPLIER);

    const p1Rect = refP1.current.getBoundingClientRect();
    // const p2Rect = refP2.current.getBoundingClientRect();
    const discRect = refDisc.current.getBoundingClientRect();

    const discCenter = {
      x: discRect.left + discRect.width / 2,
      y: discRect.top + discRect.height / 2,
    };

    if (isTouchingDisc(p1Rect, discRect)) {
      const touchPoint = getKissingPoint(p1Rect, discRect);

      // const reflectedPoint = {
      //   x: 2 * discCenter.x - touchPoint.x,
      //   y: 2 * discCenter.y - touchPoint.y,
      // };

      const direction = {
        x: discCenter.x - touchPoint.x,
        y: discCenter.y - touchPoint.y,
      };

      const discVelocity = calculateDiscVelocity(direction, speed);

      setGameState((prev) => ({
        ...prev,
        disc: {
          x: prev.disc.x + discVelocity.x,
          y: prev.disc.y + discVelocity.y,
          velocity: discVelocity,
        },
      }));
    } else {
      setGameState((prev) => {
        const newDiscPosition = {
          x: prev.disc.x + prev.disc.velocity.x,
          y: prev.disc.y + prev.disc.velocity.y,
        };

        const newVelocity = {
          x: prev.disc.velocity.x * FRICTION,
          y: prev.disc.velocity.y * FRICTION,
        };

        return {
          ...prev,
          disc: {
            x: newDiscPosition.x,
            y: newDiscPosition.y,
            velocity: newVelocity,
          },
        };
      });
    }
  };

  // game interval
  useEffect(() => {
    let lastTime = Date.now();

    const gameLoop = setInterval(() => {
      const currTime = Date.now();
      // console.log(lastTime - currTime);
      lastTime = currTime;
      updateGameState();
    }, 16); // Call updateGameState every 16ms (roughly 60 FPS)

    return () => clearInterval(gameLoop);
  }, [pressedKeys]);

  // event listeners & game positions initialization
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
    <div className="bg-blue-950 h-screen w-screen p-[3%] justify-center items-center">
      <Field gameState={gameState} refs={[refP1, refP2, refDisc]} />
    </div>
  );
};

export default Game;
