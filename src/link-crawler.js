const getBrowser = require('./get-browser')
const devices = require('puppeteer/DeviceDescriptors')
const device = devices['iPhone 8']

module.exports = async function (sourceConfigs) {
	let articleLinks = []

	// console.log('printing browser', await getBrowser())

	const page = await getBrowser().newPage()
	await page.emulate(device)

	for (const config of sourceConfigs) {
		let linksPerSource = []
		for (const link of config.links) {
			console.log('printing link', link)

			for (const linkSelector of link['link-selectors']) {
				console.log('printing linkSelector', linkSelector)
			}
		}
	}

	return articleLinks
}
