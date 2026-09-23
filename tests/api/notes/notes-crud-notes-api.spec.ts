import { test, expect, type APIResponse } from "@playwright/test";
import { NotesApiClient } from "../../../clients/notes-api.client";
import type { NotePayload } from "../../../types/note.types";
import { expectApiErrorResponse } from "../../../utils/api-assertions";
import { getTestCredentials } from "../../../utils/test-credentials";
import { AuthApiClient } from "../../../clients/auth-api.client";

type Note = NotePayload & {
  id: string;
};

function expectNoteToMatch(actualNote: Note, expectedNote: NotePayload): void {
  expect(actualNote.title).toBe(expectedNote.title);
  expect(actualNote.description).toBe(expectedNote.description);
  expect(actualNote.category).toBe(expectedNote.category);
  expect(actualNote.completed).toBe(expectedNote.completed);
  expect(typeof actualNote.id).toBe("string");
}

test.describe("Notes API", () => {
  let authToken: string;
  let negativeTestNoteId: string;
  const noteBody: NotePayload = {
    title: `Test note title ${Date.now()}`,
    description: "Test note Description",
    category: "Work",
    completed: false,
  };
  const noteBodyUpdate: NotePayload = {
    title: "Test note title updated",
    description: "Test note Description updated",
    category: "Home",
    completed: true,
  };
  const noteBodyNegativeTest: NotePayload = {
    title: `Negative test note title ${Date.now()}`,
    description: "Negative test note Description",
    category: "Home",
    completed: false,
  };

  test.beforeAll(async ({ request }) => {
    // LOGIN API request flow
    const { email, password } = getTestCredentials();
    const authClient = new AuthApiClient(request);
    const responseLogin = await authClient.login(email, password);

    expect(responseLogin.status()).toBe(200);
    const responseLoginBody = await responseLogin.json();
    expect(responseLoginBody.data.token).toBeTruthy();
    authToken = responseLoginBody.data.token;

    const notesClient = new NotesApiClient(request, authToken);
    const createNegativeNoteResponse =
      await notesClient.createNote(noteBodyNegativeTest);
    const createNegativeNoteBody = await createNegativeNoteResponse.json();
    const createdNegativeNote = createNegativeNoteBody.data as Note;
    negativeTestNoteId = createdNegativeNote.id;
    expect(createNegativeNoteResponse.status()).toBe(200);
    expect(createNegativeNoteBody.success).toBe(true);
    expectNoteToMatch(createdNegativeNote, noteBodyNegativeTest);
  });

  test("Create, get, update and delete note", async ({ request }) => {
    const notesClient = new NotesApiClient(request, authToken);
    let createdNoteId: string | undefined;
    let noteDeletionConfirmed = false;

    try {
      const createNoteResponse = await notesClient.createNote(noteBody);
      const createNoteBody = await createNoteResponse.json();
      const createdNote = createNoteBody.data as Note;
      createdNoteId = createdNote.id;
      expect(createNoteResponse.status()).toBe(200);
      expectNoteToMatch(createdNote, noteBody);

      const noteResponse = await notesClient.getNote(createdNoteId);
      expect(noteResponse.status()).toBe(200);
      const noteResponseBody = await noteResponse.json();
      expect(noteResponseBody.message).toBe("Note successfully retrieved");
      expectNoteToMatch(noteResponseBody.data, noteBody);
      expect(noteResponseBody.data.id).toBe(createdNoteId);
      // Update note PUT method
      const noteUpdatedResponse = await notesClient.updateNote(
        createdNoteId,
        noteBodyUpdate,
      );
      expect(noteUpdatedResponse.status()).toBe(200);
      const noteUpdatedResponseBody = await noteUpdatedResponse.json();
      expect(noteUpdatedResponseBody.message).toBe("Note successfully Updated");
      expectNoteToMatch(noteUpdatedResponseBody.data, noteBodyUpdate);
      expect(noteUpdatedResponseBody.success).toBe(true);
      expect(noteUpdatedResponseBody.data.id).toBe(createdNoteId);
      // Validation for persisted note updated state
      const updatedNoteGetResponse = await notesClient.getNote(createdNoteId);
      expect(updatedNoteGetResponse.status()).toBe(200);
      const updatedNoteGetResponseBody = await updatedNoteGetResponse.json();
      expectNoteToMatch(updatedNoteGetResponseBody.data, noteBodyUpdate);
      expect(updatedNoteGetResponseBody.data.id).toBe(createdNoteId);
      expect(updatedNoteGetResponseBody.message).toBe(
        "Note successfully retrieved",
      );
      // DELETE note API request
      const noteDeleteResponse = await notesClient.deleteNote(createdNoteId);

      expect(noteDeleteResponse.status()).toBe(200);
      const noteDeleteResponseBody = await noteDeleteResponse.json();
      expect(noteDeleteResponseBody.success).toBe(true);
      expect(noteDeleteResponseBody.message).toBe("Note successfully deleted");
      const responseNoteNotExists = await notesClient.getNote(createdNoteId);

      const responseGetNoteBody = await expectApiErrorResponse(
        responseNoteNotExists,
        404,
      );
      expect(responseGetNoteBody.message).toBe(
        "No note was found with the provided ID, Maybe it was deleted",
      );
      noteDeletionConfirmed = true;
    } finally {
      if (createdNoteId !== undefined && !noteDeletionConfirmed) {
        await notesClient.deleteNote(createdNoteId);
      }
    }
  });

  test("GET negativeTestNoteId without token → 401", async ({ request }) => {
    const notesClient = new NotesApiClient(request);
    const noteResponse = await notesClient.getNote(negativeTestNoteId);

    const noteResponseBody = await expectApiErrorResponse(noteResponse, 401);
    expect(noteResponseBody.message).toBe(
      "No authentication token specified in x-auth-token header",
    );
  });

  test("DELETE negativeTestNoteId without token → 401", async ({ request }) => {
    const noAuthNotesClient = new NotesApiClient(request);
    // DELETE negativeNoteId without token → 401
    const noteDeleteResponse =
      await noAuthNotesClient.deleteNote(negativeTestNoteId);
    const noteDeleteResponseBody = await expectApiErrorResponse(
      noteDeleteResponse,
      401,
    );
    expect(noteDeleteResponseBody.message).toBe(
      "No authentication token specified in x-auth-token header",
    );
    // GET with token → 200
    const authenticatedNotesClient = new NotesApiClient(request, authToken);
    const noteResponse =
      await authenticatedNotesClient.getNote(negativeTestNoteId);

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

    const responseNoteBody = await expectApiErrorResponse(response, 400);
    expect(responseNoteBody.message).toBe("Note ID must be a valid ID");
  });

  test("GET /notes/:id returns 401 when token is invalid", async ({
    request,
  }) => {
    const invalidToken = `${authToken.slice(0, -1)}x`;
    const notesClient = new NotesApiClient(request, invalidToken);
    const response = await notesClient.getNote(negativeTestNoteId);

    const responseNoteBody = await expectApiErrorResponse(response, 401);
    expect(responseNoteBody.message).toBe(
      "Access token is not valid or has expired, you will need to login",
    );
  });

  test("GET all notes returns created note", async ({ request }) => {
    const notesClient = new NotesApiClient(request, authToken);
    let createdNoteId: string | undefined;

    try {
      const createNoteResponse = await notesClient.createNote(noteBody);
      const createNoteBody = await createNoteResponse.json();

      const createdNote = createNoteBody.data as Note;
      createdNoteId = createdNote.id;

      expect(createNoteResponse.status()).toBe(200);
      expectNoteToMatch(createdNote, noteBody);
      const allNotesResponse = await notesClient.getAllNotes();
      expect(allNotesResponse.status()).toBe(200);

      const allNotesResponseBody = await allNotesResponse.json();
      expect(allNotesResponseBody.message).toBe("Notes successfully retrieved");
      expect(allNotesResponseBody.success).toBe(true);
      const notes = allNotesResponseBody.data as Note[];
      const createdNoteFromAllNotes = notes.find(
        (note) => note.id === createdNoteId,
      );
      expect(createdNoteFromAllNotes).toBeDefined();
      if (createdNoteFromAllNotes === undefined) {
        throw new Error(
          `Created note with id ${createdNoteId} was not found in GET all notes response`,
        );
      }
      expectNoteToMatch(createdNoteFromAllNotes, noteBody);
      expect(createdNoteFromAllNotes.id).toBe(createdNoteId);
    } finally {
      if (createdNoteId) {
        await notesClient.deleteNote(createdNoteId);
      }
    }
  });

  test("PUT note rejects completed with invalid type and keeps note unchanged", async ({
    request,
  }) => {
    const invalidPayload = {
      ...noteBody,
      completed: "yes",
    };

    const notesClient = new NotesApiClient(request, authToken);
    let createdNoteId: string | undefined;
    try {
      const createNoteResponse = await notesClient.createNote(noteBody);
      const createNoteBody = await createNoteResponse.json();
      const createdNote = createNoteBody.data as Note;
      createdNoteId = createdNote.id;
      expect(createNoteResponse.status()).toBe(200);
      expectNoteToMatch(createdNote, noteBody);

      const updateNoteResponse = await notesClient.updateNoteRaw(
        createdNoteId,
        invalidPayload,
      );
      const updateNoteResponseBody = await expectApiErrorResponse(
        updateNoteResponse,
        400,
      );
      expect(updateNoteResponseBody.message).toBe(
        "Note completed status must be boolean",
      );
      const noteGetResponse = await notesClient.getNote(createdNoteId);
      expect(noteGetResponse.status()).toBe(200);
      const noteGetResponseBody = await noteGetResponse.json();
      expect(noteGetResponseBody.message).toBe("Note successfully retrieved");
      expectNoteToMatch(noteGetResponseBody.data, noteBody);
      expect(noteGetResponseBody.data.id).toBe(createdNoteId);
    } finally {
      if (createdNoteId !== undefined) {
        await notesClient.deleteNote(createdNoteId);
      }
    }
  });

  test("PUT note rejects unsupported category and keeps note unchanged", async ({
    request,
  }) => {
    const invalidPayload = {
      ...noteBody,
      category: "Casino",
    };
    const notesClient = new NotesApiClient(request, authToken);
    let createdNoteId: string | undefined;
    try {
      const createNoteResponse = await notesClient.createNote(noteBody);
      const createNoteBody = await createNoteResponse.json();
      const createdNote = createNoteBody.data as Note;
      createdNoteId = createdNote.id;
      expect(createNoteResponse.status()).toBe(200);
      expectNoteToMatch(createdNote, noteBody);

      const updateNoteResponse = await notesClient.updateNoteRaw(
        createdNoteId,
        invalidPayload,
      );
      const updateNoteResponseBody = await expectApiErrorResponse(
        updateNoteResponse,
        400,
      );
      expect(updateNoteResponseBody.message).toBe(
        "Category must be one of the categories: Home, Work, Personal",
      );
      const noteGetResponse = await notesClient.getNote(createdNoteId);
      expect(noteGetResponse.status()).toBe(200);
      const noteGetResponseBody = await noteGetResponse.json();
      expect(noteGetResponseBody.message).toBe("Note successfully retrieved");
      expectNoteToMatch(noteGetResponseBody.data, noteBody);
      expect(noteGetResponseBody.data.id).toBe(createdNoteId);
    } finally {
      if (createdNoteId !== undefined) {
        await notesClient.deleteNote(createdNoteId);
      }
    }
  });

  test.afterAll(async ({ request }) => {
    if (!authToken || !negativeTestNoteId) {
      return;
    }
    const notesClient = new NotesApiClient(request, authToken);
    await notesClient.deleteNote(negativeTestNoteId);
  });
});
