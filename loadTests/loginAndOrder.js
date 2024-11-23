import { sleep, check, group, fail } from "k6";
import http from "k6/http";

var vars = {};

export const options = {
	cloud: {
		distribution: {
			"amazon:us:ashburn": { loadZone: "amazon:us:ashburn", percent: 100 },
		},
		apm: [],
	},
	thresholds: {},
	scenarios: {
		Scenario_1: {
			executor: "ramping-vus",
			gracefulStop: "30s",
			stages: [
				{ target: 4, duration: "30s" },
				{ target: 4, duration: "1m" },
				{ target: 1, duration: "30s" },
				{ target: 0, duration: "30s" },
			],
			gracefulRampDown: "30s",
			exec: "scenario_1",
		},
	},
};

export function scenario_1() {
	let response;

	group("Home page - https://jwt-pizza.someplaceto.click/", function () {
		// Load home page
		response = http.get("https://jwt-pizza.someplaceto.click/", {
			headers: {
				accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
				"accept-encoding": "gzip, deflate, br, zstd",
				"accept-language": "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7",
				"cache-control": "max-age=0",
				dnt: "1",
				"if-modified-since": "Wed, 30 Oct 2024 20:26:25 GMT",
				"if-none-match": '"ad77b0ca73f6427ba411a3ed3bf1ba74"',
				priority: "u=0, i",
				"sec-ch-ua":
					'"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"Linux"',
				"sec-fetch-dest": "document",
				"sec-fetch-mode": "navigate",
				"sec-fetch-site": "same-origin",
				"sec-fetch-user": "?1",
				"upgrade-insecure-requests": "1",
			},
		});
		sleep(1);

		// Login
		response = http.put(
			"https://pizza-service.someplaceto.click/api/auth",
			'{"email":"asdf@asdf.asd","password":"asdf"}',
			{
				headers: {
					accept: "*/*",
					"accept-encoding": "gzip, deflate, br, zstd",
					"accept-language": "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7",
					"content-type": "application/json",
					dnt: "1",
					origin: "https://jwt-pizza.someplaceto.click",
					priority: "u=1, i",
					"sec-ch-ua":
						'"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
					"sec-ch-ua-mobile": "?0",
					"sec-ch-ua-platform": '"Linux"',
					"sec-fetch-dest": "empty",
					"sec-fetch-mode": "cors",
					"sec-fetch-site": "same-site",
				},
			},
		);
		if (
			!check(response, {
				"status equals 200": (response) => response.status.toString() === "200",
			})
		) {
			console.log(response.body);
			fail("Login was *not* 200");
		}

		vars["token1"] = response.json()["token"];

		// Get menu
		response = http.get(
			"https://pizza-service.someplaceto.click/api/order/menu",
			{
				headers: {
					accept: "*/*",
					"accept-encoding": "gzip, deflate, br, zstd",
					"accept-language": "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7",
					"content-type": "application/json",
					dnt: "1",
					"if-none-match": 'W/"1fc-cgG/aqJmHhElGCplQPSmgl2Gwk0"',
					origin: "https://jwt-pizza.someplaceto.click",
					priority: "u=1, i",
					"sec-ch-ua":
						'"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
					"sec-ch-ua-mobile": "?0",
					"sec-ch-ua-platform": '"Linux"',
					"sec-fetch-dest": "empty",
					"sec-fetch-mode": "cors",
					"sec-fetch-site": "same-site",
				},
			},
		);

		// Get franchises
		response = http.get(
			"https://pizza-service.someplaceto.click/api/franchise",
			{
				headers: {
					accept: "*/*",
					"accept-encoding": "gzip, deflate, br, zstd",
					"accept-language": "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7",
					"content-type": "application/json",
					dnt: "1",
					"if-none-match": 'W/"56-Fy3Hb9J2d/ANDBMVG44AQp8cSV0"',
					origin: "https://jwt-pizza.someplaceto.click",
					priority: "u=1, i",
					"sec-ch-ua":
						'"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
					"sec-ch-ua-mobile": "?0",
					"sec-ch-ua-platform": '"Linux"',
					"sec-fetch-dest": "empty",
					"sec-fetch-mode": "cors",
					"sec-fetch-site": "same-site",
				},
			},
		);
		sleep(1);

		// Place an order
		response = http.put(
			"https://pizza-service.someplaceto.click/api/order",
			'{"items":[{"menuId":1,"description":"Veggie","price":0.0038}],"storeId":"1","franchiseId":1}',
			{
				headers: {
					accept: "*/*",
					"accept-encoding": "gzip, deflate, br, zstd",
					"accept-language": "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7",
					"content-type": "application/json",
					dnt: "1",
					origin: "https://jwt-pizza.someplaceto.click",
					priority: "u=1, i",
					"sec-ch-ua":
						'"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
					"sec-ch-ua-mobile": "?0",
					"sec-ch-ua-platform": '"Linux"',
					"sec-fetch-dest": "empty",
					"sec-fetch-mode": "cors",
					"sec-fetch-site": "same-site",
					Authorization: `Bearer ${vars["token1"]}`,
				},
			},
		);
		if (
			!check(response, {
				"status starts with 2": (response) =>
					response.status.toString().startsWith("2"),
			})
		) {
			console.log(response.body);
			fail("Placing an order failed");
		}
		vars["jwt"] = response.json()["jwt"];
		sleep(1);

		// Verify order
		response = http.post(
			"https://pizza-factory.cs329.click/api/order/verify",
			`{"jwt":"${vars["jwt"]}"}`,
			{
				headers: {
					accept: "*/*",
					"accept-encoding": "gzip, deflate, br, zstd",
					"accept-language": "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7",
					"content-type": "application/json",
					dnt: "1",
					origin: "https://jwt-pizza.someplaceto.click",
					priority: "u=1, i",
					"sec-ch-ua":
						'"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
					"sec-ch-ua-mobile": "?0",
					"sec-ch-ua-platform": '"Linux"',
					"sec-fetch-dest": "empty",
					"sec-fetch-mode": "cors",
					"sec-fetch-site": "cross-site",
				},
			},
		);
	});
}
