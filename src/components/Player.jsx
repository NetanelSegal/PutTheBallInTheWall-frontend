const Player = ({ pos, elemRef }) => {
  return (
    <div
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
      }}
      ref={elemRef}
      className="absolute aspect-square z-30 w-[8%] rounded-full bg-slate-500 duration-300 ease-linear transition-all"
    ></div>
  );
};

export default Player;
