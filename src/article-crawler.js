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

				try {
					await browserPage.goto(page.url, { timeout: pageTimeout })
				} catch {
					continue
				}

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
								elements.length > 0 ? (elements[0].src || elements[0].currentSrc) : null,
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

							let articleDate = ''
							if(articleSelectors['date-selector']){
								articleSelectors.articleDate = articleSelectors['date-selector']
								articleDate = await browserPage.$$eval(articleSelectors.articleDate, (elements) =>
									elements.length > 0 ? elements[0].textContent : null,
								)
							}
							
							let audioUrl = ''

							if(articleSelectors['audio-url']){
								articleSelectors.audioUrl = articleSelectors['audio-url']
								audioUrl = await browserPage.$$eval(articleSelectors.audioUrl, (elements) =>
									elements.length > 0 ? (elements[0].href || elements[0].src) : null,
								)
							}

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
								createdDate: articleDate || source.crawlTime,
								modifiedDate: articleDate || source.crawlTime,
								publishedDate: articleDate || source.crawlTime,
								link: articleUrl,
								topic: page.category,
								audioUrl,
								program: page.program,
								programInEnglish: page.programInEnglish
							}

							articles.push(article)
						} catch (error) {
							console.log('Error while crawling article', error.message, articleUrl)
						}
					}
				} else {
					const imageSelector = page['image-selector']
					const dateSelector = page['date-selectors']
					const imageUrls = await browserPage.$$eval(imageSelector, (elements) => elements.map((element) => element.src))
					const dates = await browserPage.$$eval(dateSelector, (elements) => elements.map((element) => element.textContent))
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
							createdDate: dates[imageUrls.indexOf(imageUrl)],
							modifiedDate: dates[imageUrls.indexOf(imageUrl)],
							publishedDate: dates[imageUrls.indexOf(imageUrl)],
						}
						articles.push(article)
					}
				}
			}
		}

		await browser.close()

		return articles
	} catch (error) {
		console.log('Error while crawling.', error)
		await browser.close()
		return []
	}
}
