import { ASTNode, ASTNodeType } from "./parser";

export type ExcelFunctions = {
  SUMIF: () => void;
};

export function evaluate(
  ast: ASTNode,
  variables: Record<string, any>,
  functions: ExcelFunctions
): number {
  switch (ast.type) {
    case ASTNodeType.Program: {
      return evaluate(ast.body[0], variables, functions);
    }
    case ASTNodeType.Variable: {
      if (variables.hasOwnProperty(ast.name)) return variables[ast.name];
      throw Error(`Variable ${ast.name} : undfined`);
    }
    case ASTNodeType.Literal: {
      if (ast.literalType === "number") return parseFloat(ast.value);
      return ast.raw;
    }
    case ASTNodeType.CallExpression: {
      const args = ast.arguments.map((arg) =>
        evaluate(arg, variables, functions)
      );
      return functions[ast.name](...args);
    }
    case ASTNodeType.BinaryExpression: {
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
        default:
          throw new Error(`Unknown operator: ${ast.operator}`);
      }
    }
    default:
      throw new Error(`Unknown AST node type: ${ast.type}`);
  }
}
