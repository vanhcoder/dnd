import { useDrag } from "react-dnd";
import DropZone, { IDropZone } from "./DropZone";
import { ReactNode } from "react";
import { MoveType } from "./Tree";

type NodeWrapper<T> = {
  node: T;
  isLastElement: boolean;
  type: string;
  dropZone: Omit<IDropZone<T>, "onDrop"> & {
    onDrop: (node: T, destination: MoveType) => void;
  };
  children: ({ isDragging }: { isDragging: boolean }) => ReactNode;
};

function Node<T>({
  node,
  isLastElement,
  type,
  dropZone,
  children,
}: NodeWrapper<T>) {
  const [{ isDragging }, dragRef] = useDrag({
    type: type,
    item: node,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  return (
    <div>
      <DropZone
        {...dropZone}
        onDrop={(item) => {
          console.log("item", item);
          dropZone.onDrop(item, "up");
        }}
      />
      <div ref={dragRef}>{children({ isDragging })}</div>
      {isLastElement && (
        <DropZone
          {...dropZone}
          onDrop={(item) => {
            dropZone.onDrop(item, "down");
          }}
        />
      )}
    </div>
  );
}
export default Node;
