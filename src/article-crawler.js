const getBrowser = require('./get-browser')
const devices = require('puppeteer/DeviceDescriptors')
const device = devices['iPhone 8']
const htmlToText = require('html-to-text')

module.exports = async function (sourceConfigs, articleUrlLength) {
	const browser = await getBrowser()
	const browserPage = await browser.newPage()
	await browserPage.setDefaultNavigationTimeout(0);
	await browserPage.emulate(device)
	articleUrlLength = articleUrlLength || 3

	let articles = []

	for (const source of sourceConfigs) {
		const articleSelectors = source['article-detail-selectors']

		for (const page of source.pages) {
			await browserPage.goto(page.url)

			const linkSelector = page['link-selector']
			const articleUrls = await browserPage.$$eval(linkSelector, (elements) => elements.map((element) => element.href))
			for (const articleUrl of articleUrls.slice(0, articleUrlLength)) {
				try{
					await browserPage.goto(articleUrl,{
						waitUntil: 'load',
						// Remove the timeout
						timeout: 0
					})

					const title = await browserPage.$eval(articleSelectors.title, (element) => element.textContent)
					const excerpt = await browserPage.$eval(articleSelectors.excerpt, (element) => element.textContent)
					const leadImage = await browserPage.$eval(articleSelectors['lead-image'], (element) => element.src)
					let content = []
					for (const contentSelector of articleSelectors.content) {
						const innerContent = await browserPage.$$eval(contentSelector, (elements) => elements.map((element) => element.innerHTML))
						content.push(innerContent)
					}

					content = htmlToText
						.fromString(content, {
							wordwrap: false,
							ignoreImage: true,
							ignoreHref: true,
							ignoreImage: true,
							preserveNewlines: false,
						})
						.trim()
						.slice(0, 2000)

					let article = {
						source: source.sourceId,
						category: page.category,
						url: articleUrl,
						title,
						shortDescription: excerpt,
						imageLink: leadImage,
						isHeadline: true,
						content: content,
						createdDate: source.crawlTime,
						modifiedDate: source.crawlTime,
						publishedDate: source.crawlTime,
						link: articleUrl,
						topic: page.category
					}

					articles.push(article)

				}catch(error){
					console.log("error produced article crawl",error.message, articleUrl)	
				}
			}
		}
	}

	browser.close()

	return articles
}
