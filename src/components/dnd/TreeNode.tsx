import { INode, ItemTypes, MoveType, NodeTypes } from "./Tree";
import Node from "./Node";
import DropZone from "./DropZone";
import { useState } from "react";

const TreeNode = ({
  node,
  moveNode,
  isLastElement,
  parentId,
}: {
  node: INode;
  parentId: string;
  isLastElement: boolean;
  moveNode: (draggedItem: INode, targetNode: INode, moveType: MoveType) => void;
}) => {
  return (
    <Node
      node={node}
      isLastElement={isLastElement}
      type={ItemTypes.NODE}
      dropZone={{
        accept: ItemTypes.NODE,
        canDrop: (item) => {
          if (item.id === node.id) return false;
          if (node.parentId !== "ROOT" && item.type === NodeTypes.PARENT)
            return false;
          return item.id !== parentId;
        },
        collect: (monitor) => ({
          isOver: monitor.isOver(), // Theo dõi trạng thái isOver
          canDrop: monitor.canDrop(), //
        }),
        onDrop: (item, move) => {
          moveNode(item, node, move);
        },
      }}
      children={({ isDragging }) => {
        return (
          <div
            style={{
              opacity: isDragging ? 0.5 : 1,
              padding: "5px",
              border: "1px solid #ccc",
              margin: "5px",
              backgroundColor: "white",
              cursor: "grab",
            }}
          >
            {node.text}
            {node.type === NodeTypes.PARENT ? (
              <>
                {node.children?.length ? (
                  <div>
                    <div
                      style={{
                        padding: "5px",
                        border: "1px solid #ccc",
                        margin: "5px",
                        backgroundColor: "white",
                        cursor: "grab",
                      }}
                    >
                      {node.children &&
                        node.children.map((child, index) => (
                          <TreeNode
                            key={child.id}
                            node={child}
                            parentId={node.id}
                            moveNode={moveNode}
                            isLastElement={
                              index === (node.children || []).length - 1
                            }
                          />
                        ))}
                    </div>
                  </div>
                ) : (
                  <DropZone<INode>
                    accept={ItemTypes.NODE}
                    canDrop={(item) => {
                      if (item.type === NodeTypes.PARENT) return false;
                      return item.id !== parentId;
                    }}
                    collect={(monitor) => ({
                      isOver: monitor.isOver(), // Theo dõi trạng thái isOver
                      canDrop: monitor.canDrop(), //
                    })}
                    onDrop={(item) => {
                      moveNode(item, node, "in");
                    }}
                    children={<div style={{ height: 30 }}>Drag here</div>}
                  />
                )}
              </>
            ) : null}
          </div>
        );
      }}
    ></Node>
  );
};
export default TreeNode;
