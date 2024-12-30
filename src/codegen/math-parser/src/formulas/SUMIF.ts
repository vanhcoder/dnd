import { VariablesValue } from "../evaluate/evaluate";

// SUMIF(ab, "index", ">", 2, "value")

function SUMIF(
  range: Record<string, VariablesValue>[], //ab
  conditionByKey: string, // "index"
  condition: string, // ">"
  conditionValue: string, // 2
  sumByKey: string // "value"
): number {
  let sum = 0;

  // Lặp qua từng phần tử trong range
  for (const item of range) {
    // Kiểm tra nếu đối tượng có chứa key
    if (!Object.prototype.hasOwnProperty.call(item, conditionByKey)) {
      throw new Error(`SUMIF: Undefined condition Key: ${conditionByKey}`);
    }

    if (!Object.prototype.hasOwnProperty.call(item, sumByKey)) {
      throw new Error(`SUMIF: Undefined key: ${sumByKey}`);
    }

    // Lấy giá trị của phần tử tại key
    const valueOfConditionKey = item[conditionByKey];
    const valueMakeToSum = item[sumByKey];

    if (typeof valueOfConditionKey !== "number") {
      throw new Error(`SUMIF: Value is not a number: ${valueOfConditionKey}`);
    }

    if (typeof valueMakeToSum !== "number") {
      throw new Error(`SUMIF: Value is not number: ${valueMakeToSum}`);
    }

    const cdt = parseFloat(conditionValue);

    // Kiểm tra điều kiện dựa trên loại của condition
    let conditionMet = false;
    switch (condition) {
      case "=":
        conditionMet = valueOfConditionKey === cdt;
        break;
      case ">":
        conditionMet = valueOfConditionKey > cdt;
        break;
      case "<":
        conditionMet = valueOfConditionKey < cdt;
        break;
      case ">=":
        conditionMet = valueOfConditionKey >= cdt;
        break;
      case "<=":
        conditionMet = valueOfConditionKey <= cdt;
        break;
      case "!=":
        conditionMet = valueOfConditionKey <= cdt;
        break;
      default:
        throw new Error(`SUMIF: Unsupported condition: ${condition}`);
    }

    // Nếu điều kiện thỏa mãn, tăng biến đếm
    if (conditionMet) {
      sum += valueMakeToSum;
    }
  }

  return sum;
}

export default SUMIF;
