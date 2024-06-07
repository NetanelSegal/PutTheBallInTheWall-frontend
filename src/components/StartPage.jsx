import React, { useRef, useState } from "react";
import gameTitleSvg from "../assets/game title.svg";

const StartPage = ({ socket, setRoomName }) => {
  const [error, setError] = useState(null);
  const refRoomNameInput = useRef();

  const onSubmit = (e) => {
    e.preventDefault();
    const roomName = refRoomNameInput.current.value;
    if (roomName === "") {
      return setError("Must enter a room name");
    }
    socket.emit("joinRoom", roomName);
    setRoomName(roomName);
  };

  return (
    <div className="bg-blue-950 flex h-screen w-screen justify-center items-center text-center text-white">
      <div className="flex gap-10 justify-center w-full items-center flex-col max-w-[50%] mx-auto">
        <div className="gameTitle text-left w-full">
          <h1 className="text-xl">Welcome to</h1>
          <img className="w-full" src={gameTitleSvg} alt="" />
        </div>
        <form onSubmit={onSubmit} className="gap-2">
          <input
            ref={refRoomNameInput}
            type="text"
            id="inputRoomName"
            placeholder="Enter room name"
            className="px-3 py-2 rounded-lg border-2 border-white bg-blue-950"
          />
          <button
            className="px-3 py-2 ml-2 bg-white text-blue-950 rounded-lg"
            type="submit"
          >
            Enter
          </button>
          <br />
          <span className="text-red-500">{error}</span>
        </form>
      </div>
    </div>
  );
};

export default StartPage;
