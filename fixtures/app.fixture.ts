import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

type AppFixtures = {
    loginPage: LoginPage;
};

export const test = base.extend<AppFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
});

export { expect };
