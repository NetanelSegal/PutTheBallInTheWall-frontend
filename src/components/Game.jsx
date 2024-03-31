import React, { useEffect, useRef, useState } from "react";
import Field from "./Field";
import {
  calculateDiscVelocity,
  clamp,
  getDeltaFromPlayerSpeed,
  getKissingPoint,
  getTouchingBorder,
  isTouchingDisc,
} from "./functions";

const PLAYER_WIDTH = 8;
const DISC_WIDTH = 5;
const INITIAL_DISTANCE = 2;
const SPEED_MULTIPLIER = 0.05;
const FRICTION = 0.9;

const Game = () => {
  const refP1 = useRef();
  const refP2 = useRef();
  const refDisc = useRef();
  const refField = useRef();

  const widthConversionFactor = 100 / window.innerWidth; // Percentage per pixel (width)
  const heightConversionFactor = 100 / window.innerHeight; // Percentage per pixel (height)

  const [isHoldingKey, setIsHoldingKey] = useState(false);
  // const [isUsingMouse, setIsUsingMouse] = useState(false);

  const [playerSpeed, setPlayerSpeed] = useState(INITIAL_DISTANCE);

  const [pressedKeys, setPressedKeys] = useState({});

  const [gameState, setGameState] = useState({
    players: [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
    disc: { x: 0, y: 0, velocity: { x: 0, y: 0 } },
  });

  // const handleMouseMove = (e) => {
  //   setIsUsingMouse(true);
  // };

  const handleKeyDown = (e) => {
    setPressedKeys((prev) => ({ ...prev, [e.key]: true }));
    setIsHoldingKey(true);
  };

  const handleKeyUp = (e) => {
    setPressedKeys((prev) => ({ ...prev, [e.key]: false }));
    setIsHoldingKey(false);
    setPlayerSpeed(INITIAL_DISTANCE);
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

  const updateGameState = (PLAYER_HEIGHT) => {
    const fieldRect = refField.current.getBoundingClientRect();

    let delta = getDeltaFromPlayerSpeed(pressedKeys, playerSpeed);
    // Check for pressed arrow keys and update movement deltas
    console.log(PLAYER_HEIGHT);
    setGameState((prev) => ({
      ...prev,
      players: [
        {
          x: clamp(prev.players[0].x + delta.x, 0, 100 - PLAYER_WIDTH), // Update x position
          y: clamp(prev.players[0].y + delta.y, 0, 100 - PLAYER_HEIGHT), // Update y position
        },
        prev.players[1],
      ],
    }));

    if (isHoldingKey) setPlayerSpeed((prev) => prev + prev * SPEED_MULTIPLIER);

    const p1Rect = refP1.current.getBoundingClientRect();
    // const p2Rect = refP2.current.getBoundingClientRect();
    const discRect = refDisc.current.getBoundingClientRect();

    const discCenter = {
      x: discRect.left + discRect.width / 2,
      y: discRect.top + discRect.height / 2,
    };

    if (isTouchingDisc(p1Rect, discRect)) {
      const touchPoint = getKissingPoint(p1Rect, discRect);

      const direction = {
        x: discCenter.x - touchPoint.x,
        y: discCenter.y - touchPoint.y,
      };

      const discVelocity = calculateDiscVelocity(direction, playerSpeed * 2);

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
        // setting new positions based on velocity
        const newDiscPosition = {
          x: prev.disc.x + prev.disc.velocity.x,
          y: prev.disc.y + prev.disc.velocity.y,
        };

        const newVelocity = {
          x: prev.disc.velocity.x * FRICTION,
          y: prev.disc.velocity.y * FRICTION,
        };

        const border = getTouchingBorder(discRect, fieldRect);

        switch (border) {
          case "bottom":
            newVelocity.y *= -1;
            newDiscPosition.y = newDiscPosition.y - 1;
            break;

          case "top":
            newVelocity.y *= -1;
            newDiscPosition.y = newDiscPosition.y + 1;
            break;

          case "left":
            newVelocity.x *= -1;
            newDiscPosition.x = newDiscPosition.x + 1;
            break;

          case "right":
            newVelocity.x *= -1;
            newDiscPosition.x = newDiscPosition.x - 1;
            break;

          default:
            break;
        }

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
    const PLAYER_HEIGHT =
      (refP1?.current?.getBoundingClientRect().height * 100) /
      refField.current.getBoundingClientRect().height;

    let lastTime = Date.now();

    const gameLoop = setInterval(() => {
      const currTime = Date.now();
      // console.log(lastTime - currTime);
      lastTime = currTime;
      updateGameState(PLAYER_HEIGHT);
    }, 16); // Call updateGameState every 16ms (roughly 60 FPS)

    return () => clearInterval(gameLoop);
  }, [pressedKeys]);

  // event listeners & game positions initialization
  useEffect(() => {
    initialPlayersPosition();

    // window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      // window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="bg-blue-950 h-screen w-screen p-[3%] justify-center items-center">
      <Field
        refField={refField}
        gameState={gameState}
        refs={[refP1, refP2, refDisc]}
      />
    </div>
  );
};

export default Game;
