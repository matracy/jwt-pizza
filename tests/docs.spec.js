import { test, expect } from "playwright-test-coverage";

test("Check docs page", async ({ page }) => {
	await page.goto("/docs");
	expect(page.locator("h2")).toContainText("JWT Pizza API");
});
