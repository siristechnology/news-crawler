const newsCrawler = require('../article-crawler')

jest.setTimeout(60000)

jest.mock('../get-browser', () => {
	const { stubBrowser, stubPage } = require('./mock-browser.js')
	stubPage.$$eval = async (selector) => {
		const linkSelector = '#wrapper > main > section article > div.teaser > a'
		if (selector === linkSelector) {
			return ['url1', 'url2']
		}

		const excerptSelector = 'main > article .description> p:nth-child(1)'
		if (selector === excerptSelector) {
			return 'excerpt1'
		}
	}
	return () => stubBrowser
})

describe('article-crawler unit test', () => {
	beforeAll(async () => {})

	it('should return excerpt from article', async () => {
		const sourceConfigs = [
			{
				name: 'ekantipur',
				sourceName: 'ekantipur',
				nepaliName: 'कान्तिपुर',
				pages: [
					{
						url: 'https://ekantipur.com/sports',
						category: 'sports',
						'link-selector': '#wrapper > main > section article > div.teaser > a',
					},
				],
				'article-detail-selectors': {
					title: 'main > article > header > h1',
					excerpt: 'main > article .description> p:nth-child(1)',
					'lead-image': '#wrapper main article header figure img',
					content: ['main article div.text-wrap p.description', 'main article div.text-wrap div.description'],
					tags: '',
					'likes-count': 'main > article > header div.total.shareTotal',
				},
			},
		]

		const articles = await newsCrawler(sourceConfigs, { headless: true })

		expect(articles.length).toBeGreaterThan(1)
		expect(articles[0].excerpt.length).toBeGreaterThan(1)
	})
})
