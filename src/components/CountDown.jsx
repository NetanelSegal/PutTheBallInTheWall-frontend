import React, { useEffect } from "react";

const CountDown = ({ count, setCount }) => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="absolute z-40 inset-0 text-6xl backdrop-blur-sm ">
      <div className="w-full h-full relative inset-0 bg-black opacity-40"></div>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 font-bold -translate-y-1/2 z-50 text-white">
        {count}
      </span>
    </div>
  );
};

export default CountDown;
