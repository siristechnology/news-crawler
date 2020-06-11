const getBrowser = require('./get-browser')
const devices = require('puppeteer/DeviceDescriptors')
const device = devices['iPhone 8']

module.exports = async function (sourceConfigs) {
	const browser = await getBrowser()
	const page = await browser.newPage()
	await page.emulate(device)

	let articles = []

	for (const source of sourceConfigs) {
		await page.goto(source.url)

		for (const linkSelector of source['link-selectors']) {
			const articleUrls = await page.$$eval(linkSelector, (elements) => elements.map((element) => element.href))

			articleUrls.forEach((url) => {
				articles.push({
					source: source.name,
					category: source.category,
					url: url,
				})
			})
		}
	}

	browser.close()

	return articles
}
