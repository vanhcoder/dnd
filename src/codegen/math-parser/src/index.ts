import { evaluate, ExcelFunctions } from "./evaluate";
import { tokenize } from "./lexer";
import { Parser } from "./parser";

export function evaluateExpression(
  input: string,
  variables?: Record<string, any> = {},
  functions?: ExcelFunctions
): any {
  const tokens = tokenize(input);
  console.log("tokens", tokens);
  const ast = new Parser(tokens).parse();
  console.log("ast", ast);
  const value = evaluate(ast, variables, functions);
  console.log("value", value);
}
