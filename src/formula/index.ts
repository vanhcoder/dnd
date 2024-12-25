export const excelFunctions = {
  SUM: (...args) => args.reduce((sum, val) => sum + val, 0),
  AVERAGE: (...args) => args.reduce((sum, val) => sum + val, 0) / args.length,
  IF: (condition, trueResult, falseResult) =>
    condition ? trueResult : falseResult,
  MAX: (args) => Math.max(...args.map((i) => i.value)),
  MIN: (args) => {
    return Math.min(...args.map((i) => i.value))
  },
  COUNTIF: (range, condition) => {
    return range.filter(item => {
      const { operator, value } = condition;
      switch (operator) {
        case '>':
          return item.value > value;
        case '<':
          return item.value < value;
        case '==':
          return item.value === value;
        case '!=':
          return item.value !== value;
        default:
          throw new Error(`Unknown operator: ${operator}`);
      }
    }).length;
  },
} as const;

type ExcelFunctions = typeof excelFunctions
interface FunctionCall {
  type: "FunctionCall";
  name: string;
  arguments: Expression[];
}


interface BinaryExpression {
  type: "BinaryExpression";
  name: string;
  operator: string
  left: any
  right : any
}

interface ConditionExpression {
  type: "Condition";
  operator: string
  value: any
}

interface Literal {
  type: "Literal";
  value: number;
}

interface Variable {
  type: "Variable";
  name: string;
}

type Expression = FunctionCall | Literal | Variable | BinaryExpression | ConditionExpression

export function evaluate(
  ast: Expression,
  variables: Record<string, number | number[]>,
  functions: ExcelFunctions
) {
  console.log("ast", ast);
  switch (ast.type) {
    case "FunctionCall": {
      const name = ast.name.toUpperCase()
      // Check if the function exists
      const func = functions[name];
      if (!func) throw new Error(`Unknown function: ${ast.name}`);
      // Evaluate all arguments
      const args = ast.arguments
        ? ast.arguments.map((arg) => evaluate(arg, variables, functions))
        : [];
      // Call the function with evaluated arguments
      return func(...args);
    }

    case "Condition": {
      return {
        operator: ast.operator,
        value: evaluate(ast.value , variables, functions)
      }
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
    case "Variable":
      if (variables.hasOwnProperty(ast.name)) {
        const variable = variables[ast.name]
        if(Array.isArray(variable)) return variable.map(i => ({
          type:'Literal',
          value: i
        }))
        return variable;
      }
      throw new Error(`Undefined variable: ${ast.name}`);

    case "Literal":
      return ast.value;

    default:
      console.log('Error', ast)
      throw new Error(`Unknown AST type: ${ast.type}`);
  }
}
