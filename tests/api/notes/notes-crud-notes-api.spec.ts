import {
  test,
  expect,
  type APIResponse,
} from "@playwright/test";

import { NotesApiClient } from "../../../clients/notes-api.client";

const API_BASE_URL = "https://practice.expandtesting.com/notes/api";
type NotePayload = {
  title: string;
  description: string;
  category: string;
  completed: boolean;
};
type Note = NotePayload & {
  id: string;
};
type ApiErrorResponse = {
  success: boolean;
  message: string;
};
function expectNoteToMatch(actualNote: Note, expectedNote: NotePayload): void {
  expect(actualNote.title).toBe(expectedNote.title);
  expect(actualNote.description).toBe(expectedNote.description);
  expect(actualNote.category).toBe(expectedNote.category);
  expect(actualNote.completed).toBe(expectedNote.completed);
  expect(typeof actualNote.id).toBe("string");
};
async function expectApiErrorResponse(
  response: APIResponse,
  expectedStatus: number,
  expectedMessage: string,
): Promise<void> {
  expect(response.status()).toBe(expectedStatus);

  const responseBody = (await response.json()) as ApiErrorResponse;
  expect(responseBody.success).toBe(false);
  expect(responseBody.message).toBe(expectedMessage);
}
async function createAndVerifyNote(
  notesClient: NotesApiClient,
  notePayload: NotePayload,
): Promise<Note> {
  const createNoteResponse = await notesClient.createNote(notePayload);
  const createNoteBody = await createNoteResponse.json();

  expect(createNoteResponse.status()).toBe(200);
  const createdNote = createNoteBody.data as Note;

  expectNoteToMatch(createdNote, notePayload);

  return createdNote;
}

test.describe("Notes API - create, read and delete", () => {
  let authToken: string;
  let negativeTestNoteId: string;
  const noteBody: NotePayload = {
    title: `Test note title ${Date.now()}`,
    description: "Test note Description",
    category: "Work",
    completed: false,
  };
  const noteBodyNegativeTest: NotePayload = {
    title: `Negative test note title ${Date.now()}`,
    description: "Negative test note Description",
    category: "Home",
    completed: false,
  };

  test.beforeAll(async ({ request }) => {
    // LOGIN API request flow
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;
    if (!email || !password) {
      throw new Error("TEST_EMAIL or TEST_PASSWORD was not loaded from .env");
    }
    const responseLogin = await request.post(`${API_BASE_URL}/users/login`, {
      data: {
        email,
        password,
      },
      ignoreHTTPSErrors: true,
    });
    expect(responseLogin.status()).toBe(200);
    const responseLoginBody = await responseLogin.json();
    expect(responseLoginBody.data.token).toBeTruthy();
    authToken = responseLoginBody.data.token;

    const notesClient = new NotesApiClient(request, authToken);
    const createdNegativeNote = await createAndVerifyNote(
      notesClient,
      noteBodyNegativeTest,
    );
    negativeTestNoteId = createdNegativeNote.id;
  });

  test("Create, get and delete note", async ({ request }) => {
    const notesClient = new NotesApiClient(request, authToken);
    const createdNote = await createAndVerifyNote(notesClient, noteBody);
    const createdNoteId = createdNote.id;
    let noteWasDeleted = false;
    try {
      const noteResponse = await notesClient.getNote(createdNoteId);

      expect(noteResponse.status()).toBe(200);
      const noteResponseBody = await noteResponse.json();
      expect(noteResponseBody.message).toBe("Note successfully retrieved");

      expectNoteToMatch(noteResponseBody.data, noteBody);
      expect(noteResponseBody.data.id).toBe(createdNoteId);
      // DELETE note API request
      const noteDeleteResponse = await notesClient.deleteNote(createdNoteId);

      expect(noteDeleteResponse.status()).toBe(200);
      noteWasDeleted = true;
      const noteDeleteResponseBody = await noteDeleteResponse.json();
      expect(noteDeleteResponseBody.success).toBe(true);
      expect(noteDeleteResponseBody.message).toBe("Note successfully deleted");
      const responseNoteNotExists = await notesClient.getNote(createdNoteId);

      await expectApiErrorResponse(
        responseNoteNotExists,
        404,
        "No note was found with the provided ID, Maybe it was deleted",
      );
    } finally {
      if (!noteWasDeleted) {
        await notesClient.deleteNote(createdNoteId);
      }
    }
  });

  test("GET negativeTestNoteId without token → 401", async ({ request }) => {
    const notesClient = new NotesApiClient(request);
    const noteResponse = await notesClient.getNote(negativeTestNoteId);

    await expectApiErrorResponse(
      noteResponse,
      401,
      "No authentication token specified in x-auth-token header",
    );
  });

  test("DELETE negativeTestNoteId without token → 401", async ({ request }) => {
    const noAuthNotesClient = new NotesApiClient(request);
    // DELETE negativeNoteId without token → 401
    const noteDeleteResponse = await noAuthNotesClient.deleteNote(negativeTestNoteId); 
    await expectApiErrorResponse(
      noteDeleteResponse,
      401,
      "No authentication token specified in x-auth-token header",
    );
    // GET with token → 200
    const authenticatedNotesClient = new NotesApiClient(request, authToken);
    const noteResponse = await authenticatedNotesClient.getNote(negativeTestNoteId);

    expect(noteResponse.status()).toBe(200);
    const noteResponseBody = await noteResponse.json();
    expect(noteResponseBody.message).toBe("Note successfully retrieved");
    expect(noteResponseBody.data.id).toBe(negativeTestNoteId);

    expectNoteToMatch(noteResponseBody.data, noteBodyNegativeTest);
  });

  test("GET note with invalid ID format returns 400", async ({ request }) => {
    const invalidNoteId = "invalid-note-id";
    const notesClient = new NotesApiClient(request, authToken);
    const response = await notesClient.getNote(invalidNoteId);

    await expectApiErrorResponse(response, 400, "Note ID must be a valid ID");
  });

  test("GET /notes/:id returns 401 when token is invalid", async ({
    request,
  }) => {
    const invalidToken = `${authToken.slice(0, -1)}x`;
    const notesClient = new NotesApiClient(request, invalidToken);
    const response = await notesClient.getNote(negativeTestNoteId);

    await expectApiErrorResponse(
      response,
      401,
      "Access token is not valid or has expired, you will need to login",
    );
  });

  test.afterAll(async ({ request }) => {
    if (!authToken || !negativeTestNoteId) {
      return;
    }
    const notesClient = new NotesApiClient(request, authToken);
    const noteDeleteResponse = await notesClient.deleteNote(negativeTestNoteId);

    expect(noteDeleteResponse.status()).toBe(200);
    const noteDeleteResponseBody = await noteDeleteResponse.json();
    expect(noteDeleteResponseBody.success).toBe(true);
    expect(noteDeleteResponseBody.message).toBe("Note successfully deleted");
  });
});
