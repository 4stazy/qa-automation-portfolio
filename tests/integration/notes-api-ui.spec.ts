import { test, expect } from "../../fixtures/app.fixture";
import { AuthApiClient } from "../../clients/auth-api.client";
import { NotesApiClient } from "../../clients/notes-api.client";
import type { Note, NotePayload } from "../../types/note.types";
import { getTestCredentials } from "../../utils/test-credentials";

test("API-created note is visible in UI", async ({
  request,
  page,
  loginPage,
}) => {
  const { email, password } = getTestCredentials();

  const authClient = new AuthApiClient(request);
  const loginResponse = await authClient.login(email, password);

  expect(loginResponse.status()).toBe(200);

  const loginBody = await loginResponse.json();
  const authToken = loginBody.data.token as string;

  const notesClient = new NotesApiClient(request, authToken);

  const noteBody: NotePayload = {
    title: `Integration note ${Date.now()}`,
    description: "Created through API for UI verification",
    category: "Work",
    completed: false,
  };

  let createdNoteId: string | undefined;

  try {
    const createResponse = await notesClient.createNote(noteBody);

    expect(createResponse.status()).toBe(200);

    const createBody = await createResponse.json();
    const createdNote = createBody.data as Note;

    createdNoteId = createdNote.id;

    expect(createdNoteId).toBeTruthy();
    await page.goto("https://practice.expandtesting.com/notes/app");

    await page
      .getByTestId("open-login-view")
      .getByRole("link", {
        name: "Login",
      })
      .click();

    await loginPage.login(email, password);

    await expect(
      page.getByRole("button", { name: "+ Add Note" }),
    ).toBeVisible();
    await expect(page.getByText(noteBody.title, { exact: true })).toBeVisible();
    const getNoteResponse = await notesClient.getNote(createdNoteId);

    expect(getNoteResponse.status()).toBe(200);

    const getNoteBody = await getNoteResponse.json();

    expect(getNoteBody.data.id).toBe(createdNoteId);
    expect(getNoteBody.data.title).toBe(noteBody.title);
    expect(getNoteBody.data.description).toBe(noteBody.description);
    expect(getNoteBody.data.category).toBe(noteBody.category);
    expect(getNoteBody.data.completed).toBe(noteBody.completed);
  } finally {
    if (createdNoteId !== undefined) {
      await notesClient.deleteNote(createdNoteId);
    }
  }
});
