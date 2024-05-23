import Player from "./Player";
import Disc from "./Disc";
import BG from "./BG";



const Field = ({ gameState, refs, refField }) => {

  return (
    <div
      ref={refField}
      className="relative w-full h-full outline outline-[1vw] outline-white"
    >
      <Player pos={gameState.players[0]} elemRef={refs[0]} />
      <Player pos={gameState.players[1]} elemRef={refs[1]} />
      <Disc pos={gameState.disc} elemRef={refs[2]} />

      <div
        id="leftWall"
        className="w-[1.5vw] h-[20%] bg-black absolute z-10 top-1/2 -ml-[1vw] -translate-y-1/2 left-0"
      ></div>
      <div
        id="rightWall"
        className="w-[1.5vw] h-[20%] bg-black absolute z-10 top-1/2 -mr-[1vw] -translate-y-1/2 right-0"
      ></div>
      <BG />
    </div>
  );
};

export default Field;
