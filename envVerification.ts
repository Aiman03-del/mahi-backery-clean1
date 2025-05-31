const REQUIRED_ENV_VARS = [
  'DB_HOST',
  'DB_USER',
  'DB_PASS',
  // Add other required env vars here
];

export function verifyEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
