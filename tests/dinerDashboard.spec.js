import { test, expect } from "playwright-test-coverage";

test("Diner dashboard", async ({ page }) => {
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
		expect(route.request().method()).toBe("PUT");
		expect(route.request().postDataJSON()).toMatchObject(loginReq);
		await route.fulfill({ json: loginRes });
	});
	await page.route("*/**/api/order", async (route) => {
		const orderRes = {
			dinerId: 672,
			orders: [
				{
					id: 992,
					franchiseId: 1,
					storeId: 2,
					date: "2024-10-11T03:44:36.000Z",
					items: [
						{ id: 4628, menuId: 1, description: "Veggie", price: 0.0038 },
						{ id: 4629, menuId: 2, description: "Pepperoni", price: 0.0042 },
					],
				},
			],
			page: 1,
		};
		expect(route.request().method()).toBe("GET");
		await route.fulfill({ json: orderRes });
	});

	//TODO
	// must sign in before test so that browser state has an auth token
	await page.goto("/"); // load the DOM router
	await page.goto("/login");
	// Login
	await page.getByPlaceholder("Email address").click();
	await page.getByPlaceholder("Email address").fill("d@jwt.com");
	await page.getByPlaceholder("Email address").press("Tab");
	await page.getByPlaceholder("Password").fill("a");
	await page.getByRole("button", { name: "Login" }).click();

	//visit dashboard
	await page.goto("/diner-dashboard");
	await expect(page.locator("h2")).toContainText("Your pizza kitchen");

	//check for list of orders
	await expect(page.getByText("992")).toContainText("992");
	await expect(page.getByText("0.008")).toContainText("0.008");
	await expect(page.getByText("2024-10-11T03:44:36.000Z")).toContainText(
		"2024-10-11T03:44:36.000Z",
	);
});
