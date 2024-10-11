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

test("Franchise dashboard as a franchise", async ({ page }) => {
	const franchiseName = "Tests R Us";
	await page.route("*/**/api/auth", async (route) => {
		const loginRes = {
			user: {
				id: 3,
				name: "Kai Chen",
				email: "d@jwt.com",
				roles: [
					{
						objectid: 2,
						role: "franchisee",
					},
				],
			},
			token: "abcdef",
		};
		expect(route.request().method()).toBe("PUT");
		await route.fulfill({ json: loginRes });
	});

	await page.route("*/**/api/franchise/3", async (route) => {
		const franchiseResult = [
			{
				id: 2,
				name: franchiseName,
				admins: [
					{
						id: 3,
						name: "Kai Chen",
						email: "d@jwt.com",
					},
				],
				stores: [
					{
						id: 4,
						name: "SLC",
						totalRevenue: 0,
					},
				],
			},
		];
		expect(route.request().method()).toBe("GET");
		await route.fulfill({ json: franchiseResult });
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
	await page
		.getByLabel("Global")
		.getByRole("link", { name: "Franchise" })
		.click();
	await expect(page.locator("h2")).toContainText(franchiseName);

	//check for motivational banner
	await expect(page.getByText("Everything you need")).toContainText(
		"to run an JWT Pizza franchise. Your gateway to success",
	);
});

test("Open and close store", async ({ page }) => {
	const franchiseName = "Tests R Us";
	const testStore = {
		id: 4,
		name: "SLC",
		totalRevenue: 0,
	};

	//franchise user
	await page.route("*/**/api/auth", async (route) => {
		const loginRes = {
			user: {
				id: 3,
				name: "Kai Chen",
				email: "d@jwt.com",
				roles: [
					{
						objectid: 2,
						role: "franchisee",
					},
				],
			},
			token: "abcdef",
		};
		expect(route.request().method()).toBe("PUT");
		await route.fulfill({ json: loginRes });
	});

	//franchise exists - complete with store.
	await page.route("*/**/api/franchise/3", async (route) => {
		const franchiseResult = [
			{
				id: 2,
				name: franchiseName,
				admins: [
					{
						id: 3,
						name: "Kai Chen",
						email: "d@jwt.com",
					},
				],
				stores: [testStore],
			},
		];
		expect(route.request().method()).toBe("GET");
		await route.fulfill({ json: franchiseResult });
	});

	//store created
	await page.route("*/**/api/franchise/3/store", async (route) => {
		expect(route.request().method()).toBe("POST");
		await route.fulfill({ json: testStore });
	});

	//store deleted
	await page.route("*/**/api/franchise/3/Store/4", async (route) => {
		const response = {
			message: "store deleted",
		};
		expect(route.request().method()).toBe("DELETE");
		await route.fulfill({ json: response });
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
	await page
		.getByLabel("Global")
		.getByRole("link", { name: "Franchise" })
		.click();
	await expect(page.locator("h2")).toContainText(franchiseName);

	//check for motivational banner
	await expect(page.getByText("Everything you need")).toContainText(
		"to run an JWT Pizza franchise. Your gateway to success",
	);

	//confirm that store exists
	await expect(page.getByText(testStore.name)).toContainText(testStore.name);
	//click the close store button
	await page.getByRole("button", { name: "Close" }).click();
	//verify that we made it to the confirmation page
	await expect(page.locator("h2")).toContainText("Sorry to see you go");
	//confirm store closing
	await page.getByRole("button", { name: "Close" }).click();
	//check that we made it back to the franchise dashboard
	await page
		.getByLabel("Global")
		.getByRole("link", { name: "Franchise" })
		.click();
	await expect(page.locator("h2")).toContainText(franchiseName);
	//open a new store
	await page.getByRole("button", { name: "Create store" }).click();
	//verify that we made it to the creation page
	await expect(page.locator("h2")).toContainText("Create store");
	//fill in details for store
	await page.getByPlaceholder("store name").click();
	await page.getByPlaceholder("store name").fill(testStore.name);
	await page.getByPlaceholder("store name").press("Tab");
	//create store
	await page.getByRole("button", { name: "Create" }).click();
});
