module.exports = {
    '*.{js,jsx,ts,tsx,css,json,md}': ['prettier --write'],
    '*.{js,jsx,ts,tsx}': ['eslint --fix --rule react-hooks/exhaustive-deps:off', () => 'npm run tsc -- --noEmit'],
};
