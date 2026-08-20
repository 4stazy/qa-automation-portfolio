import type { APIRequestContext, APIResponse } from "@playwright/test";

const API_BASE_URL = "https://practice.expandtesting.com/notes/api";

export class NotesApiClient {
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

  async getNote(noteId: string): Promise<APIResponse> {
    return this.request.get(
      `${API_BASE_URL}/notes/${noteId}`,
      this.getRequestOptions(),
    );
  }

  async deleteNote(noteId: string): Promise<APIResponse> {
    return this.request.delete(
      `${API_BASE_URL}/notes/${noteId}`,
      this.getRequestOptions(),
    );
  }

  async createNote(data: unknown): Promise<APIResponse> {
    return this.request.post(`${API_BASE_URL}/notes/`, {
      ...this.getRequestOptions(),
      data,
    });
  }
}
