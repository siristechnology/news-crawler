const articleCrawler = require('./article-crawler')

module.exports = async function (sourceConfigs, ipAddress) {
	return articleCrawler(sourceConfigs, ipAddress)
}
