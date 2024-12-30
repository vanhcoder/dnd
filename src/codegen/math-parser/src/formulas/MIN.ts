import { VariablesValue } from "../evaluate/evaluate";

export type MINFormula = (
  list: Record<string, VariablesValue>[],
  key: string
) => number;

/**
 *
 * @param list mảng các object
 * @param key trường cần so sánh
 * @returns giá trị nhỏ nhất
 */
const MIN: MINFormula = (list, key) => {
  return Math.min(
    ...list.map((i) => {
      if (!Object.prototype.hasOwnProperty.call(i, key)) {
        throw new Error(`MIN: Undefined key: ${key}`);
      }
      if (typeof i[key] !== "number") {
        throw new Error(`MIN: Value is not a number: ${i[key]}`);
      }
      return i[key] as number;
    })
  );
};

export default MIN;
