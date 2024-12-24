import { useEffect, useState } from "react";
import useParentStore from "../../store";

const Connector = ({
  fromId,
  toId,
}: {
  fromId: string;
  toId: string;
  isConnected: boolean;
}) => {
  const [pathD, setPathD] = useState("");
  const mousePosition = useParentStore((state) => state.mousePosition);
  useEffect(() => {
    const updatePath = () => {
      const fromElement = document.getElementById(fromId);
      const toElement = document.getElementById(toId);

      if (fromElement && toElement) {
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();

        const x1 = fromRect.left + fromRect.width;
        const y1 = fromRect.top + fromRect.height / 2;
        const x2 = toRect.left + 0;
        const y2 = toRect.top + toRect.height / 2;
        const path = `M ${x1},${y1} L ${x1 + 50},${y1} L ${
          x1 + 50
        },${y2} L ${x2},${y2}`;
        setPathD(path);
      }
    };

    updatePath();
    window.addEventListener("resize", updatePath);
    window.addEventListener("scroll", updatePath);

    return () => {
      window.removeEventListener("resize", updatePath);
      window.removeEventListener("scroll", updatePath);
    };
  }, [fromId, toId, mousePosition]);
  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
      }}
    >
      <path d={pathD} stroke="#ddd" fill="transparent" strokeWidth="1" />
    </svg>
  );
};

export default Connector;
