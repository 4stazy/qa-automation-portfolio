import {test, expect} from '@playwright/test';

const BASE_UI_URL = 'https://practice.expandtesting.com/notes/app';
const validEmail = process.env.TEST_EMAIL;
const validPassword = process.env.TEST_PASSWORD;

test.describe('Notes App login', () => {
    test.beforeEach(async ({page}) => {
        await page.goto(`${BASE_UI_URL}`);
        await expect(page).toHaveTitle(/Notes React Application/);
        const loginLinkButton = page.getByRole('link', {name: 'Login'});
        await expect(loginLinkButton).toBeVisible();
        await loginLinkButton.click();
        await expect(page).toHaveURL(`${BASE_UI_URL}/login`);

    });
    test('Login with valid credentials', async({page}) => {
        test.skip(
            !validEmail || !validPassword,
            'TEST_EMAIL or TEST_PASSWORD is not configured'
            );
        await page.getByLabel('Email address').fill(validEmail!);
        await page.getByLabel('Password').fill(validPassword!);
        await page.getByRole('button', {name: 'Login'}).click();
        await expect(page.getByRole('button', {name: 'Logout'})).toBeVisible();
        await expect(page.getByRole('button', {name: '+ Add Note'})).toBeVisible();

    });

    test('Error login message is displayed when login with invalid credentials', async({page}) => {
        test.skip(
            !validEmail || !validPassword,
            'TEST_EMAIL or TEST_PASSWORD is not configured'
            );
        const loginErrorMessage = 'Incorrect email address or password';
        const alertMessage = page.getByTestId('alert-message');
        await page.getByLabel('Email address').fill(validEmail!);
        await page.getByLabel('Password').fill(`${validPassword!}+1`);
        await page.getByRole('button', {name: 'Login'}).click();
        await expect(alertMessage).toBeVisible();
        await expect(alertMessage).toHaveText(loginErrorMessage);
        await expect(page).toHaveURL(/\/login$/);

    });

    test('Authenticated user can logout', async({page}) => {
        test.skip(
            !validEmail || !validPassword,
            'TEST_EMAIL or TEST_PASSWORD is not configured'
            );
        const logoutButton = page.getByRole('button', {name: 'Logout'});
        const addNoteButton = page.getByRole('button', {name: '+ Add Note'});
        await page.getByLabel('Email address').fill(validEmail!);
        await page.getByLabel('Password').fill(validPassword!);
        await page.getByRole('button', {name: 'Login'}).click();
        await expect(logoutButton).toBeVisible();
        await expect(addNoteButton).toBeVisible();

        await logoutButton.click();
        const loginLinkButton = page.getByRole('link', {name: 'Login'});
        await expect(loginLinkButton).toBeVisible();
        await expect(page.getByTestId('open-register-view')).toHaveText('Create an account');
        await expect(logoutButton).toHaveCount(0);
        await expect(addNoteButton).toHaveCount(0);


    });




});