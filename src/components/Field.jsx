import Player from "./Player";
import Disc from "./Disc";
import BG from "./BG";

const Field = ({ gameState, refs }) => {
  return (
    <div className="relative w-full h-full outline outline-8  outline-white">
      <Player pos={gameState.players[0]} elemRef={refs[0]} />
      <Player pos={gameState.players[1]} elemRef={refs[1]} />
      <Disc pos={gameState.disc} elemRef={refs[2]} />

      <div
        id="leftWall"
        className="w-4 h-40 bg-black absolute z-10 top-1/2 -ml-4 -translate-y-1/2 left-0"
      ></div>
      <div
        id="rightWall"
        className="w-4 h-40 bg-black absolute z-10 top-1/2 -mr-4 -translate-y-1/2 right-0"
      ></div>
      <BG />
    </div>
  );
};

export default Field;
