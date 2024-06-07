import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import StartPage from "./components/StartPage";
import Game from "./components/Game";
import URLS from "./constants/URLS";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [roomName, setRoomName] = useState(null);

  useEffect(() => {
    const newSocket = io(URLS.socket);
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      {!roomName ? (
        <StartPage socket={socket} setRoomName={setRoomName} />
      ) : (
        <Game socket={socket} roomName={roomName} />
      )}
    </div>
  );
};

export default App;
