import { useRef, useState } from "react";
import "./styles.css";
import ParserToHtml from "../../codegen/math-parser/src/tag_html";
import { tokenizeEditor } from "../../codegen/math-parser/src/tag_html/lexer_editor";
import { evaluateExpression } from "../../codegen/math-parser/src";
import {
  getCursorPosition,
  handlePopup,
  parseValues,
  setCursorPosition,
} from "./utils/utils";
import PopUpS from "./PopupSuggetion";
import { Controller, useForm } from "react-hook-form";

function TextEditor() {
  const editableDivRef = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState<string>("");
  const [errors, setErrors] = useState<string>("");
  const [popup, setPopup] = useState({ visible: false, x: 0, y: 0 });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [variableInput, setVariableInput] = useState<string[]>([]);
  const { control, handleSubmit } = useForm();
  function onTextInput(event: React.FormEvent<HTMLDivElement>) {
    const editableDiv = event.target as HTMLDivElement;
    if (!editableDiv) return;
    const sel = window.getSelection();
    const node = sel?.focusNode;
    const offset = sel?.focusOffset;
    console.log("offset", offset);
    const range2 = sel?.getRangeAt(0); // Lấy range (vị trí con trỏ)
    // Tính toán vị trí con trỏ
    const rect = range2?.getBoundingClientRect();

    const pos = getCursorPosition(editableDivRef.current, node, offset, {
      pos: 0,
      done: false,
    });

    const input = editableDiv.textContent || "";
    const tokens = tokenizeEditor(input);
    const htmlContent = new ParserToHtml(tokens).parse();
    editableDiv.innerHTML = htmlContent;

    sel?.removeAllRanges();
    const range = setCursorPosition(
      editableDivRef.current,
      document.createRange(),
      {
        pos: pos.pos,
        done: false,
      }
    );
    range?.collapse(true);
    sel?.addRange(range);
    handlePopup(input, setSuggestions, setPopup, rect);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    // Ngăn chặn Enter để không xuống dòng
    if (event.key === "Enter") {
      event.preventDefault();
    }
  }

  function test() {
    try {
      const input = editableDivRef.current?.innerText;
      if (input) {
        const { variable } = evaluateExpression(input, {});
        console.log("variable", variable);
        setVariableInput(variable);
      }
    } catch (error) {
      setErrors(JSON.stringify(error));
    }
  }

  function calculator() {
    handleSubmit((variable) => {
      try {
        const input = editableDivRef.current?.innerText || "";
        const formatOject = parseValues(variable);
        const { evaluate } = evaluateExpression(input, formatOject);
        const value = evaluate();
        setValue(value.toString());
      } catch (error) {
        setErrors(JSON.stringify(error));
      }
    })();
  }

  function insertElementAtCursor() {
    const newElement = document.createElement("span");
    newElement.textContent = "Đây là phần tử mới!";
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0); // Lấy range tại vị trí con trỏ
    range?.deleteContents(); // Xóa nội dung đã chọn (nếu có)
    range?.insertNode(newElement); // Chèn phần tử vào vị trí con trỏ
  }
  return (
    <div style={{ display: "flex", height: "80vh", gap: 2 }}>
      <div style={{ width: "50%", border: "1px solid black", padding: 10 }}>
        <div style={{ display: "flex", gap: 5 }}>
          <button
            onClick={test}
            type="button"
            style={{ border: "1px solid back" }}
            className="btn"
          >
            Test
          </button>
          <button
            type="button"
            onClick={calculator}
            className="btn"
            style={{ border: "1px solid back" }}
          >
            Calculator
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            flexWrap: "nowrap",
          }}
        >
          {variableInput.map((i) => (
            <div key={i} style={{ display: "flex" }}>
              <div style={{ width: "100px" }}>{i}</div>
              <Controller
                name={`${i}.value`}
                control={control}
                render={({ field }) => (
                  <textarea
                    value={field.value}
                    name={field.name}
                    onChange={field.onChange}
                    style={{ border: "1px solid black", padding: "5px" }}
                  />
                )}
              />
              <Controller
                name={`${i}.type`}
                control={control}
                defaultValue={"Number"}
                render={({ field }) => (
                  <select
                    name="selected"
                    id="selected"
                    value={field.value}
                    onChange={field.onChange}
                    defaultValue={"Number"}
                  >
                    <option value="Number">Number</option>
                    <option value="String">String</option>
                    <option value="Object">Object</option>
                    <option value="ArrayObject">ArrayObject</option>
                  </select>
                )}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          width: "50%",
          height: 300,
        }}
      >
        <div
          style={{
            width: "100%",
            height: 300,
            position: "relative",
            padding: 10,
            border: "1px solid gray",
            borderRadius: "5px",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          }}
        >
          <div
            contentEditable
            ref={editableDivRef}
            className={"textInput"}
            onInput={onTextInput}
            onKeyDown={onKeyDown}
          ></div>
          {
            <PopUpS
              popup={popup}
              suggestions={suggestions}
              insertSuggestion={() => {
                insertElementAtCursor();
              }}
            />
          }
        </div>
        <p style={{ color: "green" }}>Result: {value}</p>
        <p style={{ color: "red" }}>Error: {errors}</p>
      </div>
    </div>
  );
}

export default TextEditor;
