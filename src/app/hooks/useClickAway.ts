import { useEffect, useRef } from "react";

export function useClickAway(cb: any) {
  const ref = useRef<any>(null);
  const refCb = useRef(cb);

  useEffect(() => {
    const handler = (e: any) => {
      const element = ref.current;
      if (element && !element.contains(e.target)) {
        refCb.current(e);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  return ref;
}

export default useClickAway;
