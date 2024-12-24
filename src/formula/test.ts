import { evaluate, excelFunctions } from ".";
import { parse } from "../formula/lib/parser";

const formula = "IF(ab > 0 , b , c)";
const variables = { ab: 1, b: 2, c: 3, x: 4, y: 5 };

export function test() {
  try {
    // Parse the formula into AST
    const ast = parse(formula , {});

    console.log('ast', ast)
    // Evaluate the AST with variables and functions
    const result = evaluate(ast, variables, excelFunctions);

    console.log("Result:", result); // Kết quả: 8 (vì SUM(a, b) = 12 > 10 nên chọn MAX(c, d))
  } catch (err) {
    console.error("Error:", err.message);
  }
}
