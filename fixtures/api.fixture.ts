import { test as base, expect } from "@playwright/test";
import { AuthApiClient } from "../clients/auth-api.client";
import { NotesApiClient } from "../clients/notes-api.client";
import { UserRegisterData } from "../types/user.types";

type ApiFixtures = {
  authenticatedApiUser: {
    email: string;
    password: string;
    token: string;
    notesClient: NotesApiClient;
  };
};

export const test = base.extend<ApiFixtures>({
  authenticatedApiUser: async ({ request }, use) => {
    const timestamp = Date.now();
    const newUserData: UserRegisterData = {
      name: `test-${timestamp}`,
      email: `test-${timestamp}@test.com`,
      password: "test123",
    };
    const authClient = new AuthApiClient(request);
    const registerUserResponse = await authClient.registerUser(
      newUserData.name,
      newUserData.email,
      newUserData.password,
    );
    expect(registerUserResponse.status()).toBe(201);
    const loginResponse = await authClient.login(
      newUserData.email,
      newUserData.password,
    );
    expect(loginResponse.status()).toBe(200);
    const loginResponseBody = await loginResponse.json();
    expect(typeof loginResponseBody.data.token).toBe("string");
    const authToken = loginResponseBody.data.token;
    const notesClient = new NotesApiClient(request, authToken);
    await use({
      email: newUserData.email,
      password: newUserData.password,
      token: authToken,
      notesClient,
    });
    const authenticatedAuthClient = new AuthApiClient(request, authToken);
    const deleteUserResponse =
      await authenticatedAuthClient.deleteUserAccount();
    expect(deleteUserResponse.status()).toBe(200);
  },
});

export { expect };
