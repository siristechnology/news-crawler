const newsCrawler = require('../index')

jest.setTimeout(60000)

describe('link-crawler', () => {

	it('should return links using custom source-config', async () => {
		const sourceConfigs = [
		  {
			pages: [
				{
					url: 'https://ekantipur.com/sports',
					category: 'sports',
					'link-selector': '#wrapper > main > section article > div.teaser > a',	
				}
			],
			'article-detail-selectors': {
			  title: 'main > article > header > h1',
			  excerpt: 'main > article .description> p:nth-child(1)',
			  'lead-image': '#wrapper main article header figure img',
			  content: ['main article div.text-wrap p.description', 'main article div.text-wrap div.description'],
			  tags: '',
			  'likes-count': 'main > article > header div.total.shareTotal',
			  LINK_SELECTOR: '#wrapper > main > section article > div.teaser > a'
			},
			sourceId: "5f44b866eb376452f1894531",
			logoLink: '/assets/logos/kantipur.jpg',
			crawlTime: "2020-08-26T03:49:04.030Z"
		  }
		]

		const articles = await newsCrawler(sourceConfigs, 3)

		expect(articles.length).toBeGreaterThan(1)
	})
})
