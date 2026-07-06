import { expect, Locator, Page } from "@playwright/test";
import { ServiceType } from "./type";

export class Service {
    page: Page;
    addServiceButton: Locator;
    searchInput: Locator;
    addServiceModal: Locator;
    updateServiceModal: Locator;
    submitServiceButton: Locator;
    updateServiceButton: Locator;
    serviceName: Locator;
    serviceCategory: Locator;
    serviceDescription: Locator;
    servicePrice: Locator;
    serviceImage: Locator;
    pointsButton: Locator;
    deleteServiceButton: Locator;
    deleteModal: Locator;

    // New Locators
    clearSearchButton: Locator;
    allCategoryFilter: Locator;
    prevPageButton: Locator;
    nextPageButton: Locator;
    paginationText: Locator;
    errorBanner: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addServiceButton = page.getByRole('button', { name: 'Add Service' });
        this.searchInput = page.getByPlaceholder('Search services...');
        this.addServiceModal = page.getByRole('heading', { name: 'Add Service' });
        this.updateServiceModal = page.getByRole('heading', { name: 'Update Service' });
        this.submitServiceButton = page.getByRole('button', { name: 'Save' });
        this.updateServiceButton = page.getByRole('button', { name: 'Update', exact: true });
        this.serviceName = page.locator('#serviceName');
        this.serviceCategory = page.locator('#category');
        this.serviceDescription = page.locator('#serviceDescription');
        this.servicePrice = page.locator('#servicePrice');
        this.serviceImage = page.locator('input[type="file"]');
        this.pointsButton = page.locator('.dropdown-container button');
        this.deleteServiceButton = page.getByRole('button', { name: 'Delete' });
        this.deleteModal = page.getByRole('heading', { name: 'Delete Service' });

        // Initialize new locators
        this.clearSearchButton = page.locator('.relative button:has(svg)');
        this.allCategoryFilter = page.getByRole('button', { name: 'All', exact: true });
        this.prevPageButton = page.getByRole('button', { name: 'Previous' });
        this.nextPageButton = page.getByRole('button', { name: 'Next' });
        this.paginationText = page.locator('p.tabular-nums');
        this.errorBanner = page.locator('form').getByText(/already exists/i);
    }

    async gotoSerive() {
        await this.page.goto("/admin/dashboard/services");
        await expect(this.page.getByRole('heading', { name: 'Services', exact: true })).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Add Service' })).toBeVisible();
    }

    async createService(seededService: ServiceType) {
        await this.addServiceButton.click();
        await expect(this.addServiceModal).toBeVisible();
        await this.serviceName.fill(seededService.name);
        await this.serviceDescription.fill(seededService.description);
        
        await this.serviceCategory.fill(seededService.category);
        await this.page.locator('form').getByRole('button', { name: seededService.category, exact: true }).click();
        
        await this.serviceImage.setInputFiles('tests/e2e/admin/images/Artboard 5.png');
        await this.servicePrice.fill(seededService.price.toString());
        await this.submitServiceButton.click();
        await expect(this.addServiceModal).toBeHidden({ timeout: 15000 });
    }

    async createServiceExpectError(seededService: ServiceType) {
        await this.addServiceButton.click();
        await expect(this.addServiceModal).toBeVisible();
        await this.serviceName.fill(seededService.name);
        await this.serviceDescription.fill(seededService.description);
        
        await this.serviceCategory.fill(seededService.category);
        await this.page.locator('form').getByRole('button', { name: seededService.category, exact: true }).click();
        
        await this.serviceImage.setInputFiles('tests/e2e/admin/images/Artboard 5.png');
        await this.servicePrice.fill(seededService.price.toString());
        await this.submitServiceButton.click();
        await expect(this.errorBanner).toBeVisible();
    }

    async closeAddModal() {
        // Locate the cancel button inside the slide-in form
        await this.page.locator('form').getByRole('button', { name: 'Cancel' }).click();
        await expect(this.addServiceModal).toBeHidden();
    }

    async getErrorMessage(): Promise<string> {
        await expect(this.errorBanner).toBeVisible();
        return (await this.errorBanner.textContent()) || '';
    }

    async search(query: string) {
        await this.searchInput.fill(query);
        await this.page.waitForTimeout(500);
    }

    async clearSearch() {
        await this.searchInput.fill('');
        await this.page.waitForTimeout(500);
    }

    async filterByCategory(categoryName: string) {
        await this.page.getByRole('button', { name: categoryName, exact: true }).click();
        await this.page.waitForTimeout(500);
    }

    async openDropdown(serviceName: string) {
        const card = this.page.locator('.rounded-md.shadow-sm.border').filter({ hasText: serviceName });
        await card.scrollIntoViewIfNeeded();
        const dropdownBtn = card.locator('.dropdown-container button');
        await dropdownBtn.click();
    }

    async clickEdit(serviceName: string) {
        await this.openDropdown(serviceName);
        const editBtn = this.page.locator('.dropdown-container').getByRole('button', { name: 'Edit', exact: true });
        await editBtn.click();
        await expect(this.updateServiceModal).toBeVisible();
    }

    async clickDelete(serviceName: string) {
        await this.openDropdown(serviceName);
        const deleteBtn = this.page.locator('.dropdown-container').getByRole('button', { name: 'Delete', exact: true });
        await deleteBtn.click();
        await expect(this.deleteModal).toBeVisible();
    }

    async updateService(updatedData: Partial<ServiceType>) {
        if (updatedData.description) {
            await this.serviceDescription.fill(updatedData.description);
        }
        if (updatedData.price !== undefined) {
            await this.servicePrice.fill(updatedData.price.toString());
        }
        if (updatedData.name) {
            await this.serviceName.fill(updatedData.name);
        }
        await this.updateServiceButton.click();
        await expect(this.updateServiceModal).toBeHidden();
    }

    async confirmDeletion() {
        const modalDeleteBtn = this.page.locator('div.fixed').getByRole('button', { name: 'Delete', exact: true });
        await modalDeleteBtn.click();
        await expect(this.deleteModal).toBeHidden();
    }

    async goToNextPage() {
        await this.nextPageButton.click();
        await this.page.waitForTimeout(500);
    }

    async goToPreviousPage() {
        await this.prevPageButton.click();
        await this.page.waitForTimeout(500);
    }

    async getPaginationInfo(): Promise<string> {
        return (await this.paginationText.textContent()) || '';
    }
}
