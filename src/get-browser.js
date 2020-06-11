const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

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
		// headless: false,
	})

	return browser
}
