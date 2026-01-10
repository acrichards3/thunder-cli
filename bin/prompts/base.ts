import { createInterface, type Interface } from "readline";

let rl: Interface | null = null;

export const getReadline = (): Interface => {
  if (!rl) {
    rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }
  return rl;
};

export const closeReadline = (): void => {
  if (rl) {
    rl.close();
    rl = null;
  }
};

export const prompt = (message: string): Promise<string> => {
  return new Promise((resolve) => {
    getReadline().question(message, (answer) => resolve(answer));
  });
};
