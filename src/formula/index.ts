export const excelFunctions = {
  SUM: (...args) => args.reduce((sum, val) => sum + val, 0),
  AVERAGE: (...args) => args.reduce((sum, val) => sum + val, 0) / args.length,
  IF: (condition, trueResult, falseResult) =>
    condition ? trueResult : falseResult,
  MAX: (args) => Math.max(...args.map((i) => i.value)),
  MIN: (args) => {
    return Math.min(...args.map((i) => i.value));
  },
  COUNTIF: (range, key, condition) => {
    return range.filter((item) => {
      if (!Object.prototype.hasOwnProperty.call(item, key)) {
        throw new Error(`COUNTIF: Undefined key: ${key}`);
      }
      const { operator, value } = condition;
      switch (operator) {
        case ">":
          return item[key] > value;
        case "<":
          return item[key] < value;
        case "==":
          return item[key] === value;
        case "!=":
          return item[key] !== value;
        default:
          throw new Error(`Unknown operator: ${operator}`);
      }
    }).length;
  },
} as const;

type ExcelFunctions = typeof excelFunctions;
interface FunctionCall {
  type: "FunctionCall";
  name: string;
  arguments: Expression[];
}

interface BinaryExpression {
  type: "BinaryExpression";
  name: string;
  operator: string;
  left: any;
  right: any;
}

interface ConditionExpression {
  type: "Condition";
  operator: string;
  value: any;
}

interface Literal {
  type: "Literal";
  value: number;
}

interface Variable {
  type: "Variable";
  name: string;
}

type Expression =
  | FunctionCall
  | Literal
  | Variable
  | BinaryExpression
  | ConditionExpression;

export function evaluate(
  ast: Expression,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables: Record<string, any>,
  functions: ExcelFunctions
) {
  switch (ast.type) {
    case "FunctionCall": {
      const name = ast.name.toUpperCase();
      // Check if the function exists
      const func = functions[name];
      if (!func) throw new Error(`Unknown function: ${ast.name}`);
      // Evaluate all arguments
      console.log("ast.arguments", ast.arguments);
      const args = ast.arguments
        ? ast.arguments.map((arg) => evaluate(arg, variables, functions))
        : [];
      // Call the function with evaluated arguments
      return func(...args);
    }

    case "Condition": {
      return {
        operator: ast.operator,
        value: evaluate(ast.value, variables, functions),
      };
    }

    case "BinaryExpression": {
      const left = evaluate(ast.left, variables, functions);
      const right = evaluate(ast.right, variables, functions);
      console.log("ast.operator", ast.operator);
      switch (ast.operator) {
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        case "/":
          return left / right;
        case ">":
          return left > right;
        default:
          throw new Error(`Unknown operator: ${ast.operator}`);
      }
    }
    case "Variable": {
      if (Object.prototype.hasOwnProperty.call(variables, ast.name)) {
        const variable = variables[ast.name];
        return variable;
      }
      throw new Error(`Undefined variable: ${ast.name}`);
    }
    case "Literal":
      return ast.value;

    case "KEY":
      return ast.name;

    default:
      console.log("Error", ast);
      throw new Error(`Unknown AST type: ${ast.type}`);
  }
}
