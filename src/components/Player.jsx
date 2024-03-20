import React, { useRef, useState } from "react";

const Player = () => {
  const ref = useRef();
  const [pressedKeys, setPressedKeys] = useState({});
  const [position, setPosition] = useState({ x: 100, y: 200 });

  return (
    <div
      style={{
        left: position.x,
        top: position.y,
      }}
      ref={ref}
      className="absolute w-20 h-20 rounded-full bg-slate-500"
    ></div>
  );
};

export default Player;
