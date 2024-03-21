import React, { useRef } from "react";

const Disc = ({ pos, elemRef }) => {
  const ref = useRef();

  return (
    <div
      ref={elemRef}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
      }}
      className="z-30 w-[5%] aspect-square rounded-full absolute bg-black"
    ></div>
  );
};

export default Disc;
