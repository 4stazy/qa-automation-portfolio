import { type Locator, type Page} from '@playwright/test';

export class LoginPage {
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(private readonly page: Page) {
        this.emailInput = page.getByLabel('Email address');
        this.passwordInput = page.getByTestId('login-password');
        this.loginButton = page.getByRole('button', {name: 'Login'});
    }

    async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}