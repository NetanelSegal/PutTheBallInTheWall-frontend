import Player from "./Player";
import Disc from "./Disc";
import BG from "./BG";

const Field = ({ gameState, refPlayers, refDisc, refField, refWalls }) => {
  return (
    <div
      ref={refField}
      className="absolute m-auto outline max-h-[90%] max-w-[90%] inset-0 aspect-video outline-[1.5vh] outline-white"
    >
      <Player pos={gameState.players[0]} elemRef={refPlayers[0]} />
      <Player pos={gameState.players[1]} elemRef={refPlayers[1]} />
      <Disc pos={gameState.disc} elemRef={refDisc} />
      <div
        ref={refWalls[0]}
        id="leftWall"
        className="w-[2vh] h-[20%] bg-black absolute z-10 top-1/2 -ml-[1.5vh] -translate-y-1/2 left-0"
      ></div>
      <div
        ref={refWalls[1]}
        id="rightWall"
        className="w-[2vh] h-[20%] bg-black absolute z-10 top-1/2 -mr-[1.5vh] -translate-y-1/2 right-0"
      ></div>
      <BG />
    </div>
  );
};

export default Field;
