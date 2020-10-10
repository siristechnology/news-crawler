const getBrowser = require('../get-browser')
const puppeteer = require('puppeteer')
const device = puppeteer.devices['iPhone 8']
const newsCrawler = require('../index')

jest.setTimeout(60000)

describe('puppeteer', () => {
	it('should return null if element is not found', async () => {
		const browser = await getBrowser({ headless: true })
		const browserPage = (await browser.pages())[0]
		await browserPage.setDefaultNavigationTimeout(0)
		await browserPage.emulate(device)

		await browserPage.goto('https://merolagani.com/NewsDetail.aspx?newsID=64915')

		const elementSelector = '.non-existent-selector'

		const content = await browserPage.$$eval(elementSelector, (elements) => (elements.length > 0 ? elements[0].textContent : null))
		expect(content).toBeNull()
	})
})

describe('article-crawler', () => {
	it('should return null if article excerpt or image is not found', async () => {
		const sourceConfigs = [
			{
				name: 'Mero Lagani',
				sourceName: 'Mero Lagani',
				nepaliName: 'मेरो लगानी',
				logoLink: '/assets/logos/merolagani.png',
				weight: 50,
				pages: [
					{
						url: 'https://merolagani.com/NewsList.aspx?id=6&type=latest',
						category: 'share',
						'link-selector': '.container .row h4.media-title > a',
					},
				],
				'article-detail-selectors': {
					title: '.media-body .media-title.newsTitle',
					excerpt: '.non-existent-selector',
					content: ['#ctl00_ContentPlaceHolder1_newsOverview > p > span', '#ctl00_ContentPlaceHolder1_newsDetail'],
				},
			},
		]

		const articles = await newsCrawler(sourceConfigs, { headless: true })

		console.log('printing articles', articles)

		expect(articles.length).toBeGreaterThan(1)
		expect(articles[0].excerpt).toBeNull()
		expect(articles[0].leadImage).toBeNull()
	})
})
