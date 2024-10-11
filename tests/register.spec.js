import { test, expect } from "playwright-test-coverage";

test("Registration check (normal)", async ({ page }) => {
	await page.route("*/**/api/auth", async (route) => {
		const loginReq = { email: "d@jwt.com", password: "a" };
		const loginRes = {
			user: {
				id: 3,
				name: "Kai Chen",
				email: "d@jwt.com",
				roles: [{ role: "diner" }],
			},
			token: "abcdef",
		};
		expect(route.request().method()).toBe("POST");
		expect(route.request().postDataJSON()).toMatchObject(loginReq);
		await route.fulfill({ json: loginRes });
	});

	await page.goto("/"); // load the DOM router
	await page.goto("/register");
	// create account
	await page.getByPlaceholder("Email address").click();
	await page.getByPlaceholder("Email address").fill("d@jwt.com");
	await page.getByPlaceholder("Email address").press("Tab");
	await page.getByPlaceholder("Password").fill("a");
	await page.getByRole("button", { name: "Register" }).click();
});

test("Registration check (normal)", async ({ page }) => {
	await page.route("*/**/api/auth", async (route) => {
		const loginReq = { email: "d@jwt.com", password: "a" };
		const loginRes = {
			user: {
				id: 3,
				name: "Kai Chen",
				email: "d@jwt.com",
				roles: [{ role: "diner" }],
			},
			token: "abcdef",
		};
		expect(route.request().method()).toBe("POST");
		expect(route.request().postDataJSON()).toMatchObject(loginReq);
		await route.fulfill({ json: loginRes });
	});

	await page.goto("/"); // load the DOM router
	await page.goto("/register");
	// create account
	await page.getByPlaceholder("Email address").click();
	await page.getByPlaceholder("Email address").fill("d@jwt.com");
	await page.getByPlaceholder("Email address").press("Tab");
	await page.getByPlaceholder("Password").fill("a");
	await page.getByRole("button", { name: "Register" }).click();
});
