import { expect, type APIResponse } from "@playwright/test";

type ApiErrorResponse = {
  success: boolean;
  message: string;
  data?: unknown;
};

export async function expectApiErrorResponse(
  response: APIResponse,
  expectedStatus: number,
): Promise<ApiErrorResponse> {
  expect(response.status()).toBe(expectedStatus);
  const responseBody = (await response.json()) as ApiErrorResponse;
  expect(responseBody.success).toBe(false);
  expect(responseBody.message).toEqual(expect.any(String));
  return responseBody;
}
