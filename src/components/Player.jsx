import React, { useRef } from "react";

const Player = ({ pos }) => {
  const ref = useRef();

  return (
    <div
      style={{
        left: pos.x,
        top: pos.y,
      }}
      ref={ref}
      className="absolute w-20 h-20 rounded-full bg-slate-500"
    ></div>
  );
};

export default Player;
