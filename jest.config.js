module.exports = {
	verbose: true,
	moduleFileExtensions: ['js', 'jsx'],
	testPathIgnorePatterns: ['<rootDir>/node_modules/'],
	coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
	collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx}'],
	coverageReporters: ['clover', 'json-summary'],
	testMatch: ['**/tests/**/(spec|test|integration).[jt]s?(x)', '**/?(*.)+(spec|test|integration).[jt]s?(x)'],
	transform: {
		'^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-jest',
	},
}
