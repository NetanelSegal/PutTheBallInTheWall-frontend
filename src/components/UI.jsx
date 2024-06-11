import React from "react";
import Score from "./Score";
import Time from "./Time";

const UI = ({ timeInMS, score }) => {
  const m = Math.floor(timeInMS / 1000 / 60);
  const s = Math.floor((timeInMS / 1000) % 60);
  return (
    <div className="px-5 py-3 left-1/2 z-10 top-2 -translate-x-1/2 drop-shadow-lg backdrop-blur-sm absolute text-white text-center ">
      <div className="relative z-10">
        <Time time={`${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`} />
        <Score p1={score[0]} p2={score[1]} />
      </div>
      <div className="bg-slate-950 absolute inset-0 rounded-lg opacity-70"></div>
    </div>
  );
};

export default UI;
