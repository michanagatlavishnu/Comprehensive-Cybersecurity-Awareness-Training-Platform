// MongoDB seed entrypoint. Add idempotent seed operations here as domain models are implemented.
const databaseName = process.env.MONGODB_DATABASE || "cyberaware";

print(`CyberAware seed target: ${databaseName}`);
