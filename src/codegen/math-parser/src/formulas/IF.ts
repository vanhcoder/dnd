import { ASTNode } from "../parser";

export default function IF(condition: boolean, a: ASTNode, b: ASTNode) {
  return condition ? a : b;
}
