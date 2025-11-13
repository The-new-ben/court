import pino from "pino";

const logger = pino({ name: "ai-catalog-worker" });

export async function main() {
  logger.info("Worker bootstrapped");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    logger.error({ error }, "Worker exited with error");
    process.exitCode = 1;
  });
}
