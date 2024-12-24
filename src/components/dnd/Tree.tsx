import { Children, useState } from "react";
import { DndProvider } from "react-dnd";
import TreeNode from "./TreeNode";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";
import DragLayer from "./DragLayer";

export const ItemTypes = {
  NODE: "node",
  DROPZONE: "dropzone",
} as const;

export const NodeTypes = {
  ITEM: "item",
  PARENT: "parent",
} as const;

export type INode = NodeItem | ParentNode;

export type ParentNode = {
  id: string;
  text: string;
  parentId: string;
  type: string;
  children: NodeItem[];
};

export type NodeItem = {
  id: string;
  text: string;
  parentId: string;
  type: string;
};

export type RootTree = {
  id: string;
  children: INode[];
};

function generateTreeData(numParents = 10, numChildrenPerParent = 0) {
  const treeData: INode[] = [];

  for (let i = 1; i <= numParents; i++) {
    const parentId = uuidv4();
    const parent: ParentNode = {
      id: parentId,
      text: i % 2 === 0 ? `Parent ${i}` : `Item ${i}`,
      parentId: "ROOT",
      type: i % 2 === 0 ? NodeTypes.PARENT : NodeTypes.ITEM,
      children: [],
    };

    // Add children to the parent node
    for (let j = 1; j <= numChildrenPerParent; j++) {
      const child: NodeItem = {
        id: uuidv4(),
        text: `Child ${j}`,
        parentId: parentId,
        type: NodeTypes.ITEM,
      };
      parent.children.push(child);
    }

    treeData.push(parent);
  }

  return {
    id: "ROOT",
    children: treeData,
  };
}

function removeNode(root: RootTree, draggedItem: INode): RootTree {
  if (draggedItem.parentId === "ROOT") {
    return {
      ...root,
      children: root.children.filter((i) => i.id !== draggedItem.id),
    };
  } else {
    return {
      ...root,
      children: root.children.map((node) => {
        if (node.id === draggedItem.parentId) {
          return {
            ...node,
            children: node.children.filter(
              (child) => child.id !== draggedItem.id
            ),
          };
        }
        return node;
      }),
    };
  }
}

function addNode(
  root: RootTree,
  draggedItem: INode,
  targetItem: INode,
  moveType: MoveType
) {
  if (root.id === targetItem.parentId) {
    const newChildren: INode[] = [];
    for (const element of root.children) {
      if (element.id === targetItem.id) {
        draggedItem.parentId = element.parentId;
        if (moveType === "up") {
          newChildren.push(...[draggedItem, element]);
        } else if (moveType === "down") {
          newChildren.push(...[element, draggedItem]);
        } else {
          console.log("element", element);
          draggedItem.parentId = element.id;
          element.children.push(draggedItem);
          newChildren.push(element);
        }
      } else {
        newChildren.push(element);
      }
    }
    return {
      ...root,
      children: newChildren,
    };
  }
  const parent = root.children.find((i) => i.id === targetItem.parentId);
  if (!parent) return root;
  const newChildren: INode[] = [];
  for (const element of parent.children) {
    if (element.id === targetItem.id) {
      draggedItem.parentId = element.parentId;
      if (moveType === "up") {
        newChildren.push(...[draggedItem, element]);
      } else if (moveType === "down") {
        newChildren.push(...[element, draggedItem]);
      }
    } else {
      newChildren.push(element);
    }
  }
  return {
    ...root,
    children: root.children.map((i) =>
      i.id === parent.id ? { ...i, children: newChildren } : i
    ),
  };
}

export type MoveType = "up" | "down" | "in";
const Tree = () => {
  const [treeData, setTreeData] = useState<RootTree>(() => generateTreeData());
  const moveNode = (
    draggedItem: INode,
    targetItem: INode,
    moveType: MoveType
  ) => {
    setTreeData((prev) => {
      const removed = removeNode(prev, draggedItem);
      const newRoot = addNode(removed, draggedItem, targetItem, moveType);
      console.log("newRoot", newRoot);
      return newRoot;
    });
  };
  return (
    <div style={{ width: 200 }}>
      <DndProvider backend={HTML5Backend}>
        {treeData.children.map((node, index) => (
          <TreeNode
            key={node.id}
            node={node}
            parentId={treeData.id}
            moveNode={moveNode}
            isLastElement={index === treeData.children.length - 1}
          />
        ))}
      </DndProvider>
    </div>
  );
};
export default Tree;

/**
 *
 * [1,2,3,4,5,6,7]
 * remove phần tử thứ 7
 * -> [1,2,3,4,5,6]
 * tìm phàn tử thứ 1 là 0
 * chèn phần thử thứ 7 vào trước 1
 * [7,1,2,3,4,5,6]
 */
