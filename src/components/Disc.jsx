import React, { useEffect, useRef, useState } from "react";

const Disc = () => {
  const ref = useRef();
  const [pos, setPos] = useState({});

  useEffect(() => {
    const { width, height } = ref?.current?.getBoundingClientRect();
    // console.log(width, height);
    // console.log(window.innerWidth / 2, window.innerHeight / 2);

    setPos({
      x: window.innerWidth / 2 - 64,
      y: window.innerHeight / 2 - 56,
    });
  }, []);

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
