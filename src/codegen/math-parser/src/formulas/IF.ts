import { ASTNode } from "../ast/parser";

export type IFFormula = (condition: boolean, a: ASTNode, b: ASTNode) => ASTNode;

/**
 * @function IF
 * @param condition
 * @param a
 * @param b
 * @returns
 */

const IF: IFFormula = (condition, a, b) => {
  return condition ? a : b;
};

export default IF;
