export type ANDFormula = (...args: boolean[]) => boolean;

/**
 * Returns true if all arguments are true, false otherwise.
 * @param args
 * @returns
 */

const AND: ANDFormula = (...args: boolean[]) => {
  return args.every((i) => i);
};

export default AND;
