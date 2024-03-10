import { useEffect, useRef, useState } from "react";

const INITIAL_DISTANCE = 0.5;
const SPEED_MULTIPLIER = 0.01;

const Disc = () => {
  const ref = useRef();
  const [isThouch, setIsTouch] = useState();
  const [touchPoint, setTouchPoint] = useState({ x: 0, y: 0 });
  const lastTime = useRef(new Date());

  const [pos, setPos] = useState({
    x: window.innerWidth / 2 - 75,
    y: window.innerHeight / 2 - 75,
  });

  const handleMousemove = (e) => {
    const mousePos = { x: e.clientX, y: e.clientY };
    const discPos = ref.current.getBoundingClientRect();

    const discCenter = {
      x: discPos.left + discPos.width / 2,
      y: discPos.top + discPos.height / 2,
    };

    if (isTouchingDisc(mousePos, discPos)) {
      setIsTouch(true);
      setTouchPoint(mousePos);
    }
    const time = new Date().getTime();
    lastTime.current = time;
  };

  const isTouchingDisc = (mousePosition, discPosition) => {
    const discCenter = {
      x: discPosition.left + discPosition.width / 2,
      y: discPosition.top + discPosition.height / 2,
    };

    const distance = Math.sqrt(
      Math.pow(mousePosition.x - discCenter.x, 2) +
        Math.pow(mousePosition.y - discCenter.y, 2)
    );

    return distance <= discPosition.width / 2;
  };

  useEffect(() => {
    if (isThouch) {
      const discPos = ref.current.getBoundingClientRect();

      const discCenter = {
        x: discPos.left + discPos.width / 2,
        y: discPos.top + discPos.height / 2,
      };

      // console.log("difference: ", difference.x, difference.y);
      // היקף של עיגול = radius * PI * 2
      // זאת אומרת שאפשר לייצג כיוון לפי מספרים
      //    מ-0 עד
      // אפשר לעשות כיוון עם נתונים של
      // x and y

      // Calculate the new x and y values of the point
      // that is exactly on the other side of the ball

      const reflectedPoint = {
        x: 2 * discCenter.x - touchPoint.x,
        y: 2 * discCenter.y - touchPoint.y,
      };
      moveDisc({
        x: reflectedPoint.x - discCenter.x,
        y: reflectedPoint.y - discCenter.y,
      });
    }
  }, [isThouch]);

  const moveDisc = (dir) => {
    const currDiscPos = {
      x: Number(ref.current.style.left.slice(0, -2)),
      y: Number(ref.current.style.top.slice(0, -2)),
    };
    const newTime = new Date().getTime();
    console.log("time: ", newTime);
    console.log("lastTime: ", lastTime.current);
    setPos({
      x: currDiscPos.x + dir.x * INITIAL_DISTANCE + "px",
      y: currDiscPos.y + dir.y * INITIAL_DISTANCE + "px",
    });
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMousemove);

    return () => {
      document.removeEventListener("mousemove", handleMousemove);
    };
  }, []);

  return (
    <div
      onMouseLeave={() => setIsTouch(false)}
      ref={ref}
      style={{
        left: pos.x,
        top: pos.y,
      }}
      className="w-20 z-30 rounded-full h-20 absolute bg-black"
    ></div>
  );
};

// doesnt work

// function calculateSpeed(currentX, currentY, lastX, lastY, lastTimestamp) {
//   const deltaTime = Date.now() - lastTimestamp;
//   if (deltaTime > 0) {
//     const distance = Math.sqrt(
//       Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2)
//     );
//     return distance / deltaTime;
//   }
//   return 0;
// }

export default Disc;
