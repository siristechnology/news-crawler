const getBrowser = require('./get-browser')
const puppeteer = require('puppeteer')
const device = puppeteer.devices['iPhone 8']
const htmlToText = require('html-to-text')

module.exports = async function (sourceConfigs, { maxArticlesPerPage, articleUrlLength = 3, headless = true, pageTimeout = 20000 }) {
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
				if (page.url == null) continue

				await browserPage.goto(page.url, { timeout: pageTimeout })

				const linkSelector = page['link-selector'] || page.linkSelector
				if (linkSelector) {
					const articleUrls = await browserPage.$$eval(linkSelector, (elements) => elements.map((element) => element.href))
					for (const articleUrl of articleUrls.slice(0, maxArticlesPerPage)) {
						try {
							if (articleUrl == null) continue

							await browserPage.goto(articleUrl, {
								waitUntil: 'load',
								timeout: pageTimeout,
							})

							const title = await browserPage.$eval(articleSelectors.title, (element) => element.textContent)
							const excerpt = await browserPage.$$eval(articleSelectors.excerpt, (elements) =>
								elements.length > 0 ? elements[0].textContent : null,
							)

							articleSelectors.leadImage = articleSelectors['lead-image']
							const leadImage = await browserPage.$$eval(articleSelectors.leadImage, (elements) =>
								elements.length > 0 ? elements[0].src : null,
							)

							let content = []
							for (const contentSelector of articleSelectors.content) {
								const innerContent = await browserPage.$$eval(contentSelector, (elements) =>
									elements.map((element) => element.innerHTML),
								)
								content.push(innerContent)
							}

							content = htmlToText
								.fromString(content, {
									wordwrap: false,
									ignoreImage: true,
									ignoreHref: true,
									preserveNewlines: false,
								})
								.trim()
								.slice(0, 2000)

							let article = {
								sourceName: source.sourceName,
								category: page.category,
								url: articleUrl,
								articleUrl,
								title,
								shortDescription: excerpt,
								excerpt,
								imageLink: leadImage,
								leadImage,
								isHeadline: true,
								content,
								createdDate: source.crawlTime,
								modifiedDate: source.crawlTime,
								publishedDate: source.crawlTime,
								link: articleUrl,
								topic: page.category,
							}

							articles.push(article)
						} catch (error) {
							console.error('Error while crawling article', error.message, articleUrl)
						}
					}
				} else {
					console.log('Crawling image..')
					const imageSelector = page['image-selector']
					const imageUrls = await browserPage.$$eval(imageSelector, (elements) => elements.map((element) => element.src))
					for (const imageUrl of imageUrls.slice(0, maxArticlesPerPage)) {
						let article = {
							sourceName: source.sourceName,
							category: page.category,
							link: imageUrl,
							shortDescription: imageUrl,
							imageLink: imageUrl,
							title: imageUrl,
							content: imageUrl,
							isHeadline: true,
							topic: page.category,
						}
						articles.push(article)
					}
				}
			}
		}

		await browser.close()

		return articles
	} catch (error) {
		console.error('Error while crawling.', error)
		await browser.close()
		return []
	}
}
