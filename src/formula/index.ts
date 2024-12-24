
export const excelFunctions = {
    SUM: (...args) => args.reduce((sum, val) => sum + val, 0),
    AVERAGE: (...args) => args.reduce((sum, val) => sum + val, 0) / args.length,
    IF: (condition, trueResult, falseResult) => (condition ? trueResult : falseResult),
    MAX: (...args) => Math.max(...args),
    MIN: (...args) => Math.min(...args),
  };

export function evaluate(ast, variables, functions = {}) {
  console.log('ast', ast)
    switch (ast.type) {
      case "FunctionCall":
        // Check if the function exists
        const func = functions[ast.name.toUpperCase()];
        if (!func) throw new Error(`Unknown function: ${ast.name}`);
        // Evaluate all arguments
        const args = ast.arguments.map(arg => evaluate(arg, variables, functions));
        // Call the function with evaluated arguments
        return func(...args);
  
      case "BinaryExpression":
        const left = evaluate(ast.left, variables, functions);
        const right = evaluate(ast.right, variables, functions);
        console.log('ast.operator', ast.operator)
        switch (ast.operator) {
          case "+": return left + right;
          case "-": return left - right;
          case "*": return left * right;
          case "/": return left / right;
          default: throw new Error(`Unknown operator: ${ast.operator}`);
        }
  
      case "Variable":
        if (variables.hasOwnProperty(ast.name)) {
          return variables[ast.name];
        }
        throw new Error(`Undefined variable: ${ast.name}`);
  
      case "Literal":
        return ast.value;
  
      default:
        throw new Error(`Unknown AST type: ${ast.type}`);
    }
  }
  