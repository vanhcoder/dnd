import { VariableExpression } from "../ast/parser";
import { Variables } from "./evaluate";

export function parserVariable(ast: VariableExpression, variables: Variables) {
  if (!Object.prototype.hasOwnProperty.call(variables, ast.name))
    throw Error(`Variable ${ast.name} : undfined`);
  return variables[ast.name];
}
