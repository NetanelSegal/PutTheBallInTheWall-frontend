import React, { useEffect, useRef, useState } from "react";

const Disc = () => {
  const ref = useRef();
  const [isTouching, setIsTouching] = useState(false);

  const handleMousemove = (e) => {
    const mousePos = { x: e.clientX, y: e.clientY };
    const discPos = ref.current.getBoundingClientRect();

    // doesnt work

    // const newSpeed = calculateSpeed(
    //   mousePos.x,
    //   mousePos.y,
    //   discPos.x + discPos.width / 2,
    //   discPos.y + discPos.height / 2,
    //   Date.now()
    // );

    // setSpeed(newSpeed);

    if (isTouchingDisc(mousePos, discPos)) {
      setIsTouching(true);
    } else {
      setIsTouching(false);
    }
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
    if (isTouching) {
      console.log("thoucing");
    }
  }, [isTouching]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMousemove);

    return () => {
      document.removeEventListener("mousemove", handleMousemove);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="w-20 z-30 rounded-full h-20 absolute bg-black top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
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
