import { VariablesValue } from "../evaluate/evaluate";

function MAX(list: Record<string, VariablesValue>[], key: string): number {
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
}

export default MAX;
