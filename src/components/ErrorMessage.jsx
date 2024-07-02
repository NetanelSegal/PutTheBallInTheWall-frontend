import React from "react";

const ErrorMessage = ({ msg }) => {
  return (
    <div className="p-3 text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="absolute inset-0 bg-slate-900  border-2 border-white -z-10 rounded-2xl "></div>
      <div className="text-center text-white p-3">
        <span className="text-red-500 fw-bold">{msg}</span>
        <h4>please try again later</h4>
      </div>
    </div>
  );
};

export default ErrorMessage;
