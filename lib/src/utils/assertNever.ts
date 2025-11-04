/**
 * Used for exhaustive checks. Meant to be used in a switch statement (or a chain of ifs) to ensure all cases are handled.
 * @param x - The value to assert never.
 * @throws An error if the value is not never.
 */
export const assertNever = (x: never): never => {
  throw new Error(`Unexpected value: ${JSON.stringify(x)}`);
};
