const getBrowser = require('./get-browser')
const devices = require('puppeteer/DeviceDescriptors')
const device = devices['iPhone 8']

module.exports = async function (sourceConfigs) {
	const browser = await getBrowser()
	const browserPage = await browser.newPage()
	await browserPage.emulate(device)

	let articles = []

	for (const source of sourceConfigs) {
		const articleSelectors = source['article-detail-selectors']

		for (const page of source.pages) {
			await browserPage.goto(page.url)

			const linkSelector = page['link-selector']
			const articleUrls = await browserPage.$$eval(linkSelector, (elements) => elements.map((element) => element.href))

			for (const articleUrl of articleUrls) {
				await browserPage.goto(articleUrl)

				const title = await browserPage.$eval(articleSelectors.title, (element) => element.textContent)
				// const excerpt = await browserPage.$eval(articleSelectors.excerpt, (element) => element.textContent)
				const leadImage = await browserPage.$eval(articleSelectors['lead-image'], (element) => element.src)

				let content = []
				for (const contentSelector of articleSelectors.content) {
					const innerContent = await browserPage.$$eval(contentSelector, (elements) => elements.map((element) => element.innerHTML))
					content.push(innerContent)
				}

				// const likesCount = await browserPage.$eval(articleSelectors['likes-count'], (element) => parseInt(element.textContent))

				articles.push({
					source: source.name,
					category: page.category,
					url: articleUrl,
					title: title,
					// excerpt: excerpt,
					leadImage: leadImage,
					content: content,
					// likesCount: likesCount,
				})
			}
		}
	}

	browser.close()

	return articles
}
