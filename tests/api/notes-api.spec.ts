import { test, expect } from '@playwright/test';

const API_BASE_URL = 'https://practice.expandtesting.com/notes/api';



test.describe('Notes API - Authentication', ()=> {
    test('POST /users/login returns token for valid credentials', async ({request})=> {
        
        const email = process.env.TEST_EMAIL;
        const password = process.env.TEST_PASSWORD;

        if (!email || !password) {
            throw new Error(
            'TEST_EMAIL or TEST_PASSWORD was not loaded from .env'
            );
        }

        const response = await request.post(`${API_BASE_URL}/users/login`, {
            data: {
                email,
                password,
            },
            ignoreHTTPSErrors: true,
        });

        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');

        const body = await response.json();

        expect(body.success).toBe(true);
        expect(body.data).toBeDefined();
        expect(body.data.token).toBeDefined();
        expect(typeof body.data.token).toBe('string');
        expect(body.data.token.length).toBeGreaterThan(0);
        // expect(body.data.email).toBe(email);
        expect(body.data.password).toBeUndefined();
        expect(body.data.email).toBe(email);

    });
})