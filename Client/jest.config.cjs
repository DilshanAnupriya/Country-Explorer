module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    // Optional: Add this if you use ES modules in node_modules
    // transformIgnorePatterns: [
    //     "node_modules/(?!(YOUR_ESM_MODULES_HERE)/)"
    // ]
};
