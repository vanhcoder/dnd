import { CallExpression } from "../parser";
import { Evaluate, ExcelFunctions, Variables } from "./evaluate";

export function parserCallExpression(
  ast: CallExpression,
  variables: Variables,
  functions: ExcelFunctions,
  evaluate: Evaluate
) {
  if (!Object.prototype.hasOwnProperty.call(functions, ast.caller)) {
    throw Error(`Unknown Call: ${ast.caller}`);
  }

  const args = ast.arguments.map((arg) => evaluate(arg, variables, functions));
  return functions[ast.caller as keyof ExcelFunctions](...args);
}