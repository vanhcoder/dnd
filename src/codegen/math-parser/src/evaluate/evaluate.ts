import {
  ASTNode,
  ASTNodeType,
  BinaryExpression,
  CallExpression,
  LiteralExpression,
  VariableExpression,
} from "../parser";
import { parserBinaryExpression } from "./parser_binary_expression";
import { parserCallExpression } from "./parser_call_expression";
import { parserLiteral } from "./parser_literal";
import { parserVariable } from "./parser_variable";

export type ExcelFunctions = {
  IF: (condition: boolean, a: ASTNode, b: ASTNode) => ASTNode;
  AND: (...args: boolean[]) => boolean;
  MAX: (list: Record<string, VariablesValue>[], key: string) => number;
  MIN: (list: Record<string, VariablesValue>[], key: string) => number;
  WEEKDAY: (dateStr: string, returnType: number) => number;
  COUNTIF: (
    range: Record<string, VariablesValue>[],
    condition: string,
    value: string,
    key: string
  ) => number;
  SUMIF: (
    range: Record<string, VariablesValue>[],
    condition: string,
    conditionValue: string,
    key: string,
    value: string
  ) => number;
};

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
      return evaluate(ast.body[0], variables, functions);
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
