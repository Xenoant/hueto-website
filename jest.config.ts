/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
	dir: './',
})

const config: Config = {
	// Automatically clear mock calls, instances, contexts and results before every test
	clearMocks: true,

	// Indicates whether the coverage information should be collected while executing the test
	collectCoverage: true,
	coverageDirectory: 'coverage',

	coverageProvider: 'v8',

	// The test environment that will be used for testing
	testEnvironment: 'jest-environment-jsdom',

	// An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
	// testPathIgnorePatterns: [
	//   "/node_modules/"
	// ],
}

export default createJestConfig(config)
