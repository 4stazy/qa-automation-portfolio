import type { APIRequestContext, APIResponse } from "@playwright/test";

const API_BASE_URL = "https://practice.expandtesting.com/notes/api";

export class AuthApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly token?: string,
  ) {}

  private getRequestOptions(): {
    headers: Record<string, string>;
    ignoreHTTPSErrors: boolean;
  } {
    const headers: Record<string, string> = {};

    if (this.token) {
      headers["x-auth-token"] = this.token;
    }

    return {
      headers,
      ignoreHTTPSErrors: true,
    };
  }

  async login(email: string, password: string): Promise<APIResponse> {
    return this.request.post(`${API_BASE_URL}/users/login`, {
      ...this.getRequestOptions(),
      data: {
        email,
        password,
      },
    });
  }

  async getProfile(): Promise<APIResponse> {
    return this.request.get(
      `${API_BASE_URL}/users/profile`,
      this.getRequestOptions(),
    );
  }

  async logout(): Promise<APIResponse> {
    return this.request.delete(
      `${API_BASE_URL}/users/logout`,
      this.getRequestOptions(),
    );
  }
}
