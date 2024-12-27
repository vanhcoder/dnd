import { VariablesValue } from "../evaluate/evaluate";

// COUNTIF(ab, ">", 2, "value")

function COUNTIF(
  range: Record<string, VariablesValue>[], //ab
  conditionByKey: string, // value
  operator: string, // ">"
  value: string // 2
): number {
  let count = 0;

  // Lặp qua từng phần tử trong range
  for (const item of range) {
    // Kiểm tra nếu đối tượng có chứa key
    if (!Object.prototype.hasOwnProperty.call(item, conditionByKey)) {
      throw new Error(`COUNTIF: Undefined key: ${conditionByKey}`);
    }

    // Lấy giá trị của phần tử tại key
    const itemValue = item[conditionByKey];

    const formattedValue = parseFloat(value);
    if (typeof itemValue !== "number") {
      throw new Error(`COUNTIF: Value is not a string or number: ${itemValue}`);
    }

    // Kiểm tra điều kiện dựa trên loại của condition
    let conditionMet = false;
    switch (operator) {
      case "=":
        conditionMet = itemValue === formattedValue;
        break;
      case ">":
        conditionMet = itemValue > formattedValue;
        break;
      case "<":
        conditionMet = itemValue < formattedValue;
        break;
      case ">=":
        conditionMet = itemValue >= formattedValue;
        break;
      case "<=":
        conditionMet = itemValue <= formattedValue;
        break;
      case "!=":
        conditionMet = itemValue <= formattedValue;
        break;
      default:
        throw new Error(`COUNTIF: Unsupported operator: ${operator}`);
    }

    // Nếu điều kiện thỏa mãn, tăng biến đếm
    if (conditionMet) {
      count++;
    }
  }

  return count;
}

export default COUNTIF;
