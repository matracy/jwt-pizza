import { test, expect } from "playwright-test-coverage";

test("Franchise dashboard as non-franchise", async ({ page }) => {
	await page.route("*/**/api/auth", async (route) => {
		const loginRes = {
			user: {
				id: 3,
				name: "Kai Chen",
				email: "d@jwt.com",
				roles: [{ role: "diner" }],
			},
			token: "abcdef",
		};
		expect(route.request().method()).toBe("PUT");
		await route.fulfill({ json: loginRes });
	});

	await page.goto("/"); // load the DOM router
	await page.goto("/login");
	// Login
	await page.getByPlaceholder("Email address").click();
	await page.getByPlaceholder("Email address").fill("d@jwt.com");
	await page.getByPlaceholder("Email address").press("Tab");
	await page.getByPlaceholder("Password").fill("a");
	await page.getByRole("button", { name: "Login" }).click();

	//visit dashboard
	await page.goto("/franchise-dashboard");
	await expect(page.getByText("So you want")).toContainText(
		"So you want a piece of the pie?",
	);

	//check for prompt to sign in as franchise
	await expect(page.getByText("If you are already a franchisee")).toContainText(
		"pleaseloginusing your franchise account",
	); // The lack of spaces is as copied from Firefox.
});
