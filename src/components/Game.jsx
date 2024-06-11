import React, { useEffect, useRef, useState } from "react";
import Field from "./Field";

import {
  calculateDiscVelocity,
  getCenterOfElement,
  getDeltaFromPlayerSpeed,
  getKissingPoint,
  getTouchingBorder,
  isTouchingDisc,
  limitPlayerToField,
  reverseDiscDirection,
} from "./functions";
import UI from "./UI";

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
  };

  const handleKeyUp = (e) => {
    refPressedKeys.current = { ...refPressedKeys.current, [e.key]: false };
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
    } else {
      setGameState((prev) => {
        // setting new positions based on velocity
        let newDiscPosition = {
          x: prev.disc.x + prev.disc.velocity.x,
          y: prev.disc.y + prev.disc.velocity.y,
        };

        let newVelocity = {
          x: prev.disc.velocity.x * FRICTION,
          y: prev.disc.velocity.y * FRICTION,
        };

        const borders = getTouchingBorder(discRect, fieldRect);

        [newDiscPosition, newVelocity] = reverseDiscDirection(
          borders,
          newDiscPosition,
          newVelocity,
          { w: DISC_WIDTH, h: DISC_HEIGHT },
          DISC_GAP_FROM_BORDERS
        );

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

  useEffect(() => {
    if (!isPlayersConnected) {
      setGameState((prev) => ({ ...prev, time: 0 }));
    }
  }, [isPlayersConnected]);

  //socket listeners initialization
  useEffect(() => {
    if (!socket) return;

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

    socket.on("playerDisconnected", () => {
      console.log("playerDisconnected");
      setIsPlayersConnected(false);
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
    <div className="bg-blue-950 h-screen w-screen p-[8%] flex justify-center items-center">
      {!isPlayersConnected && (
        <div className="absolute inset-0 z-40 flex justify-center items-center backdrop-blur-sm">
          <div className="bg-black w-full h-full absolute opacity-40"></div>
          <h1 className="text-3xl font-semibold text-white z-50">
            Waiting for other player...
          </h1>
        </div>
      )}

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
