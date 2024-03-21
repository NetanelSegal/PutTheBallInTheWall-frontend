import React, { useEffect, useRef, useState } from "react";

const Disc = ({ pos }) => {
  const ref = useRef();

  return (
    <div
      ref={ref}
      style={{
        left: pos.x,
        top: pos.y,
      }}
      className="z-30 w-14 h-14 rounded-full absolute bg-black"
    ></div>
  );
};

export default Disc;
