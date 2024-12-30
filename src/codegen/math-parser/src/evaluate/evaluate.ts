import { ExcelFunctions } from "../formulas";
import {
  ASTNode,
  ASTNodeType,
  BinaryExpression,
  CallExpression,
  LiteralExpression,
  Program,
  VariableExpression,
} from "../ast/parser";
import { parserBinaryExpression } from "./parser_binary_expression";
import { parserCallExpression } from "./parser_call_expression";
import { parserLiteral } from "./parser_literal";
import { parserVariable } from "./parser_variable";

export type VariablesValue =
  | string
  | number
  | string[]
  | Record<string, VariablesValue>[];

export type Variables = Record<string, VariablesValue>;

export type Evaluate = (
  ast: ASTNode,
  variables: Variables,
  functions: ExcelFunctions
) => any;

export const evaluate: Evaluate = (
  ast: ASTNode,
  variables: Variables,
  functions: ExcelFunctions
) => {
  switch (ast.type) {
    case ASTNodeType.Program: {
      return evaluate((ast as Program).body[0], variables, functions);
    }
    case ASTNodeType.Variable: {
      return parserVariable(ast as VariableExpression, variables);
    }
    case ASTNodeType.Literal: {
      return parserLiteral(ast as LiteralExpression);
    }
    case ASTNodeType.CallExpression: {
      return parserCallExpression(
        ast as CallExpression,
        variables,
        functions,
        evaluate
      );
    }
    case ASTNodeType.BinaryExpression: {
      return parserBinaryExpression(
        ast as BinaryExpression,
        variables,
        functions,
        evaluate
      );
    }
    default:
      throw new Error(`Unknown AST node type: ${ast.type}`);
  }
};
