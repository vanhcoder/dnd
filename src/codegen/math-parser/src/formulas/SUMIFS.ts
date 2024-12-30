import { VariablesValue } from "../evaluate/evaluate";

export type SUMIFSFormula = (
  range: Record<string, VariablesValue>[], //ab
  sumByKey: string, // "value",,
  ...criteria: string[]
) => number;

/**
 * @function SUMIFS
 * @param range: mảng các object
 * @param sumByKey: trường cần sum
 * @param criteria: mảng các điều kiện
 * vd:
 * ab = [{index: 1, value: 2, cost:2 }, {index: 2, value: 3, , cost: 3}]
 * SUMIF(ab, "value", "index", ">", 2, "cost", "<", 3)
 *
 **/

const SUMIFS: SUMIFSFormula = (
  range: Record<string, VariablesValue>[], //ab
  sumByKey: string, // "value",,
  ...criteria: string[]
) => {
  if (!Array.isArray(range)) {
    throw new Error("range phải là một mảng các object");
  }

  if (criteria.length % 3 !== 0) {
    throw new Error(
      "Phải cung cấp các nhóm criteria_field, operator, và criteria_value."
    );
  }

  const criteriaFieldSet = new Set(
    criteria.filter((_, index) => index % 3 === 0) as string[]
  );

  for (const field of criteriaFieldSet) {
    if (!range.some((item) => field in item)) {
      throw new Error(`Trường '${field}' không tồn tại trong range.`);
    }
  }

  if (!range.some((item) => sumByKey in item)) {
    throw new Error(`SUMIFS: Trường '${sumByKey}' không tồn tại trong range.`);
  }

  let sum = 0;

  for (const item of range) {
    const valueToSum = item[sumByKey];

    if (typeof valueToSum !== "number") {
      throw new Error(
        `SUMIFS: Value to sum (${sumByKey}) is not a number: ${valueToSum}`
      );
    }

    let allConditionsMet = true;

    for (let i = 0; i < criteria.length; i += 3) {
      const conditionKey = criteria[i] as string;
      const operator = criteria[i + 1] as string;
      const conditionValue = criteria[i + 2];

      if (!Object.prototype.hasOwnProperty.call(item, conditionKey)) {
        throw new Error(`SUMIFS: Undefined condition key: ${conditionKey}`);
      }

      const itemValue = item[conditionKey];

      const conditionMet = evaluateCondition(
        itemValue,
        operator,
        conditionValue
      );

      if (!conditionMet) {
        allConditionsMet = false;
        break;
      }
    }

    // Nếu điều kiện thỏa mãn, tăng biến đếm
    if (allConditionsMet) {
      sum += valueToSum;
    }
  }

  return sum;
};

function evaluateCondition(
  itemValue: VariablesValue,
  operator: string,
  conditionValue: string | number
): boolean {
  const cdtValue =
    typeof conditionValue === "string" ? conditionValue : conditionValue;

  switch (operator) {
    case "==":
      return itemValue == cdtValue;
    case ">":
      return itemValue > cdtValue;
    case "<":
      return itemValue < cdtValue;
    case ">=":
      return itemValue >= cdtValue;
    case "<=":
      return itemValue <= cdtValue;
    case "!=":
      return itemValue !== cdtValue;
    default:
      throw new Error(`SUMIFS: Unsupported operator: ${operator}`);
  }
}

export default SUMIFS;
