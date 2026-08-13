import { test, expect } from '..//../fixtures/app.fixture';

const BASE_UI_URL = 'https://practice.expandtesting.com/notes/app';
const validEmail = process.env.TEST_EMAIL;
const validPassword = process.env.TEST_PASSWORD;

test.describe('@smoke Notes App', () => {

    test('Login page is available', async ({ page }) => {
        await page.goto(`${BASE_UI_URL}/login`);
        await expect(page).toHaveURL(`${BASE_UI_URL}/login`);
        await expect(
            page.getByRole('button', { name: 'Login' })
        ).toBeVisible();

    });

    test('Valid user can access authenticated notes area', async ({ page, loginPage }) => {
    test.skip(
        !validEmail || !validPassword,
        'TEST_EMAIL or TEST_PASSWORD is not configured'
    );

    await page.goto(`${BASE_UI_URL}/login`);

    await loginPage.login(validEmail!, validPassword!);

    await expect(
        page.getByRole('button', { name: '+ Add Note' })
    ).toBeVisible();

    await expect(
        page.getByRole('button', { name: 'Logout' })
    ).toBeVisible();
});
    
});;