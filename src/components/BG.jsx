import React from "react";

const BG = () => {
  return (
    <>
      <div
        id="middleLine"
        className="w-[1vw] h-full bg-white absolute -translate-x-1/2 top-0 left-1/2"
      ></div>
      <div
        id="middleCircle"
        className="w-[25vw] h-[25vw] outline outline-[1vw] outline-white rounded-full  absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
      ></div>
    </>
  );
};

export default BG;
