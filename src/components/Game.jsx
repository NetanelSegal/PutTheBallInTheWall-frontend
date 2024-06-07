import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Field from "./Field";

import {
  calculateDiscVelocity,
  clamp,
  getCenterOfElement,
  getDeltaFromPlayerSpeed,
  getKissingPoint,
  getTouchingBorder,
  isTouchingDisc,
  limitPlayerToField,
} from "./functions";
import UI from "./UI";
import URLS from "../constants/URLS";

const PLAYER_WIDTH = 8;
const DISC_WIDTH = 5;
const INITIAL_PLAYER_MOVEMENT_DISTANCE = 3;
const SPEED_MULTIPLIER = 0.01;
const FRICTION = 0.9;
const DISC_GAP_FROM_BORDERS = 1;
const PLAYER_IMPACT_ON_DISC = 3;

const Game = ({ socket, roomName }) => {
  const refP1 = useRef();
  const refP2 = useRef();
  const refDisc = useRef();
  const refField = useRef();
  const refRightWall = useRef();
  const refLeftWall = useRef();

  const [isPlayersConnected, setIsPlayersConnected] = useState(false);

  // const [socket, setSocket] = useState(null);

  const [currentPlayerNum, setCurrentPlayerNum] = useState(null);

  const [isHoldingKey, setIsHoldingKey] = useState(false);
  // const [isUsingMouse, setIsUsingMouse] = useState(false);
  const [playerSpeed, setPlayerSpeed] = useState(
    INITIAL_PLAYER_MOVEMENT_DISTANCE
  );

  const [pressedKeys, setPressedKeys] = useState({});
  const refPressedKeys = useRef({});

  const [gameState, setGameState] = useState({
    time: 0,
    score: [0, 0],
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
    refPressedKeys.current = { ...refPressedKeys.current, [e.key]: true };
    // if (!pressedKeys[e.key]) {
    //   setPressedKeys((prev) => ({ ...prev, [e.key]: true }));
    //   setIsHoldingKey(true);
    // }
  };

  const handleKeyUp = (e) => {
    refPressedKeys.current = { ...refPressedKeys.current, [e.key]: false };
    // setPressedKeys((prev) => ({ ...prev, [e.key]: false }));
    // setIsHoldingKey(false);
    // setPlayerSpeed(INITIAL_PLAYER_MOVEMENT_DISTANCE);
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

  const updateGameState = (
    PLAYER_HEIGHT,
    DISC_HEIGHT,
    { discRect, fieldRect, p1Rect, p2Rect }
  ) => {
    discRect = refDisc.current.getBoundingClientRect();

    let delta = getDeltaFromPlayerSpeed(refPressedKeys.current, playerSpeed);
    // Check for pressed arrow keys and update movement deltas

    let newPlayerPosition = {
      x: gameState.players[currentPlayerNum].x + delta.x,
      y: gameState.players[currentPlayerNum].y + delta.y,
    };

    newPlayerPosition = limitPlayerToField(
      newPlayerPosition,
      { h: PLAYER_HEIGHT, w: PLAYER_WIDTH },
      currentPlayerNum
    );

    const { x, y } = newPlayerPosition;

    // Emit only when changed position
    if (
      gameState.players[currentPlayerNum].x != x ||
      gameState.players[currentPlayerNum].y != y
    ) {
      socket.emit("playerMovement", { x, y, i: currentPlayerNum });
    }

    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player, index) =>
        index === currentPlayerNum ? { x, y } : player
      ),
    }));

    // if (isHoldingKey) setPlayerSpeed((prev) => prev + prev * SPEED_MULTIPLIER);

    const discCenter = getCenterOfElement(discRect);

    const isP1Touch = isTouchingDisc(p1Rect, discRect);
    const isP2Touch = isTouchingDisc(p2Rect, discRect);

    // is there is a touch
    if (isP1Touch || isP2Touch) {
      // which player is touching
      const touchPoint = isP1Touch
        ? getKissingPoint(p1Rect, discRect)
        : getKissingPoint(p2Rect, discRect);

      const direction = {
        x: discCenter.x - touchPoint.x,
        y: discCenter.y - touchPoint.y,
      };
      const discVelocity = calculateDiscVelocity(
        direction,
        playerSpeed * PLAYER_IMPACT_ON_DISC
      );

      socket.emit("discTouch", discVelocity);

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

    setGameState((prev) => ({ ...prev, time: prev.time + 16 }));
  };

  // game interval
  useEffect(() => {
    if (currentPlayerNum == null || !isPlayersConnected) return;

    const discRect = refDisc.current.getBoundingClientRect();
    const fieldRect = refField.current.getBoundingClientRect();
    const p1Rect = refP1.current.getBoundingClientRect();
    const p2Rect = refP2.current.getBoundingClientRect();
    const elementsRect = {
      discRect,
      fieldRect,
      p1Rect,
      p2Rect,
    };

    const fieldHeightConversionFactor = 100 / fieldRect.height; // Percentage per pixel (height)

    const PLAYER_HEIGHT = p1Rect.height * fieldHeightConversionFactor;

    const DISC_HEIGHT = discRect.height * fieldHeightConversionFactor;

    const gameLoop = setInterval(() => {
      updateGameState(PLAYER_HEIGHT, DISC_HEIGHT, elementsRect);
    }, 16); // Call updateGameState every 16ms (roughly 60 FPS)

    return () => clearInterval(gameLoop);
  }, [currentPlayerNum, isPlayersConnected, gameState]);

  //socket listeners initialization
  useEffect(() => {
    if (!socket) return;

    if (currentPlayerNum == 2) {
      let interval = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          time: prev.time + 1000,
        }));
      }, 1000);

      return () => clearInterval(interval);
    }

    socket.on("discUpdate", (discVelocity) => {
      setGameState((prev) => ({
        ...prev,
        disc: {
          x: prev.disc.x + discVelocity.x,
          y: prev.disc.y + discVelocity.y,
          velocity: discVelocity,
        },
      }));
    });

    socket.on("playerUpdate", (movementData) => {
      // Update player 1's movement on player 2's screen
      setGameState((prev) => ({
        ...prev,
        players: prev.players.map((player, i) =>
          i == movementData.i ? movementData : player
        ),
      }));
    });

    // get player index
    socket.on("playerConnected", (usersCount) => {
      setCurrentPlayerNum(usersCount - 1);
    });

    // if two players are in the game we can start
    socket.on("startGame", () => {
      console.log("game started");
      setIsPlayersConnected(true);
    });
  }, [socket, currentPlayerNum]);

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
      <UI timeInMS={gameState.time} score={gameState.score} />
      <Field
        refWalls={[refLeftWall, refRightWall]}
        refField={refField}
        gameState={gameState}
        refPlayers={[refP1, refP2]}
        refDisc={refDisc}
      />
    </div>
  );
};

export default Game;
