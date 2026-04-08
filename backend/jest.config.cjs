module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/?(*.)+(test|spec).js'],
  testPathIgnorePatterns: ['/node_modules/', '/coverage/'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middleware/**/*.js',
    'routes/**/*.js',
    'services/**/*.js',
    'utils/**/*.js',
    'app.js',
    '!**/node_modules/**',
  ],
};
