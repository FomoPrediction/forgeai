type Level = "debug" | "info" | "warn" | "error";

const RANK: Record<Level, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function stamp(): string {
  return new Date().toISOString();
}

export class Logger {
  constructor(
    private readonly scope: string,
    private readonly min: Level = "debug",
  ) {}

  child(scope: string): Logger {
    return new Logger(`${this.scope}:${scope}`, this.min);
  }

  debug(msg: string, data?: unknown): void {
    this.write("debug", msg, data);
  }

  info(msg: string, data?: unknown): void {
    this.write("info", msg, data);
  }

  warn(msg: string, data?: unknown): void {
    this.write("warn", msg, data);
  }

  error(msg: string, data?: unknown): void {
    this.write("error", msg, data);
  }

  private write(level: Level, msg: string, data?: unknown): void {
    if (RANK[level] < RANK[this.min]) return;
    const line = `[${stamp()}] [${level.toUpperCase()}] [${this.scope}] ${msg}`;
    if (data === undefined) {
      console[level === "debug" ? "log" : level](line);
      return;
    }
    console[level === "debug" ? "log" : level](line, data);
  }
}

/* Verbose in development, quiet in production. */
const DEFAULT_LEVEL: Level = process.env.NODE_ENV === "production" ? "warn" : "debug";

export const log = new Logger("forge", DEFAULT_LEVEL);
