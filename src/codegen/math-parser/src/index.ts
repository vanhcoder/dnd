import { tokenize } from "./ast/lexer";
import { ASTNode, ASTNodeType, Parser } from "./ast/parser";
import { evaluate, Variables } from "./evaluate/evaluate";
import formulas from "./formulas";

export function getVariable(ast: ASTNode) {
  switch (ast.type) {
    case ASTNodeType.Program: {
      return getVariable(ast.body[0]);
    }
    case ASTNodeType.Variable: {
      return ast.name ? [ast.name] : [];
    }
    case ASTNodeType.CallExpression: {
      const args = ast.arguments.map((arg) => getVariable(arg));
      return [...args.flat()];
    }
    case ASTNodeType.BinaryExpression: {
      const left = getVariable(ast.left);
      const right = getVariable(ast.right);
      return [...left, ...right];
    }
    default:
      return [];
  }
}

export function evaluateExpression(input: string, variables: Variables = {}) {
  const tokens = tokenize(input);
  console.log("tokens", tokens);
  const ast = new Parser(tokens).parse();
  console.log("ast", ast);
  const variable = getVariable(ast);
  return {
    evaluate: () => evaluate(ast, variables, formulas),
    ast,
    variable: [...new Set(variable)],
  };
}
