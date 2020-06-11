const newsCrawler = require('../index')

jest.setTimeout(60000)

describe('link-crawler', () => {
	it('should return links using default source-config', async () => {
		const links = await newsCrawler()

		expect(links.length).toBeGreaterThan(1)
	})

	it('should return links using custom source-config', async () => {
		const sourceConfigs = [
			{
				name: 'ekantipur',
				url: 'https://ekantipur.com',
				category: 'headlines',
				'link-selectors': ['article.normal > h1 > a'],
			},
		]

		const links = await newsCrawler(sourceConfigs)

		expect(links.length).toBeGreaterThan(1)
	})
})
