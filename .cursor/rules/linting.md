## Linting and Build Checks

Always check linting after making changes. Build and lint pipelines must always pass.

### Rules:

- **Check linting after changes**: Run `bun run lint` or equivalent linting commands after making code changes
- **Fix linting errors**: Never commit code with linting errors - fix them before completing changes
- **Ensure builds pass**: Run `bun run build` or equivalent build commands to verify the code compiles
- **Type checking**: Ensure TypeScript type checking passes with `bun run typecheck` or equivalent

### Pipeline Requirements:

- All linting pipelines must pass
- All build pipelines must pass
- All type checking must pass
- Never commit code that would break CI/CD pipelines

If you make changes, always verify that:

1. The code builds successfully
2. Linting passes without errors
3. Type checking passes without errors
