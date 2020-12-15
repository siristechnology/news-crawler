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

		const imageSelector = "div.select-cartoon > div > div > figure > a > img"
		if(selector === imageSelector){
			return ['imageUrl1', 'imageUrl2']
		}

		const dateSelectors = "div.select-cartoon > div > div > figure > a > small"
		if(selector === dateSelectors){
			return ['date1', 'date2', 'date3']
		}

	}

	stubPage.$eval = async (selector) => {
		const titleSelector = 'main > article > header > h1'
		if (selector === titleSelector) {
			return 'title1'
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
			}
		]

		const articles = await newsCrawler(sourceConfigs, { headless: true })

		expect(articles.length).toBe(2)
		expect(articles[0].title).toBe('title1')
		expect(articles[0].excerpt).toBe('excerpt1')
	})

	it('should return image link from article', async () => {
		const sourceConfigs = [
			{
				"name": "Annnapurna Post",
				"sourceName": "Annapurna Post",
				"nepaliName": "अन्‍नपूर्ण पोस्ट्",
				"logoLink": "/assets/logos/annapurna-1.png",
				"weight": 10,
				"pages": [
					{
						"url": "http://annapurnapost.com/cartoon",
						"category": "cartoon",
						"image-selector": "div.select-cartoon > div > div > figure > a > img",
						"date-selectors": "div.select-cartoon > div > div > figure > a > small"
					}
				]
			}
		]

		const articles = await newsCrawler(sourceConfigs, { headless: true })

		expect(articles.length).toBe(2)
		expect(articles[0].imageLink).toBe('imageUrl1')
	})
})
