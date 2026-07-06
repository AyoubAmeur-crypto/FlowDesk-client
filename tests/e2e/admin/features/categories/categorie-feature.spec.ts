import { test, expect, Page } from '@playwright/test';
import { Category } from './categorie.page';
import { executeSqlFile } from '../../../fixtures/db';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


test.describe.serial("Category Feature", () => {


    let page: Page

    let categoryPage: Category

    const SEED = {

        WEB_DEV: 'Web Development',
        DESIGN: 'Design & Creative',
        MARKETING: 'Marketing & Communication',
        WRITING: 'Writing & Translation',
        BUSINESS: 'Business Consulting',
        DATA: 'Data & Analytics',
        VIDEO: 'Video & Animation',
        AI: 'AI Automation',

    }

    const NEW_TITLE = "New Category"
    const UPDATED_TITLE = "Updated Category"



    test.beforeAll(async ({ browser }) => {


        await executeSqlFile(path.resolve(__dirname, 'categorie-reset.sql'));
        await executeSqlFile(path.resolve(__dirname, 'categorie-seed.sql'));



        const context = await browser.newContext({
            storageState: "playwright/.auth/user.json",
            recordVideo: {
                dir: "test-results/videos",
            },
        })

        page = await context.newPage()

    })

    test.beforeEach(async () => {

        categoryPage = new Category(page)

        await categoryPage.goto()


    })

    test.afterAll(async () => {



        await executeSqlFile(path.resolve(__dirname, 'categorie-reset.sql'));





        await page.context().close()
    })


    test("Check Seeded Elements", async () => {


        await categoryPage.expectRowVisible(SEED.AI)
        await categoryPage.expectRowVisible(SEED.VIDEO)
        await categoryPage.expectRowVisible(SEED.DATA)
        await categoryPage.expectRowVisible(SEED.MARKETING)
    })

    test("Search Categories", async () => {

        await categoryPage.search("Data")

        await categoryPage.expectRowVisible(SEED.DATA)
        await categoryPage.expectRowHidden(SEED.AI)

        await categoryPage.clearSearch()
        await categoryPage.expectRowVisible(SEED.AI)
    })

    test("Pagination Navigation", async () => {

        let paginationText = await categoryPage.getPaginationInfo()
        expect(paginationText).toContain("Showing 1-6 of 8")

        await categoryPage.goToNextPage()

        await categoryPage.expectRowVisible(SEED.DESIGN)
        await categoryPage.expectRowVisible(SEED.WEB_DEV)
        await categoryPage.expectRowHidden(SEED.AI)

        await categoryPage.goToPreviousPage()

        paginationText = await categoryPage.getPaginationInfo()
        expect(paginationText).toContain("Showing 1-6 of 8")
        await categoryPage.expectRowVisible(SEED.AI)
    })

    test("Add Category - Duplicate Name Validation Error", async () => {

        await categoryPage.AddNewCategaryExpectError(SEED.AI)

        const errorMessage = await categoryPage.duplicateError.textContent()
        expect(errorMessage?.length).toBeGreaterThan(0)

        await categoryPage.closeModal()
    })

    test("Add Category - Success", async () => {

        await categoryPage.AddNewCategary(NEW_TITLE)

        await categoryPage.expectRowVisible(NEW_TITLE)
    })

    test("Update Category", async () => {

        await categoryPage.UpdateCategory(UPDATED_TITLE, NEW_TITLE)

        await categoryPage.expectRowVisible(UPDATED_TITLE)
    })

    test("Delete Category", async () => {

        await categoryPage.deleteCategory(UPDATED_TITLE)

        await categoryPage.expectRowHidden(UPDATED_TITLE)
    })
})

