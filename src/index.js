const articleCrawler = require('./article-crawler')

module.exports = async function (sourceConfigs) {
	sourceConfigs = sourceConfigs || require('../news-source-config.json')

	const links = articleCrawler(sourceConfigs)

	return links
}
