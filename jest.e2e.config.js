const baseConfig = require('./jest.config.js');

module.exports = {
  ...baseConfig,
  testRegex: '(/__e2e__/.*|(\\.|/)(e2e))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: [...baseConfig.testPathIgnorePatterns, '/__tests__/'],
  setupFilesAfterEnv: [...(baseConfig.setupFilesAfterEnv || []), '<rootDir>/jest.e2e.setup.js'],
};
