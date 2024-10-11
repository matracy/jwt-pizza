import { test, expect } from "playwright-test-coverage";

test("Admin dashboard as non-admin", async ({ page }) => {
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
	await page.goto("/admin-dashboard");
	await expect(page.locator("h2")).toContainText("Oops");
});

test("Franchise dashboard as a franchise", async ({ page }) => {
	await page.route("*/**/api/auth", async (route) => {
		const loginRes = {
			user: {
				id: 3,
				name: "Kai Chen",
				email: "d@jwt.com",
				roles: [{ role: "admin" }],
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
	await page.goto("/admin-dashboard");
	await expect(page.locator("h2")).toContainText("Mama Ricci's kitchen");

	//check for motivational banner
	await expect(page.getByText("Keep the dough rolling")).toContainText(
		"and the franchises signing up",
	);
});
