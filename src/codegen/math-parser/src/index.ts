import { evaluate, ExcelFunctions, Variables } from "./evaluate/evaluate";
import formulas from "./formulas";
import { tokenize } from "./lexer";
import { Parser } from "./parser";

const excelFunctions: ExcelFunctions = {
  IF: formulas.IF,
  AND: formulas.AND,
  MAX: formulas.MAX,
  MIN: formulas.MIN,
  WEEKDAY: formulas.WEEKDAY,
  COUNTIF: formulas.COUNTIF,
  SUMIF: formulas.SUMIF,
};

export function evaluateExpression(
  input: string,
  variables: Variables = {}
): number {
  const tokens = tokenize(input);
  console.log("tokens", tokens);
  const ast = new Parser(tokens).parse();
  console.log("ast", ast);
  const value = evaluate(ast, variables, excelFunctions);
  console.log("value", value);
  return value;
}
