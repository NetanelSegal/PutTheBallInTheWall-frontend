import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import StartPage from "./components/StartPage";
import Game from "./components/Game";
import URLS from "./constants/URLS";
import ErrorMessage from "./components/ErrorMessage";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isMobile) {
      screen.orientation.lock("landscape-primary");
    }
  }, [isMobile]);

  useEffect(() => {
    const newSocket = io(URLS.socket, {
      transports: ["websocket"],
      reconnection: false, // Disable reconnection
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection failed:", error);
      setError("Coudln't connect to server");
    });
    setSocket(newSocket);
    setIsMobile(
      navigator.userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/
      )
    );
    return () => {
      newSocket.disconnect();
    };
  }, []);
  useEffect(() => {
    console.log(socket);
  }, [socket]);
  return (
    <div className="App">
      {error.length > 0 && <ErrorMessage msg={error} />}
      {!roomName ? (
        <StartPage
          socket={socket}
          setRoomName={setRoomName}
          connectionError={error.length > 0}
        />
      ) : (
        <Game isMobile={isMobile} socket={socket} roomName={roomName} />
      )}
    </div>
  );
};

export default App;
