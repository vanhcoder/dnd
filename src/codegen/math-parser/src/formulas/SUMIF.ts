import { VariablesValue } from "../evaluate/evaluate";

export type SUMIFFormula = (
  range: Record<string, VariablesValue>[],
  sumByKey: string,
  conditionByKey: string,
  condition: string,
  conditionValue: string
) => number;

/**
 *
 * @function SUMIF
 * @param range: mảng các object
 * @param sumByKey: trường cần sum
 * @param conditionByKey: trường cần so sánh
 * @param condition: điều kiện so sánh
 * @param conditionValue: giá trị so sánh
 * vd:
 * ab = [{index: 1, value: 2, cost:2 }, {index: 2, value: 3, , cost: 3}]
 * SUMIF(ab, "cost", "index", ">", 2)
 *
 **/

const SUMIF: SUMIFFormula = (
  range,
  sumByKey,
  conditionByKey,
  condition,
  conditionValue
) => {
  let sum = 0;

  for (const item of range) {
    if (!Object.prototype.hasOwnProperty.call(item, conditionByKey)) {
      throw new Error(`SUMIF: Undefined condition Key: ${conditionByKey}`);
    }

    if (!Object.prototype.hasOwnProperty.call(item, sumByKey)) {
      throw new Error(`SUMIF: Undefined key: ${sumByKey}`);
    }

    const valueOfConditionKey = item[conditionByKey];
    const valueMakeToSum = item[sumByKey];

    if (typeof valueOfConditionKey !== "number") {
      throw new Error(`SUMIF: Value is not a number: ${valueOfConditionKey}`);
    }

    if (typeof valueMakeToSum !== "number") {
      throw new Error(`SUMIF: Value is not number: ${valueMakeToSum}`);
    }

    const cdt = parseFloat(conditionValue);

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

    if (conditionMet) {
      sum += valueMakeToSum;
    }
  }

  return sum;
};

export default SUMIF;
