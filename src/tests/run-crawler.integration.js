const newsCrawler = require('../index')

jest.setTimeout(60000)

describe('link-crawler', () => {

	it('should return links using custom source-config', async () => {
		const sourceConfigs = [
			{
				name: 'ekantipur',
				pages: [
					{
						url: 'https://ekantipur.com/sports',
						category: 'sports',
						'link-selector': '#wrapper > main > section article > div.teaser > a',
					},
				],
				'article-detail-selectors': {
					title: 'main > article > header > h1',
					excerpt: 'article .text-wrap > h2',
					'lead-image': '#wrapper main article header figure img',
					content: ['main article div.text-wrap p.description', 'main article div.text-wrap div.description'],
					tags: '',
					'likes-count': 'main > article > header div.total.shareTotal',
				},
			},
		]

		const articles = await newsCrawler(sourceConfigs)

		console.log('printing articles', articles)

		expect(articles.length).toBeGreaterThan(1)
	})
})
