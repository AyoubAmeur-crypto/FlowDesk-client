import { expect, Page, test } from '@playwright/test';
import { Service } from './Service-page';
import { executeSqlFile } from '../../../fixtures/db';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ServiceType } from './type';

test.describe.serial("Service Feature", () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const SEED_DATA = {
        name: "frontend Development",
        description: "React, Vue, and modern frontend application development.",
        price: 49.99,
        category: "Web Development",
        image: "./images/Artboard 5.png"
    } as ServiceType;

    const ADD_NEW_SERVICE = {
        name: "New Custom Service",
        description: "Custom description for E2E testing.",
        price: 99.99,
        category: "Web Development",
        image: "./images/Artboard 5.png",
    } as ServiceType;

    const UPDATED_DATA = {
        name: "New Custom Service",
        description: "Updated description for E2E testing.",
        price: 149.99,
        category: "Web Development",
        image: "./images/Artboard 5.png",
    } as ServiceType;

    let page: Page;
    let service: Service;

    test.beforeAll(async ({ browser }) => {
        // Reset and seed database
        await executeSqlFile(path.resolve(__dirname, 'service-reset.sql'));
        await executeSqlFile(path.resolve(__dirname, 'service-seed.sql'));

        const context = await browser.newContext({
            storageState: './playwright/.auth/user.json',
              recordVideo: {
                dir: "test-results/videos",
            },
        });
        page = await context.newPage();
    });

    test.beforeEach(async () => {
        service = new Service(page);
        await service.gotoSerive();
    });

    test.afterAll(async () => {
        // Clean up database
        await executeSqlFile(path.resolve(__dirname, 'service-reset.sql'));

        if (page) {
            await page.context().close();
        }
    });

    test("Check Seeded Elements", async () => {
        // Verify that seeded elements from the first page are visible
        await expect(page.getByRole('heading', { name: "Backend Development", exact: true })).toBeVisible();
        await expect(page.getByRole('heading', { name: "UI/UX Design", exact: true })).toBeVisible();
    });

    test("Search Services", async () => {
        // Search for 'Backend'
        await service.search("Backend");

        // Verify only 'Backend Development' is visible
        await expect(page.getByRole('heading', { name: "Backend Development", exact: true })).toBeVisible();
        await expect(page.getByRole('heading', { name: "UI/UX Design", exact: true })).toBeHidden();

        // Clear search
        await service.clearSearch();

        // Verify both are visible again
        await expect(page.getByRole('heading', { name: "Backend Development", exact: true })).toBeVisible();
        await expect(page.getByRole('heading', { name: "UI/UX Design", exact: true })).toBeVisible();
    });

    test("Filter Services by Category", async () => {
        // Filter by 'Marketing & Communication'
        await service.filterByCategory("Marketing & Communication");

        // Verify 'SEO Optimization' is visible, others are hidden
        await expect(page.getByRole('heading', { name: "SEO Optimization", exact: true })).toBeVisible();
        await expect(page.getByRole('heading', { name: "Backend Development", exact: true })).toBeHidden();

        // Reset filter
        await service.filterByCategory("All");

        // Verify elements are visible again
        await expect(page.getByRole('heading', { name: "Backend Development", exact: true })).toBeVisible();
    });

    test("Pagination Navigation", async () => {
        // Verify we are on page 1 of 2
        let pagText = await service.getPaginationInfo();
        expect(pagText).toContain("Showing 1-8 of 9 (Page 1 of 2)");

        // Click next page
        await service.goToNextPage();

        // Verify we are on page 2 of 2
        pagText = await service.getPaginationInfo();
        expect(pagText).toContain("Showing 9-9 of 9 (Page 2 of 2)");

        // Verify the 9th service (frontend Development, ID 1) is visible on page 2 and page 1 service is hidden
        await expect(page.getByRole('heading', { name: SEED_DATA.name, exact: true })).toBeVisible();
        await expect(page.getByRole('heading', { name: "Backend Development", exact: true })).toBeHidden();

        // Click previous page
        await service.goToPreviousPage();

        // Verify we are back on page 1
        pagText = await service.getPaginationInfo();
        expect(pagText).toContain("Showing 1-8 of 9 (Page 1 of 2)");
        await expect(page.getByRole('heading', { name: "Backend Development", exact: true })).toBeVisible();
    });

    test("Add Service - Duplicate Name Validation Error", async () => {
        // Try creating a service with an already existing name
        await service.createServiceExpectError({
            ...ADD_NEW_SERVICE,
            name: "Backend Development" // Duplicate visible seeded service
        });

        // Verify the validation error is displayed
        const errorMsg = await service.getErrorMessage();
        expect(errorMsg.length).toBeGreaterThan(0);

        // Cancel/Close the modal
        await service.closeAddModal();
    });

    test("Add Service - Success", async () => {
        // Create new service successfully
        await service.createService(ADD_NEW_SERVICE);

        // Verify it is visible (newly created service should be sorted first since order is desc by serviceId)
        await expect(page.getByRole('heading', { name: ADD_NEW_SERVICE.name, exact: true })).toBeVisible();
    });

    test("Update Service", async () => {
        // Click edit on the newly added service
        await service.clickEdit(ADD_NEW_SERVICE.name);

        // Update description and price
        await service.updateService({
            description: UPDATED_DATA.description,
            price: UPDATED_DATA.price
        });

        // Verify the updated description and price are displayed
        await expect(page.getByText(UPDATED_DATA.description, { exact: true })).toBeVisible();
        await expect(page.getByText(`$${UPDATED_DATA.price.toFixed(2)}`, { exact: true })).toBeVisible();
    });

    test("Delete Service", async () => {
        // Click delete on the updated service
        await service.clickDelete(UPDATED_DATA.name);

        // Confirm the deletion inside the modal
        await service.confirmDeletion();

        // Verify it is no longer visible
        await expect(page.getByRole('heading', { name: UPDATED_DATA.name, exact: true })).toBeHidden();
    });
});
