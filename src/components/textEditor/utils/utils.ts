export function getCursorPosition(
  parent: HTMLDivElement | null,
  node: Node | null,
  offset: number,
  stat: {
    pos: number;
    done: boolean;
  }
) {
  if (!parent) return;
  if (stat.done) return stat;

  let currentNode = null;
  if (parent.childNodes.length == 0) {
    stat.pos += parent.textContent.length;
  } else {
    for (let i = 0; i < parent.childNodes.length && !stat.done; i++) {
      currentNode = parent.childNodes[i];
      if (currentNode === node) {
        stat.pos += offset;
        stat.done = true;
        return stat;
      } else getCursorPosition(currentNode, node, offset, stat);
    }
  }
  return stat;
}

//find the child node and relative position and set it on range
export function setCursorPosition(
  parent: HTMLDivElement | null,
  range: Range,
  stat: {
    pos: number;
    done: boolean;
  }
) {
  if (!parent) return;
  if (stat.done) return range;
  let currentNode = null;
  if (parent.childNodes.length == 0) {
    if (parent.textContent.length >= stat.pos) {
      range.setStart(parent, stat.pos);
      stat.done = true;
    } else {
      stat.pos = stat.pos - parent.textContent.length;
    }
  } else {
    for (let i = 0; i < parent.childNodes.length && !stat.done; i++) {
      currentNode = parent.childNodes[i];
      setCursorPosition(currentNode, range, stat);
    }
  }
  return range;
}

export function handlePopup(
  input: string,
  setSuggestions: (suggestions: string[]) => void,
  setPopup: (suggestions: { visible: boolean; x: number; y: number }) => void,
  pos: DOMRect 
) {
  const currentWord = input.split(/\s+/).pop() || "";
  if (currentWord.length > 0) {
    const filteredSuggestions = ['SUMIF', 'MAX', 'MIN', 'COUNT', 'COUNTIF'].filter((s) =>
      s.toLowerCase().startsWith(currentWord.toLowerCase())
    );
    if (filteredSuggestions.length > 0) {
      setSuggestions(filteredSuggestions);
      setPopup({
        visible: true,
        x: pos.left, // Lệch sang phải 20px
        y: pos.top + 20, // Ngay bên dưới con trỏ, tính cả scroll
      });
    } else {
      setPopup({ visible: false, x: 0, y: 0 });
    }
  } else {
    setPopup({ visible: false, x: 0, y: 0 });
  }
}

type ValueType = "String" | "Number" | "ArrayObject";

type ObjectValue = {
  value: string;  // Giá trị được lưu dưới dạng string
  type: ValueType;  // Kiểu dữ liệu
};


export function parseValues(input: Record<string, ObjectValue>) {
  const parsedResult: Record<string, any> = {};  // Đối tượng để lưu kết quả đã chuyển đổi

  for (const key in input) {
    const { value, type } = input[key];

    // Dựa vào type để chuyển đổi giá trị
    switch (type) {
      case "String":
        parsedResult[key] = String(value);  // Chuyển sang kiểu String
        break;
      case "Number":
        parsedResult[key] = Number(value);  // Chuyển sang kiểu Number
        break;
      case "ArrayObject":
        parsedResult[key] = JSON.parse(value); 
        break;
      default:
        parsedResult[key] = value;  // Nếu không nhận diện được type, giữ nguyên giá trị
        break;
    }
  }

  return parsedResult;
}
