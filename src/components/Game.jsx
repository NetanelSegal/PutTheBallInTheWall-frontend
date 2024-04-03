import React, { useEffect, useRef, useState } from "react";
import io from 'socket.io-client';
import Field from "./Field";
import {
  calculateDiscVelocity,
  getKissingPoint,
  getTouchingBorder,
  isTouchingDisc,
} from "./functions";

const PLAYER_WIDTH = 8;
const DISC_WIDTH = 5;
const INITIAL_DISTANCE = 0.8;
const SPEED_MULTIPLIER = 0.02;
const FRICTION = 0.9;
const SOCKET_SERVER_URL = 'http://localhost:3000';


const Game = () => {
  const widthConversionFactor = 100 / window.innerWidth; // Percentage per pixel (width)
  const heightConversionFactor = 100 / window.innerHeight; // Percentage per pixel (height)

  const refP1 = useRef();
  const refP2 = useRef();
  const refDisc = useRef();
  const refField = useRef();

  const [socket, setSocket] = useState(null);

  const [currentPlayerNum, setCurrentPlayerNum] = useState(null);

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

  const updateGameState = () => {
    let deltaX = 0;
    let deltaY = 0;
    // Check for pressed arrow keys and update movement deltas
    if (pressedKeys["ArrowUp"] || pressedKeys["w"] || pressedKeys["W"]) {
      deltaY -= playerSpeed; // Player movement distance (adjust as needed)
    }
    if (pressedKeys["ArrowDown"] || pressedKeys["s"] || pressedKeys["S"]) {
      deltaY += playerSpeed;
    }
    if (pressedKeys["ArrowRight"] || pressedKeys["d"] || pressedKeys["D"]) {
      deltaX += playerSpeed;
    }
    if (pressedKeys["ArrowLeft"] || pressedKeys["a"] || pressedKeys["A"]) {
      deltaX -= playerSpeed;
    }
    console.log(currentPlayerNum);
    let x;
    let y;
    // if( gameState.players[currentPlayerNum]){
     x = gameState.players[currentPlayerNum].x + deltaX;
     y = gameState.players[currentPlayerNum].y + deltaY;
  //  }

    socket.emit("playerMovement", { x, y })
      

    // console.log(currentPlayerNum);
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player, index) =>
        index === currentPlayerNum ? { x, y, } : player
      ),

    })
    );




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

      // const reflectedPoint = {
      //   x: 2 * discCenter.x - touchPoint.x,
      //   y: 2 * discCenter.y - touchPoint.y,
      // };

      const direction = {
        x: discCenter.x - touchPoint.x,
        y: discCenter.y - touchPoint.y,
      };

      const discVelocity = calculateDiscVelocity(direction, playerSpeed);

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

        const fieldRect = refField.current.getBoundingClientRect();

        const border = getTouchingBorder(discRect, fieldRect);
        switch (border) {
          case "bottom":
            newVelocity.y *= -1;
            newDiscPosition.y = newDiscPosition.y - 1;
            console.log("newVelocity", newVelocity);
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
    if (currentPlayerNum == null || currentPlayerNum === 0) return;
    console.log(currentPlayerNum);
    let lastTime = Date.now();


    const gameLoop = setInterval(() => {
      const currTime = Date.now();
      // console.log(lastTime - currTime);
      lastTime = currTime;
      updateGameState();
    }, 16); // Call updateGameState every 16ms (roughly 60 FPS)


    return () => clearInterval(gameLoop);
  }, [pressedKeys, currentPlayerNum]);


  //socket listeners initialization
  useEffect(() => {
    if (!socket) return;

    socket.on("connected", (usersCount) => {
      setCurrentPlayerNum(usersCount - 1);
    });

    // socket.on("playerUpdate", (updatedPlayers) => {
    //   console.log(updatedPlayers);
    //   setGameState((prev) => ({
    //     ...prev,
    //     players: updatedPlayers,
    //   }));
    // });

    socket.on("playerUp", (movementData) => {
      // Update player 1's movement on player 2's screen
      setGameState((prev) => ({
        ...prev,
        players: prev.players.map((player, index) =>
          index != currentPlayerNum ? movementData : player
        ),
      }))
    });
  }, [socket ,currentPlayerNum])

  // event listeners & game positions initialization
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);


    initialPlayersPosition();

    // window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      newSocket.disconnect();
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
