import { spawn } from "bun";

const logFile = Bun.file("dev.log");
const logWriter = logFile.writer();

// Clear the log file initially
await Bun.write(logFile, "");

const proc = Bun.spawn(["bun", "x", "next", "dev", "-p", "3000"], {
  stdout: "pipe",
  stderr: "pipe",
});

// Read stdout stream
(async () => {
  try {
    for await (const chunk of proc.stdout) {
      process.stdout.write(chunk);
      logWriter.write(chunk);
      logWriter.flush();
    }
  } catch (e) {
    console.error("Error reading stdout:", e);
  }
})();

// Read stderr stream
(async () => {
  try {
    for await (const chunk of proc.stderr) {
      process.stderr.write(chunk);
      logWriter.write(chunk);
      logWriter.flush();
    }
  } catch (e) {
    console.error("Error reading stderr:", e);
  }
})();

// Handle process exit
(async () => {
  const exitCode = await proc.exited;
  logWriter.end();
  process.exit(exitCode);
})();

// Clean termination signals
process.on("SIGINT", () => {
  proc.kill();
  logWriter.end();
  process.exit(0);
});

process.on("SIGTERM", () => {
  proc.kill();
  logWriter.end();
  process.exit(0);
});
