import "./App.css";
import { evaluateExpression } from "./codegen/math-parser/src";
function App() {
  const input = `(a + b) * 10`;
  evaluateExpression(input, { b: 2, a: 10 });
  // test();
  return (
    //   <WorkFlowContainer>
    //     <Connector fromId="box1" toId="box2" isConnected={false} />
    //     {["box1", "box2", "box3"].map((id) => (
    //       <DraggableWrapper key={id} id={id}>
    //         <div
    //           id={id}
    //           style={{ width: 100, height: 100, backgroundColor: "red" }}
    //         >
    //           {id} (Click to bring to front)
    //         </div>
    //       </DraggableWrapper>
    //     ))}
    //   </WorkFlowContainer>
    // <Tree />
    <h1>Formula</h1>
  );
}

//12 * (-8) + 0.2
export default App;
