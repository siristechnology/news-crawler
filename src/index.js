const articleCrawler = require('./article-crawler')

module.exports = async function (sourceConfigs, options) {
	return articleCrawler(sourceConfigs, options)
}
