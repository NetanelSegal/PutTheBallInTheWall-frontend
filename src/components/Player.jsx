import React, { useRef } from "react";

const Player = ({ pos, elemRef }) => {
  return (
    <div
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
      }}
      ref={elemRef}
      className="absolute aspect-square z-10 w-[8%] rounded-full bg-slate-500 duration-0 ease-in-out transition-all"
    ></div>
  );
};

export default Player;
