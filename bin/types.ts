export interface ProjectConfig {
  name: string;
  targetDir: string;
  includeGithub: boolean;
  includeCursorRules: boolean;
  // Future options:
  // includeAuth: boolean;
  // router: "tanstack" | "react-router" | "none";
  // database: "sqlite" | "postgres" | "mysql";
}

export interface PackageJson {
  name?: string;
  private?: boolean;
  postinstall?: string;
  bin?: Record<string, string>;
  files?: string[];
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}
