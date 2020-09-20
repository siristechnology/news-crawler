const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

module.exports = async function ({ headless = true }) {
	const disableGlDrawing = headless ? '--disable-gl-drawing-for-tests' : ''

	const browser = await puppeteer.launch({
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-accelerated-video',
			'--disable-extensions',
			'--disable-metrics',
			'--disable-plugins',
			'--disable-infobars',
			'--disable-flash-3d',
			'--ignore-certifcate-errors',
			'--disable-notifications',
			'--disable-geolocation',
			'--disable-session-crashed-bubble',
			'--no-zygote',
			'--autoplay-policy=user-gesture-required',
			'--disable-features=PreloadMediaEngagementData, MediaEngagementBypassAutoplayPolicies',
			'--no-default-browser-check',
			'--no-experiments',
			'--no-first-run',
			'--no-initial-navigation',
			'--noerrdialogs',
			'--disable-auto-reload',
			'--js-flags=--max_old_space_size=512',
			'--max_old_space_size=512',
			'--disable-default-apps',
			'--disable-crash-reporter',
			'--disable-audio-output',
			'--disable-sync',
			'--disable-speech-api',
			'--user-gesture-required',
			'--disable-logging',
			'--disable-file-system',
			'--disable-touch-drag-drop',
			'--disable-touch-adjustment',
			'--disable-usb-keyboard-detect',
			'--disable-back-forward-cache',
			'--disable-breakpad',
			'--disable-demo-mode',
			disableGlDrawing,
		],
		ignoreHTTPSErrors: true,
		headless,
	})

	return browser
}
