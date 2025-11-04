/**
 * Throws an error with the given message. Can be used cleanly with possibly undefined values.
 * @example
 * ```typescript
 * const data: await apiFetch("/api/users");
 * const name = data?.name ?? raise("Name is required"); // Throw if data is undefined
 * ```
 * @param x
 */
export const raise = (x: unknown): never => {
  throw new Error(String(x));
};
