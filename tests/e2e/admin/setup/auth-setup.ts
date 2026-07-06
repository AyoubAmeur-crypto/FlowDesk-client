import { test as setup, expect } from '@playwright/test'


const userName = process.env.ADMIN_USERNAME || ''
const password = process.env.ADMIN_PASSWORD || ''

const STORAGE_STATE = 'playwright/.auth/user.json';

// This setup block runs once before the main test suite to automate the login flow.
// The session state is then saved and injected into subsequent tests to skip repetitive logins.
setup(" Authenticate", async ({ page }) => {


    await page.goto("/")

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Welcome Back!')).toBeVisible()
    await page.getByRole('textbox', { name: 'Email' }).fill(userName);

    await page.getByRole('textbox', { name: 'Password' }).fill(password);


    await page.getByTestId("authenticate-button").click();


    await page.waitForURL("/admin")
    await expect(page.getByRole('heading', { name: 'Admin\'s Workspace' })).toBeVisible()

    // Save the authentication cookies and local storage state to a file
    // This file is referenced in playwright.config.ts for the 'chromium' project
    await page.context().storageState({
        path: STORAGE_STATE
    })
})
