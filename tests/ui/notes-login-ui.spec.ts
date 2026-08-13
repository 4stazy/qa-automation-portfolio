// import {test, expect} from '@playwright/test';
import { test, expect } from '../../fixtures/app.fixture';

const BASE_UI_URL = 'https://practice.expandtesting.com/notes/app';
const validEmail = process.env.TEST_EMAIL;
const validPassword = process.env.TEST_PASSWORD;

test.describe('Notes App login', () => {
    test.beforeEach(async ({page}) => {
        await page.goto(`${BASE_UI_URL}`);
        await expect(page.getByTestId('build-version')).toBeVisible();
        await expect(page).toHaveTitle(/Notes React Application/);
        const loginLinkButton = page.getByTestId('open-login-view').getByRole('link', {name: 'Login'});
        await expect(loginLinkButton).toBeVisible();
        await loginLinkButton.click();
        await expect(page).toHaveURL(`${BASE_UI_URL}/login`);

    });
    test('Login with valid credentials', async({ page, loginPage }) => {
        test.skip(
            !validEmail || !validPassword,
            'TEST_EMAIL or TEST_PASSWORD is not configured'
            );
        await loginPage.login(validEmail!, validPassword!);
    
        await expect(page.getByRole('button', {name: 'Logout'})).toBeVisible({ timeout: 10000 });
        await expect(page.getByRole('button', {name: '+ Add Note'})).toBeVisible();

    });

    test('Error login message is displayed when login with invalid credentials', async({ page, loginPage }) => {
        test.skip(
            !validEmail || !validPassword,
            'TEST_EMAIL or TEST_PASSWORD is not configured'
            );
        const invalidPassword = `${validPassword!}+1`;
        const loginErrorMessage = 'Incorrect email address or password';
        const alertMessage = page.getByTestId('alert-message');
        await loginPage.login(validEmail!, invalidPassword);
      
        await expect(alertMessage).toBeVisible();
        await expect(alertMessage).toHaveText(loginErrorMessage);
        await expect(page).toHaveURL(/\/login$/);

    });

    test('Authenticated user can logout', async({ page, loginPage }) => {
        test.skip(
            !validEmail || !validPassword,
            'TEST_EMAIL or TEST_PASSWORD is not configured'
            );

        const logoutButton = page.getByRole('button', {name: 'Logout'});
        const addNoteButton = page.getByRole('button', {name: '+ Add Note'});
        await loginPage.login(validEmail!, validPassword!);
    
        await expect(logoutButton).toBeVisible({ timeout: 10000 });
        await expect(addNoteButton).toBeVisible();

        await logoutButton.click();
        const loginLinkButton = page.getByTestId('open-login-view').getByRole('link', {name: 'Login'});
        await expect(loginLinkButton).toBeVisible();
        await expect(page.getByTestId('open-register-view')).toHaveText('Create an account');
        await expect(logoutButton).toHaveCount(0);
        await expect(addNoteButton).toHaveCount(0);


    });




});