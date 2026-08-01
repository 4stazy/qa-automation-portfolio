import { test, expect } from '@playwright/test';

const API_BASE_URL = 'https://practice.expandtesting.com/notes/api';

test.describe('Notes API - create, read and delete', () => {

    let authToken: string;
    let negativeTestNoteId: string;
    const noteBody = {
                title: `Test note title ${Date.now()}`,
                description: 'Test note Description',
                category: 'Work',
                completed: false,
            };
    const noteBodyNegativeTest = {
                title: `Negative test note title ${Date.now()}`,
                description: 'Negative test note Description',
                category: 'Home',
                completed: false,
            };

    test.beforeAll(async ({ request }) => {
        // LOGIN API request flow
        const email = process.env.TEST_EMAIL;
        const password = process.env.TEST_PASSWORD;
        if (!email || !password) {
            throw new Error(
            'TEST_EMAIL or TEST_PASSWORD was not loaded from .env'
            )
        };
        const responseLogin = await request.post(`${API_BASE_URL}/users/login`, {
            data: {
                email,
                password
            },
            ignoreHTTPSErrors: true,
        });
        expect(responseLogin.status()).toBe(200);
        const responseLoginBody = await responseLogin.json();
        expect(responseLoginBody.data.token).toBeTruthy();
        authToken = responseLoginBody.data.token;
        // NOTE CREATE flow for negative tests
        const createNegativeNoteResponse = await request.post(`${API_BASE_URL}/notes/`, {
            headers: {
                'x-auth-token': authToken,
            },
            data: noteBodyNegativeTest,
            ignoreHTTPSErrors: true,

        });
        expect(createNegativeNoteResponse.status()).toBe(200);
        const getAllNotesResponse = await request.get(`${API_BASE_URL}/notes/`, {
            headers: {
                'x-auth-token': authToken,
            },
            ignoreHTTPSErrors: true,
        });
        expect(getAllNotesResponse.status()).toBe(200);
        // Searching and extracting created note among all notes
        const getAllNotesBody = await getAllNotesResponse.json();
        expect(Array.isArray(getAllNotesBody.data)).toBe(true);
        const createdNegativeNote = getAllNotesBody.data.find(
            (note: { title: string }) => note.title === noteBodyNegativeTest.title
            );

         if (!createdNegativeNote) {
            throw new Error(`Created Negative note "${noteBodyNegativeTest.title}" was not found`)
            };
        
        // Assertions for created note
        expect(createdNegativeNote.title).toBe(noteBodyNegativeTest.title);
        expect(createdNegativeNote.description).toBe(noteBodyNegativeTest.description);
        expect(createdNegativeNote.category).toBe(noteBodyNegativeTest.category);
        expect(createdNegativeNote.completed).toBe(false);
        expect(typeof createdNegativeNote.id).toBe('string');
        negativeTestNoteId = createdNegativeNote.id;

    });

    test('Create, get and delete note', async({ request }) => {
        // POST request for create new note
        const createNoteResponse = await request.post(`${API_BASE_URL}/notes/`, {
            headers: {
                'x-auth-token': authToken,
            },
            data: noteBody,
            ignoreHTTPSErrors: true,

        });
        expect(createNoteResponse.status()).toBe(200);
        // GET request for list of notes
        const getAllNotesResponse = await request.get(`${API_BASE_URL}/notes/`, {
            headers: {
                'x-auth-token': authToken,
            },
            ignoreHTTPSErrors: true,
        });
        expect(getAllNotesResponse.status()).toBe(200);
        // Searching and extracting created note among all notes
        const getAllNotesBody = await getAllNotesResponse.json();
        expect(Array.isArray(getAllNotesBody.data)).toBe(true);
        const createdNote = getAllNotesBody.data.find(
            (note: { title: string }) => note.title === noteBody.title
            );

         if (!createdNote) {
            throw new Error(`Created note "${noteBody.title}" was not found`);
            }
        
        // Assertions for created note
        expect(createdNote.title).toBe(noteBody.title);
        expect(createdNote.description).toBe(noteBody.description);
        expect(createdNote.category).toBe(noteBody.category);
        expect(createdNote.completed).toBe(false);
        expect(typeof createdNote.id).toBe('string');
        const createdNoteId = createdNote.id;
        // GET request for note ID to verify it does exist
        const noteResponse = await request.get(`${API_BASE_URL}/notes/${createdNoteId}`, {
            headers: {
                'x-auth-token': authToken,
            },
            ignoreHTTPSErrors: true,
        });
        expect(noteResponse.status()).toBe(200);
        const noteResponseBody = await noteResponse.json();
        expect(noteResponseBody.message).toBe('Note successfully retrieved');
        expect(noteResponseBody.data.id).toBe(createdNoteId);
        expect(noteResponseBody.data.title).toBe(noteBody.title);
        expect(noteResponseBody.data.description).toBe(noteBody.description);
        expect(noteResponseBody.data.category).toBe(noteBody.category);
        expect(noteResponseBody.data.completed).toBe(false);
        // DELETE note API request
        const noteDeleteResponse = await request.delete(`${API_BASE_URL}/notes/${createdNoteId}`, {
            headers: {
                'x-auth-token': authToken,
            },
            ignoreHTTPSErrors: true,
        });
        expect(noteDeleteResponse.status()).toBe(200);
        // {"success":true,"status":200,"message":"Note successfully deleted"}
       const noteDeleteResponseBody = await noteDeleteResponse.json();
       expect(noteDeleteResponseBody.success).toBe(true);
       expect(noteDeleteResponseBody.message).toBe('Note successfully deleted');
       const responseNoteNotExists = await request.get(`${API_BASE_URL}/notes/${createdNoteId}`, {
            headers: {
                'x-auth-token': authToken,
            },
            ignoreHTTPSErrors: true,
        });
        expect(responseNoteNotExists.status()).toBe(404);
        const responseNoteNotExistsBody = await responseNoteNotExists.json();
        expect(responseNoteNotExistsBody.success).toBe(false);
        expect(responseNoteNotExistsBody.message).toBe('No note was found with the provided ID, Maybe it was deleted');


    });

    test('GET negativeTestNoteId without token → 401', async({ request }) => {
        const noteResponse = await request.get(`${API_BASE_URL}/notes/${negativeTestNoteId}`, {
            ignoreHTTPSErrors: true,
        });
        expect(noteResponse.status()).toBe(401);
        const noteResponseBody = await noteResponse.json();
        expect(noteResponseBody.success).toBe(false);
        expect(noteResponseBody.message).toBe('No authentication token specified in x-auth-token header');
        // console.log(noteResponseBody);


    });

    test('DELETE negativeTestNoteId without token → 401', async ({request}) => {
        // DELETE negativeNoteId without token → 401
        const noteDeleteResponse = await request.delete(`${API_BASE_URL}/notes/${negativeTestNoteId}`, {
            ignoreHTTPSErrors: true,
        });
        expect(noteDeleteResponse.status()).toBe(401);
        const noteDeleteResponseBody = await noteDeleteResponse.json();
        // console.log(noteDeleteResponseBody);
        expect(noteDeleteResponseBody.success).toBe(false);
        expect(noteDeleteResponseBody.message).toBe('No authentication token specified in x-auth-token header');
        // GET with token → 200
        const noteResponse = await request.get(`${API_BASE_URL}/notes/${negativeTestNoteId}`, {
            headers: {
                'x-auth-token': authToken,
            },
            ignoreHTTPSErrors: true,
        });
        expect(noteResponse.status()).toBe(200);
        const noteResponseBody = await noteResponse.json();
        expect(noteResponseBody.message).toBe('Note successfully retrieved');
        expect(noteResponseBody.data.id).toBe(negativeTestNoteId);
        expect(noteResponseBody.data.title).toBe(noteBodyNegativeTest.title);
        expect(noteResponseBody.data.description).toBe(noteBodyNegativeTest.description);
        expect(noteResponseBody.data.category).toBe(noteBodyNegativeTest.category);
        expect(noteResponseBody.data.completed).toBe(false);


    });

    test('GET note with invalid ID format returns 400', async({request}) => {
        const invalidNoteId = 'invalid-note-id';
        const response = await request.get(`${API_BASE_URL}/notes/${invalidNoteId}`, {
            headers: {
                'x-auth-token': authToken,
            },
            ignoreHTTPSErrors: true,
        });
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.success).toBe(false);
        expect(responseBody.message).toBe('Note ID must be a valid ID');

    });
    
    
    test('GET /notes/:id returns 401 when token is invalid', async({request}) =>{
        const invalidToken = `${authToken.slice(0, -1)}x`;
        const response = await request.get(`${API_BASE_URL}/notes/${negativeTestNoteId}`, {
            headers: {
                'x-auth-token': invalidToken,
            },
            ignoreHTTPSErrors: true,
        });
        expect(response.status()).toBe(401);
        const responseBody = await response.json();
        expect(responseBody.success).toBe(false);
        expect(responseBody.message).toContain('Access token is not valid or has expired, you will need to login');
    });

    test.afterAll(async({request}) => {
        if (!authToken || !negativeTestNoteId) {
            return;
            }
        const noteDeleteResponse = await request.delete(`${API_BASE_URL}/notes/${negativeTestNoteId}`, {
            headers: {
                'x-auth-token': authToken,
            },
            ignoreHTTPSErrors: true,
        });
        expect(noteDeleteResponse.status()).toBe(200);
        const noteDeleteResponseBody = await noteDeleteResponse.json();
        expect(noteDeleteResponseBody.success).toBe(true);
        expect(noteDeleteResponseBody.message).toBe('Note successfully deleted');

    });

})