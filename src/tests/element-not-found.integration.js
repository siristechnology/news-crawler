const getBrowser = require('../get-browser')
const puppeteer = require('puppeteer')
const device = puppeteer.devices['iPhone 8']

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
