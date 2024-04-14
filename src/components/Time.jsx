import React from "react";

const Time = ({ time }) => {
  return (
    <div className="text-2xl font-bold">
      Time: <span className="font-normal">{time}</span>
    </div>
  );
};

export default Time;
