const stubPage = {
	goto: async () => {},
	$$: async () => {},
	$: async () => {},
	$eval: async () => {},
	$$eval: async () => {},
	setDefaultNavigationTimeout: async () => {},
	emulate: async () => {},
}

const stubBrowser = {
	pages: async () => [stubPage],
	newPage: async () => stubPage,
	close: async () => {},
}

module.exports = {
	stubPage,
	stubBrowser,
}
