## Type Safety

Never use `any` type and avoid type casting. Always properly handle types.

### Rules:

- **Never use `any`**: Use `unknown` if the type is truly unknown, then narrow it down with type guards or validation
- **No type assertions (`as` keyword)**: Instead, use proper type narrowing, type guards, or validation to handle types correctly
- **No `@ts-ignore` or `@ts-expect-error`**: Fix the underlying type issues instead
- **Prefer type guards and validation**: Use runtime checks and validation (e.g., Zod schemas) to narrow types safely

### Examples:

```typescript
// ❌ Bad - using any
function process(data: any) { ... }

// ✅ Good - using unknown with validation
function process(data: unknown) {
  const validated = schema.parse(data);
  ...
}

// ❌ Bad - type casting
const value = data as string;

// ✅ Good - proper type narrowing
if (typeof data === 'string') {
  const value = data;
  ...
}
```
