import "./App.css";
import { test } from "./formula/test";
function App() {
  test();
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

export default App;
