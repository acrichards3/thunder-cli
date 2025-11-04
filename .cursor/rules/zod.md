## Zod Version

We are using Zod v4. Do NOT use deprecated Zod v3 syntax.

### Common deprecated patterns to avoid:

- `z.string().url()` → Use `z.url()` instead
- `z.string().email()` → Use `z.email()` instead
- `z.string().uuid()` → Use `z.uuid()` instead

In Zod v4, validators like `url()`, `email()`, and `uuid()` are top-level functions, not methods on `z.string()`.
