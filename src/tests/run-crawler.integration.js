const newsCrawler = require('../index')

jest.setTimeout(60000)

describe('link-crawler', () => {
	it('should return links using custom source-config', async () => {
		const sourceConfigs = [
			{
				name: 'ekantipur',
				sourceName: 'ekantipur',
				nepaliName: 'कान्तिपुर',
				logoLink: '/assets/logos/kantipur.jpg',
				weight: 50,
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
			{
				name: 'Baahrakhari',
				sourceName: 'Baahrakhari',
				nepaliName: 'बाह्रखरी',
				logoLink: '/assets/logos/baahrakhari.png',
				weight: 50,
				pages: [
					{
						url: 'https://baahrakhari.com/news-article/65/Cartoon',
						category: 'cartoon',
						'image-selector': 'div.row.page-news-list > div > div > figure > img',
					},
				],
			},
		]

		const articles = await newsCrawler(sourceConfigs, { headless: true })

		console.log('printing articles', articles)

		expect(articles.length).toBeGreaterThan(1)
		expect(articles[0].excerpt.length).toBeGreaterThan(1)
	})
})
