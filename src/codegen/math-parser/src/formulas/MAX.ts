import { VariablesValue } from "../evaluate/evaluate";

export type MAXFormula = (
  list: Record<string, VariablesValue>[],
  key: string
) => number;

/**
 * @function MAX
 * @param list mảng các object
 * @param key trường cần so sánh
 * @returns giá trị lớn nhất
 */

const MAX: MAXFormula = (list, key) => {
  return Math.max(
    ...list.map((i) => {
      if (!Object.prototype.hasOwnProperty.call(i, key)) {
        throw new Error(`MAX: Undefined key: ${key}`);
      }
      if (typeof i[key] !== "number") {
        throw new Error(`MAX: Value is not a number: ${i[key]}`);
      }
      return i[key] as number;
    })
  );
};

export default MAX;
