const linkCrawler = require('./link-crawler')

module.exports = async function (sourceConfigs) {
	sourceConfigs = sourceConfigs || require('../news-source-config.json')

	const links = linkCrawler(sourceConfigs)

	return links
}
