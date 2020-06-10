module.exports = {
	testEnvironment: 'node',
	verbose: true,
	moduleFileExtensions: ['js', 'jsx'],
	testPathIgnorePatterns: ['<rootDir>/node_modules/'],
	coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
	collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx}'],
	coverageReporters: ['clover', 'json-summary'],
	testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test|integration).[jt]s?(x)'],
	transform: {
		'^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-jest',
	},
	setupFiles: ['<rootDir>/node_modules/regenerator-runtime/runtime'],
}
