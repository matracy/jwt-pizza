import { test, expect } from "playwright-test-coverage";

test("log in and out", async ({ page }) => {
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
		if (route.request().method() == "PUT") {
			expect(route.request().postDataJSON()).toMatchObject(loginReq);
			await route.fulfill({ json: loginRes });
		} else {
			await expect(route.request().method()).toBe("DELETE");
		}
	});

	await page.goto("/");
	await page.goto("/login");

	// Login
	await page.getByPlaceholder("Email address").click();
	await page.getByPlaceholder("Email address").fill("d@jwt.com");
	await page.getByPlaceholder("Email address").press("Tab");
	await page.getByPlaceholder("Password").fill("a");
	await page.getByRole("button", { name: "Login" }).click();

	await page.goto("/logout");
	await expect(page.locator("h2")).toContainText("Logout");
});
