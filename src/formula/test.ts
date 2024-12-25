import { evaluate, excelFunctions } from ".";
import { parse } from "../formula/lib/parser";

const formula =
  "e + IF(c > b , a + b , IF(c > d, COUNTIF(ab, 'name', '> 2'), b))";
const variables = {
  e: 10,
  ab: [
    { id: 1, name: 1 },
    { id: 1, name: 2 },
    { id: 1, name: 3 },
    { id: 1, name: 4 },
    { id: 1, name: 5 },
    { id: 1, name: 6 },
  ],
  b: 2,
  a: 2,
  c: 1,
  d: 0,
};

export function test() {
  try {
    // Parse the formula into AST
    const ast = parse(formula, {});
    console.log("ast", ast);
    // Evaluate the AST with variables and functions
    const result = evaluate(ast, variables, excelFunctions);

    console.log("Result:", result); // Kết quả: 8 (vì SUM(a, b) = 12 > 10 nên chọn MAX(c, d))
  } catch (err) {
    console.error("Error:", err.message);
  }
}
