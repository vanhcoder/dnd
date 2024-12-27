import { BinaryExpression } from "../parser";
import { Evaluate, ExcelFunctions, Variables } from "./evaluate";

export function parserBinaryExpression(
  ast: BinaryExpression,
  variables: Variables,
  functions: ExcelFunctions,
  evaluate: Evaluate
) {
  const left = evaluate(ast.left, variables, functions);
  const right = evaluate(ast.right, variables, functions);

  switch (ast.operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return left / right;
    case "==":
      return left == right;
    case ">":
      return left > right;
    case "<":
      return left < right;
    case ">=":
      return left >= right;
    case "<=":
      return left <= right;
    case "!=":
      return left != right;
    default:
      throw new Error(`Unknown operator: ${ast.operator}`);
  }
}
