import React, { useEffect, useState } from "react";
import Score from "./Score";
import Time from "./Time";

const UI = ({ startGame, score, countDown }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let intervalId;
    if (startGame && countDown <= 0) {
      intervalId = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else if (countDown > 0) {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [startGame, countDown]);
  return (
    <div className="px-5 py-3 left-1/2 z-10 top-2 -translate-x-1/2 drop-shadow-lg backdrop-blur-sm absolute text-white text-center ">
      <div className="relative z-10">
        <Time
          time={`${Math.floor(time / 60)}:${Math.floor(time % 60)
            .toString()
            .padStart(2, "0")}`}
        />
        <Score p1={score[0]} p2={score[1]} />
      </div>
      <div className="bg-slate-950 absolute inset-0 rounded-lg opacity-70"></div>
    </div>
  );
};

export default UI;
