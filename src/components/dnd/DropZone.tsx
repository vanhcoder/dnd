import { ReactNode } from "react";
import { useDrop } from "react-dnd";

export type IDropZone<T> = {
  accept: string;
  onDrop: (item: T) => void;
  canDrop: (item: T) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collect: (item: any) => any;
  hover?: (item: any) => any;
  children?: ReactNode;
};

function DropZone<T>({
  onDrop,
  accept,
  canDrop,
  collect,
  hover,
  children,
}: IDropZone<T>) {
  const [{ isOver, canDrop: canD }, drop] = useDrop<T>(() => ({
    accept,
    drop: onDrop,
    canDrop,
    collect,
    hover,
  }));
  return (
    <div
      ref={drop}
      style={{
        border: isOver && canD ? "1px dashed black" : "none", // Thay đổi màu nền
        height: isOver && canD ? 40 : 10,
        minHeight: 10,
        transition: "height 0.3s ease-out",
      }}
    >
      {children}
    </div>
  );
}

export default DropZone;
