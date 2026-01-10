import chalk from "chalk";

export const BANNER = chalk.cyan(`
             ===    ████████╗██╗  ██╗██╗   ██╗███╗   ██╗██████╗ ███████╗██████╗ 
           ====     ╚══██╔══╝██║  ██║██║   ██║████╗  ██║██╔══██╗██╔════╝██╔══██╗
         =====         ██║   ███████║██║   ██║██╔██╗ ██║██║  ██║█████╗  ██████╔╝
        =====          ██║   ██╔══██║██║   ██║██║╚██╗██║██║  ██║██╔══╝  ██╔══██╗
      =======          ██║   ██║  ██║╚██████╔╝██║ ╚████║██████╔╝███████╗██║  ██║
    ++++++++++++       ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝
        ++++++                                                                    
       *++++*                          █████╗  ██████╗ ██████ 
       ****                           ██╔══██╗██╔══██╗██╔══██╗
      ***                             ███████║██████╔╝██████╔╝
     **                               ██╔══██║██╔═══╝ ██╔═══╝ 
                                      ██║  ██║██║     ██║     
                                      ╚═╝  ╚═╝╚═╝     ╚═╝     
`);

export const DEFAULT_PROJECT_NAME = "thunder-app";

export const IGNORE_ALWAYS = new Set([
  "node_modules",
  ".git",
  ".DS_Store",
  "bin",
  "dist",
  "docs",
  ".vite",
  ".cache",
  "coverage",
  ".nyc_output",
  "bun.lock",
]);

export const SKIP_FILES = new Set([".env"]);

export const SKIP_EXTENSIONS = [".tsbuildinfo"] as const;
