import { ReactNode, useEffect, useState } from "react";
import styles from "./WorkFlowContainer.module.css";
import React from "react";
import useParentStore from "../../store";

type Props = {
  children: ReactNode;
};

function WorkFlowContainer({ children }: Props) {
  const setMousePosition = useParentStore((state) => state.setMousePosition);
  const [zoom, setZoom] = useState(1);

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2)); // Tối đa là 200%
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5)); // Tối thiểu là 50%
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // Tính toán tốc độ cuộn dựa trên vị trí của chuột
      const scrollX = (mouseX / window.innerWidth) * 10;
      const scrollY = (mouseY / window.innerHeight) * 10;

      // Cuộn trang
      window.scrollBy(scrollX, scrollY);
    };

    // Gắn sự kiện mousemove vào document
    document.addEventListener("mousemove", handleMouseMove);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className={styles.WorkFlowContainer}
      id="WorkFlowContainer"
      onMouseMove={handleMouseMove}
    >
      <div>
        <button onClick={handleZoomOut}>Zoom Out</button>
        <button onClick={handleZoomIn}>Zoom In</button>
      </div>
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "0px 0px",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0 }}>
          <div className={styles.reteBackground}></div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default WorkFlowContainer;
