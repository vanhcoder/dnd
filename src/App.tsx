import "./App.css";
import { evaluateExpression } from "./codegen/math-parser/src";
function App() {
  const input = `(2 + IF(b > a, SUMIF(ab, "index", ">", 2 , "value"), b)) * MAX(ab, "value")`;
  const variables = {
    ab: [
      {
        name: "10",
        value: 20,
        index: 1,
      },
      {
        name: "10",
        value: 100,
        index: 2,
      },
      {
        name: "10",
        value: 100,
        index: 3,
      },
      {
        name: "10",
        value: 100,
        index: 4,
      },
    ],
    a: 10,
    b: 20,
    c: 30,
  };
  const value = evaluateExpression(input, variables);
  return (
    <div>
      <div>
        <h1>Formula</h1>
        <p style={{ fontSize: 20 }}>={input}</p>
        <p style={{ color: "green" }}>Result: {value}</p>
        <span style={{ width: "400px", lineBreak: "anywhere", color: "green" }}>
          Variables: {JSON.stringify(variables)}
        </span>
      </div>
      {/* <TextEditor /> */}
    </div>
  );
}

export default App;
