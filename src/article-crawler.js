const getBrowser = require('./get-browser')
const puppeteer = require('puppeteer')
const device = puppeteer.devices['iPhone 8']
const htmlToText = require('html-to-text')

module.exports = async function (sourceConfigs, { maxArticlesPerPage, articleUrlLength = 3, headless = true }) {
	const browser = await getBrowser({ headless })
	const browserPage = (await browser.pages())[0]
	maxArticlesPerPage = maxArticlesPerPage || articleUrlLength

	try {
		await browserPage.setDefaultNavigationTimeout(0)
		await browserPage.emulate(device)

		let articles = []

		for (const source of sourceConfigs) {
			const articleSelectors = source['article-detail-selectors']

			for (const page of source.pages) {
				await browserPage.goto(page.url)

				const linkSelector = page['link-selector']
				if(linkSelector){
					const articleUrls = await browserPage.$$eval(linkSelector, (elements) => elements.map((element) => element.href))
					for (const articleUrl of articleUrls.slice(0, maxArticlesPerPage)) {
						try {
							await browserPage.goto(articleUrl, {
								waitUntil: 'load',
								// Remove the timeout
								timeout: 0,
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
								sourceName: source.sourceName,
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
								topic: page.category,
							}

							articles.push(article)
						} catch (error) {
							console.log('error produced article crawl', error.message, articleUrl)
						}
					}
				}else{
					console.log("Crawling image..")
					const imageSelector = page['image-selector']
					const imageUrls = await browserPage.$$eval(imageSelector, (elements) => elements.map((element) => element.src))
					for(const imageUrl of imageUrls.slice(0, maxArticlesPerPage)){
						let article = {
							sourceName: source.sourceName,
							category: page.category,
							link: imageUrl,
							imageLink: imageUrl,
							title: imageUrl,
							content: imageUrl,
							isHeadline: true,
							topic: page.category
						}
						articles.push(article)
					}
				}
			}
		}

		await browser.close()

		return articles
	} catch {
		await browser.close()
		return []
	}
}
