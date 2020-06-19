module.exports = {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFilesAfterEnv: [],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  testRegex: '(/test/.*|\\.(test|spec))\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: 'coverage',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'reports/jest',
        outputName: 'junit.xml',
      },
    ],
  ],
};
