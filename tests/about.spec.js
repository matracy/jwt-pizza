import { test, expect } from "playwright-test-coverage";

test("About exists", async ({ page }) => {
	//load DOM router
	await page.goto("/");

	//navigate to history
	await page.goto("/about");

	//inspect a few things.
	await expect(
		page.getByRole("heading", { name: "The secret sauce" }),
	).toContainText("The secret sauce");
});
