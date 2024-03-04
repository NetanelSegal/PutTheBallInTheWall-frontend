import { useRef } from "react";
import Players from "./components/Players";
import Disc from "./components/Disc";

function App() {
  const gameAreaRef = useRef();

  return (
    <div className="bg-blue-950 h-screen p-9">
      <div
        ref={gameAreaRef}
        className="relative w-full h-full outline outline-8  outline-white"
      >
        <Disc />
        <Players gameAreaRef={gameAreaRef} />
      </div>
    </div>
  );
}

export default App;
