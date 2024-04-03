import React, { useEffect, useRef, useState } from "react";
import Field from "./Field";
import {
  calculateDiscVelocity,
  clamp,
  getCenterOfElement,
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
const DISC_GAP_FROM_BORDERS = 1;
const PLAYER_IMPACT_ON_DISC = 3;

const Game = () => {
  const refP1 = useRef();
  const refP2 = useRef();
  const refDisc = useRef();
  const refField = useRef();

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
    const fieldRect = refField?.current?.getBoundingClientRect();
    const fieldHeightConversionFactor = 100 / fieldRect.height;
    const discRect = refDisc.current.getBoundingClientRect();
    const playerOneRect = refP1.current.getBoundingClientRect();

    setGameState((prev) => ({
      ...prev,
      players: [
        {
          x: 20 - PLAYER_WIDTH / 2,
          y: 50 - (playerOneRect.height * fieldHeightConversionFactor) / 2,
        }, // Centered players (50% of each axis)
        {
          x: 80 - PLAYER_WIDTH / 2,
          y: 50 - (playerOneRect.height * fieldHeightConversionFactor) / 2,
        }, // Centered players (50% of each axis)
      ],
      disc: {
        x: 50 - DISC_WIDTH / 2,
        y: 50 - (discRect.height * fieldHeightConversionFactor) / 2,
        velocity: { x: 0, y: 0 },
      },
    }));
  };

  const updateGameState = (PLAYER_HEIGHT, DISC_HEIGHT, fieldRect) => {
    let delta = getDeltaFromPlayerSpeed(pressedKeys, playerSpeed);
    // Check for pressed arrow keys and update movement deltas

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

    const discCenter = getCenterOfElement(discRect);

    if (isTouchingDisc(p1Rect, discRect)) {
      const touchPoint = getKissingPoint(p1Rect, discRect);

      const direction = {
        x: discCenter.x - touchPoint.x,
        y: discCenter.y - touchPoint.y,
      };

      const discVelocity = calculateDiscVelocity(
        direction,
        playerSpeed * PLAYER_IMPACT_ON_DISC
      );

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

        const borders = getTouchingBorder(discRect, fieldRect);

        if (borders.bottom) {
          newVelocity.y *= -1;
          newDiscPosition.y = 100 - DISC_HEIGHT - DISC_GAP_FROM_BORDERS;
        }

        if (borders.top) {
          newVelocity.y *= -1;
          newDiscPosition.y = DISC_GAP_FROM_BORDERS;
        }

        if (borders.left) {
          newVelocity.x *= -1;
          newDiscPosition.x = DISC_GAP_FROM_BORDERS;
        }

        if (borders.right) {
          newVelocity.x *= -1;
          newDiscPosition.x = 100 - DISC_WIDTH - DISC_GAP_FROM_BORDERS;
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
    const discRect = refDisc.current.getBoundingClientRect();
    const fieldRect = refField.current.getBoundingClientRect();
    const p1Rect = refP1.current.getBoundingClientRect();
    const fieldHeightConversionFactor = 100 / fieldRect.height; // Percentage per pixel (height)

    const PLAYER_HEIGHT = p1Rect.height * fieldHeightConversionFactor;

    const DISC_HEIGHT = discRect.height * fieldHeightConversionFactor;

    let lastTime = Date.now();

    const gameLoop = setInterval(() => {
      const currTime = Date.now();
      // console.log(lastTime - currTime);
      lastTime = currTime;
      updateGameState(PLAYER_HEIGHT, DISC_HEIGHT, fieldRect);
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
