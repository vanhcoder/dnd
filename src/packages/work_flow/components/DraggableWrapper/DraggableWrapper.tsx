import React, { useState, useEffect } from "react";
import useParentStore from "../../store";
import Hooks from "../Connector/Hook";

interface DraggableWrapperProps {
  children: React.ReactNode;
  id: string;
}

const DraggableWrapper: React.FC<DraggableWrapperProps> = ({
  children,
  id,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const mousePosition = useParentStore((state) => state.mousePosition);
  const stackOrder = useParentStore((state) => state.stackOrder);
  const setStackOrder = useParentStore((state) => state.setStackOrder);

  const zIndex = stackOrder.indexOf(id) + 1 || 1;
  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setStackOrder(id);
    setOffset({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  };

  // Sử dụng `useEffect` để lắng nghe các sự kiện toàn cục khi đang kéo
  useEffect(() => {
    const handleMouseMove = () => {
      if (isDragging) {
        setPosition({
          x: mousePosition.x - offset.x,
          y: mousePosition.y - offset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      // Thêm lắng nghe sự kiện khi bắt đầu kéo
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    // Loại bỏ sự kiện khi kết thúc kéo
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset, mousePosition]);

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: "all-scroll",
        border: "1px solid black",
        zIndex: zIndex,
      }}
      className="bg-gray-200"
    >
      {children}
      <Hooks isConnected />
    </div>
  );
};

export default DraggableWrapper;
