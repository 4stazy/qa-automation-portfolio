import { test, expect } from "@playwright/test";
import { AuthApiClient } from "../../../clients/auth-api.client";
import { expectApiErrorResponse } from "../../../utils/api-assertions";

function getTestCredentials(): {
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
type UserProfile = {
  id: string;
  name: string;
  email: string;
};
async function loginAndGetToken(
  authClient: AuthApiClient,
  email: string,
  password: string,
): Promise<string> {
  const loginResponse = await authClient.login(email, password);

  expect(loginResponse.status()).toBe(200);
  const loginResponseBody = await loginResponse.json();
  expect(loginResponseBody.data.token).toBeDefined();
  expect(typeof loginResponseBody.data.token).toBe("string");

  return loginResponseBody.data.token;
}

test.describe("Notes API - Authentication", () => {
  test("POST /users/login returns token for valid credentials", async ({
    request,
  }) => {
    const { email, password } = getTestCredentials();
    const authClient = new AuthApiClient(request);
    const loginResponse = await authClient.login(email, password);

    expect(loginResponse.status()).toBe(200);
    expect(loginResponse.headers()["content-type"]).toContain(
      "application/json",
    );

    const loginResponseBody = await loginResponse.json();

    expect(loginResponseBody.success).toBe(true);
    expect(loginResponseBody.data).toBeDefined();
    expect(loginResponseBody.data.token).toBeDefined();
    expect(typeof loginResponseBody.data.token).toBe("string");
    expect(loginResponseBody.data.token.length).toBeGreaterThan(0);
    expect(loginResponseBody.data.password).toBeUndefined();
    expect(loginResponseBody.data.email).toBe(email);
  });
  test("POST /users/login rejects an invalid password", async ({ request }) => {
    const { email, password } = getTestCredentials();
    const wrongPassword = `${password}-wrong`;
    const authClient = new AuthApiClient(request);
    const loginResponse = await authClient.login(email, wrongPassword);
    const loginResponseBody = await expectApiErrorResponse(loginResponse, 401);
    expect(loginResponseBody.message).toContain(
      "Incorrect email address or password",
    );
    expect(loginResponseBody.data).toBeUndefined();
  });

  test("GET /users/profile with valid token", async ({ request }) => {
    const { email, password } = getTestCredentials();
    const authClient = new AuthApiClient(request);
    const authToken = await loginAndGetToken(authClient, email, password);
    const authenticatedAuthClient = new AuthApiClient(request, authToken);
    const userProfileResponse = await authenticatedAuthClient.getProfile();

    expect(userProfileResponse.status()).toBe(200);
    const userProfileResponseBody = await userProfileResponse.json();

    expect(userProfileResponseBody.success).toBe(true);
    expect(userProfileResponseBody.message).toBe("Profile successful");
    const userProfile = userProfileResponseBody.data as UserProfile;
    expect(typeof userProfile.id).toBe("string");
    expect(userProfile.id.length).toBeGreaterThan(0);
    expect(typeof userProfile.name).toBe("string");
    expect(userProfile.name.length).toBeGreaterThan(0);
    expect(userProfile.email).toBe(email);
  });

  test("login → logout → reuse same token → rejected", async ({ request }) => {
    const { email, password } = getTestCredentials();
    const authClient = new AuthApiClient(request);
    const authToken = await loginAndGetToken(authClient, email, password);
    const authenticatedAuthClient = new AuthApiClient(request, authToken);
    const logoutResponse = await authenticatedAuthClient.logout();

    expect(logoutResponse.status()).toBe(200);
    const logoutResponseBody = await logoutResponse.json();
    expect(logoutResponseBody.success).toBe(true);
    expect(logoutResponseBody.message).toBe(
      "User has been successfully logged out",
    );
    const userProfileResponse = await authenticatedAuthClient.getProfile();
    const userProfileResponseBody = await expectApiErrorResponse(
      userProfileResponse,
      401,
    );

    expect(userProfileResponseBody.message).toBe(
      "Access token is not valid or has expired, you will need to login",
    );
  });
});
