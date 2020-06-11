const puppeteer = require('puppeteer-extra')
// const devices = require('puppeteer/DeviceDescriptors')
// const device = devices['iPhone 8']

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

module.exports = async function () {
	const browser = await puppeteer.launch({
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-accelerated-video',
			'--disable-extensions',
			'--renderer',
			'--disable-metrics',
			'--disable-plugins',
			'--disable-images',
			'--disable-infobars',
			'--reader-mode',
			'--ignore-certifcate-errors',
		],
		ignoreHTTPSErrors: true,
	})

	return browser
	// const page = await browser.newPage()

	// await page.emulate(device)
	// await page.goto('https://ekantipur.com/business/2020/03/28/158541613793239917.html')

	// const headerText = await page.$eval('#wrapper > main > article > header > h1', (element) => element.textContent)
	// console.log('Printing header \n', headerText)

	// await browser.close()
}
