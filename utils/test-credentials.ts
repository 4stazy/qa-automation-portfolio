export function getTestCredentials(): {
  email: string;
  password: string;
} {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    throw new Error("TEST_EMAIL or TEST_PASSWORD was not loaded from .env");
  }

  return { email, password };
}
