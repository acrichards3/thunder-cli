import type { EnvIssue } from "../env/env";

export function EnvError({ issues }: { issues: EnvIssue[] }) {
  return (
    <div
      style={{
        background: "#1a1a1a",
        color: "#e5e5e5",
        display: "flex",
        flexDirection: "column",
        fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace",
        fontSize: "14px",
        gap: "16px",
        minHeight: "100vh",
        padding: "48px",
      }}
    >
      <h1 style={{ color: "#ff6b6b", fontSize: "20px", fontWeight: 700, margin: 0 }}>Invalid Environment Variables</h1>
      <p style={{ color: "#a3a3a3", margin: 0 }}>
        The following environment variables are missing or invalid. Check your <code>frontend/.env</code> file.
      </p>
      <ul style={{ display: "flex", flexDirection: "column", gap: "8px", listStyle: "none", margin: 0, padding: 0 }}>
        {issues.map((issue, i) => (
          <li key={i} style={{ display: "flex", gap: "8px" }}>
            <span style={{ color: "#ff6b6b" }}>{issue.path}</span>
            <span style={{ color: "#737373" }}>—</span>
            <span style={{ color: "#a3a3a3" }}>{issue.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
