const newsCrawler = require('../index')

describe('link-crawler', () => {
	it('should return links', async () => {
		const links = await newsCrawler()

		console.log('printing links', links)
		expect(links.length).toBeGreaterThan(1)
	})
})
