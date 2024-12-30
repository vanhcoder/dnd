import { VariablesValue } from "../evaluate/evaluate";

export type COUNTIFFormula = (
  range: Record<string, VariablesValue>[],
  conditionByKey: string,
  operator: string,
  value: string
) => number;

/**
 *
 * @function COUNTIF
 * @param range: mảng các object
 * @param conditionByKey: trường cần so sánh
 * @param operator: toán tử so sánh
 * @param value: giá trị so sánh
 * @returns số lượng phần tử th
 * */

const COUNTIF: COUNTIFFormula = (range, conditionByKey, operator, value) => {
  let count = 0;

  for (const item of range) {
    if (!Object.prototype.hasOwnProperty.call(item, conditionByKey)) {
      throw new Error(`COUNTIF: Undefined key: ${conditionByKey}`);
    }

    const itemValue = item[conditionByKey];

    const formattedValue = parseFloat(value);
    if (typeof itemValue !== "number") {
      throw new Error(`COUNTIF: Value is not a string or number: ${itemValue}`);
    }

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

    if (conditionMet) {
      count++;
    }
  }

  return count;
};

export default COUNTIF;
