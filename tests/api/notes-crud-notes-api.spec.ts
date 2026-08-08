import {
  test,
  expect,
  type APIResponse,
  type APIRequestContext,
} from "@playwright/test";

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
type NotesListResponse = {
  success: boolean;
  message: string;
  data: Note[];
};
function expectNoteToMatch(actualNote: Note, expectedNote: NotePayload): void {
  expect(actualNote.title).toBe(expectedNote.title);
  expect(actualNote.description).toBe(expectedNote.description);
  expect(actualNote.category).toBe(expectedNote.category);
  expect(actualNote.completed).toBe(expectedNote.completed);
  expect(typeof actualNote.id).toBe("string");
}
function getAuthenticatedRequestOptions(token: string) {
  return {
    headers: {
      "x-auth-token": token,
    },
    ignoreHTTPSErrors: true,
  };
}
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
async function createAndFindNote(
  request: APIRequestContext,
  token: string,
  notePayload: NotePayload,
): Promise<Note> {
  const createNoteResponse = await request.post(`${API_BASE_URL}/notes/`, {
    ...getAuthenticatedRequestOptions(token),
    data: notePayload,
  });
  expect(createNoteResponse.status()).toBe(200);

  // GET request for list of notes
  const getAllNotesResponse = await request.get(
    `${API_BASE_URL}/notes/`,
    getAuthenticatedRequestOptions(token),
  );

  expect(getAllNotesResponse.status()).toBe(200);
  // Searching and extracting created note among all notes
  const getAllNotesBody =
    (await getAllNotesResponse.json()) as NotesListResponse;
  expect(Array.isArray(getAllNotesBody.data)).toBe(true);
  const createdNote = getAllNotesBody.data.find(
    (note) => note.title === notePayload.title,
  );

  if (!createdNote) {
    throw new Error(`Created note "${notePayload.title}" was not found`);
  }

  // Assertions for created note
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

    const createdNegativeNote = await createAndFindNote(
      request,
      authToken,
      noteBodyNegativeTest,
    );

    negativeTestNoteId = createdNegativeNote.id;
  });

  test("Create, get and delete note", async ({ request }) => {
    const createdNote = await createAndFindNote(request, authToken, noteBody);
    const createdNoteId = createdNote.id;
    // GET request for note ID to verify it does exist
    const noteResponse = await request.get(
      `${API_BASE_URL}/notes/${createdNoteId}`,
      getAuthenticatedRequestOptions(authToken),
    );

    expect(noteResponse.status()).toBe(200);
    const noteResponseBody = await noteResponse.json();
    expect(noteResponseBody.message).toBe("Note successfully retrieved");

    expectNoteToMatch(noteResponseBody.data, noteBody);
    expect(noteResponseBody.data.id).toBe(createdNoteId);

    // DELETE note API request
    const noteDeleteResponse = await request.delete(
      `${API_BASE_URL}/notes/${createdNoteId}`,
      getAuthenticatedRequestOptions(authToken),
    );

    expect(noteDeleteResponse.status()).toBe(200);
    // {"success":true,"status":200,"message":"Note successfully deleted"}
    const noteDeleteResponseBody = await noteDeleteResponse.json();
    expect(noteDeleteResponseBody.success).toBe(true);
    expect(noteDeleteResponseBody.message).toBe("Note successfully deleted");
    const responseNoteNotExists = await request.get(
      `${API_BASE_URL}/notes/${createdNoteId}`,
      getAuthenticatedRequestOptions(authToken),
    );

    await expectApiErrorResponse(
      responseNoteNotExists,
      404,
      "No note was found with the provided ID, Maybe it was deleted",
    );
  });

  test("GET negativeTestNoteId without token → 401", async ({ request }) => {
    const noteResponse = await request.get(
      `${API_BASE_URL}/notes/${negativeTestNoteId}`,
      {
        ignoreHTTPSErrors: true,
      },
    );

    await expectApiErrorResponse(
      noteResponse,
      401,
      "No authentication token specified in x-auth-token header",
    );
  });

  test("DELETE negativeTestNoteId without token → 401", async ({ request }) => {
    // DELETE negativeNoteId without token → 401
    const noteDeleteResponse = await request.delete(
      `${API_BASE_URL}/notes/${negativeTestNoteId}`,
      {
        ignoreHTTPSErrors: true,
      },
    );
    await expectApiErrorResponse(
      noteDeleteResponse,
      401,
      "No authentication token specified in x-auth-token header",
    );
    // GET with token → 200
    const noteResponse = await request.get(
      `${API_BASE_URL}/notes/${negativeTestNoteId}`,
      getAuthenticatedRequestOptions(authToken),
    );

    expect(noteResponse.status()).toBe(200);
    const noteResponseBody = await noteResponse.json();
    expect(noteResponseBody.message).toBe("Note successfully retrieved");
    expect(noteResponseBody.data.id).toBe(negativeTestNoteId);

    expectNoteToMatch(noteResponseBody.data, noteBodyNegativeTest);
  });

  test("GET note with invalid ID format returns 400", async ({ request }) => {
    const invalidNoteId = "invalid-note-id";
    const response = await request.get(
      `${API_BASE_URL}/notes/${invalidNoteId}`,
      getAuthenticatedRequestOptions(authToken),
    );

    await expectApiErrorResponse(response, 400, "Note ID must be a valid ID");
  });

  test("GET /notes/:id returns 401 when token is invalid", async ({
    request,
  }) => {
    const invalidToken = `${authToken.slice(0, -1)}x`;
    const response = await request.get(
      `${API_BASE_URL}/notes/${negativeTestNoteId}`,
      getAuthenticatedRequestOptions(invalidToken),
    );

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
    const noteDeleteResponse = await request.delete(
      `${API_BASE_URL}/notes/${negativeTestNoteId}`,
      getAuthenticatedRequestOptions(authToken),
    );

    expect(noteDeleteResponse.status()).toBe(200);
    const noteDeleteResponseBody = await noteDeleteResponse.json();
    expect(noteDeleteResponseBody.success).toBe(true);
    expect(noteDeleteResponseBody.message).toBe("Note successfully deleted");
  });
});
