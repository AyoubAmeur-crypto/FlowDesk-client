import { expect, Locator, Page } from "@playwright/test";

export class Category {


    page: Page
    addCategoryButton: Locator
    addCategoryInput: Locator
    categoryModal: Locator
    submitCategoryButton: Locator
    updateCategoryButton: Locator
    deleteModal: Locator
    deleteCategoryButton: Locator
    searchInput: Locator
    previousPageButton: Locator
    nextPageButton: Locator
    paginationText: Locator
    duplicateError: Locator




    constructor(page: Page) {

        this.page = page,
            this.addCategoryButton = page.getByRole("button", {
                name: "Add Category"
            })
        this.addCategoryInput = page.getByRole('textbox', { name: 'Category Name*' })
        this.categoryModal = page.getByTestId("modal")
        this.submitCategoryButton = page.getByRole("button", {
            name: "save"
        })
        this.updateCategoryButton = page.getByRole("button", {
            name: "Edit row"
        })
        this.deleteModal = page.getByRole('heading', { name: 'Delete Category' })
        this.deleteCategoryButton = page.getByRole('button', { name: 'Delete row' })
        this.searchInput = page.getByPlaceholder('Search categories...')
        this.previousPageButton = page.getByRole('button', { name: 'Previous' })
        this.nextPageButton = page.getByRole('button', { name: 'Next' })
        this.paginationText = page.locator('p.tabular-nums')
        this.duplicateError = page.locator('form').getByText(/already exists/i)

    }


    async goto() {

        await this.page.goto("/admin/dashboard/categories")
        await expect(this.page.getByRole("button", {
            name: "Add Category"
        })).toBeVisible()
    }


    row(title: string) {
        return this.page.getByRole('row').filter({ hasText: title })
    }

    async expectRowVisible(title: string) {
        await expect(this.row(title)).toBeVisible()
    }

    async expectRowHidden(title: string) {
        await expect(this.row(title)).toBeHidden()
    }

    async click(locator: Locator) {
        await locator.evaluate((element) => (element as HTMLElement).click())
    }

    async fill(locator: Locator, value: string) {
        await locator.evaluate((input, inputValue) => {
            const element = input as HTMLInputElement
            const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
            setter?.call(element, inputValue)
            element.dispatchEvent(new Event('input', { bubbles: true }))
        }, value)
    }



    async AddNewCategary(title: string) {

        await this.click(this.addCategoryButton)
        await expect(this.categoryModal).toBeVisible()
        await this.fill(this.addCategoryInput, title)
        await this.click(this.page.getByRole("button",{
            name:"Save"
        }))
        await expect(this.categoryModal).toBeHidden()
        await this.expectRowVisible(title)
    }

    async AddNewCategaryExpectError(title: string) {

        await this.click(this.addCategoryButton)
        await expect(this.categoryModal).toBeVisible()
        await this.fill(this.addCategoryInput, title)
        await this.click(this.page.getByRole("button", {
            name: "Save"
        }))
        await expect(this.duplicateError).toBeVisible()
    }

    async closeModal() {
        await this.click(this.page.getByRole('button', { name: 'Cancel' }))
        await expect(this.categoryModal).toBeHidden()
    }
    async deleteCategory(title: string) {

        const row = this.row(title)
        await expect(row).toBeVisible()
        await row.hover()
        await this.click(row.locator('button[title="Delete row"]'));
        await expect(this.deleteModal).toBeVisible()
        await this.click(this.page.getByRole("button", {
            name: "Delete"
        }))
        await expect(this.deleteModal).toBeHidden()
        await expect(row).toBeHidden()




    }

    async UpdateCategory(newtitle: string, title: string) {


        const row = this.row(title)

        await expect(row).toBeVisible()
        await row.hover()
        await this.click(row.locator('button[title="Edit row"]'))
        await expect(this.categoryModal).toBeVisible()
        await this.fill(this.addCategoryInput, newtitle)
        await this.click(this.page.getByRole("button", {
            name: "update"
        }))
        await expect(this.categoryModal).toBeHidden()
        await this.expectRowVisible(newtitle)






    }

    async search(query: string) {
        await this.fill(this.searchInput, query)
    }

    async clearSearch() {
        await this.search('')
    }

    async goToNextPage() {
        await this.nextPageButton.evaluate((button) => (button as HTMLButtonElement).click())
        await expect(this.paginationText).toContainText('Showing 7-8 of 8')
    }

    async goToPreviousPage() {
        await this.previousPageButton.evaluate((button) => (button as HTMLButtonElement).click())
        await expect(this.paginationText).toContainText('Showing 1-6 of 8')
    }

    async getPaginationInfo() {
        return (await this.paginationText.textContent()) || ''
    }
}
