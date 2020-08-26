const articleCrawler = require('./article-crawler')

module.exports = async function (sourceConfigs, articleUrlLength) {
	return articleCrawler(sourceConfigs, articleUrlLength)
}
