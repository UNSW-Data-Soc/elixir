import { useEffect, useState } from "react";

type MousePosition = {
  x: number;
  y: number;
};

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition | null>(null);

  useEffect(() => {
    const updateMousePosition = (e: any) => {
      //   console.log(e.clientX, e.clientY);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);
  return mousePosition;
};
export default useMousePosition;
