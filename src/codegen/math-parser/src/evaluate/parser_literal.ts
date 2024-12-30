import { LiteralExpression } from "../ast/parser";

export function parserLiteral(ast: LiteralExpression) {
  if (ast.literalType === "number") return parseFloat(ast.value);
  return ast.raw;
}
