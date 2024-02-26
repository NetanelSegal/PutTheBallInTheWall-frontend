function App() {
  return (
    <div className="bg-blue-950 h-screen p-9">
      <div className="relative w-full h-full outline outline-8  outline-white">
        <div
          className="w-20 h-20 rounded-full bg-slate-500"
          id="playerOne"
        ></div>
        <div
          className="w-20 h-20 rounded-full bg-slate-500"
          id="playerTwo"
        ></div>
        <div
          id="leftWall"
          className="w-4 h-40 bg-black absolute z-10 top-1/2 -ml-4 -translate-y-1/2 left-0"
        ></div>
        <div
          id="rightWall"
          className="w-4 h-40 bg-black absolute z-10 top-1/2 -mr-4 -translate-y-1/2 right-0"
        ></div>

        <div
          id="middleLine"
          className="w-2 h-full bg-white absolute -translate-x-1/2 top-0 left-1/2"
        ></div>

        <div
          id="middleCircle"
          className="w-64 h-64 border-8 border-white rounded-full  absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
        ></div>
      </div>
    </div>
  );
}

export default App;
