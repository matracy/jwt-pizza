import { test, expect } from "playwright-test-coverage";

test("Diner dashboard", async ({ page }) => {
	//load DOM router
	await page.goto("/");

	//navigate to history
	await page.goto("/history");

	//inspect a few things.
	await expect(page.locator("h2")).toContainText("Mama Rucci, my my");
});
