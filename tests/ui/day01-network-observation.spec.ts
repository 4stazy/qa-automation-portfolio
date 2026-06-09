import { test, expect } from '@playwright/test';
test.describe('Day - 01 basic Playwright smoke test', () => {
    test('Playwright homepage opens and shows Get started link', async ({page}) => {
        await page.goto('https://playwright.dev');

        await expect(page).toHaveTitle(/Playwright/);
        await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
    });

});