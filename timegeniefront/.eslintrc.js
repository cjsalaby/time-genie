module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'standard',
        'plugin:react/recommended'
    ],
    overrides: [
        {
            env: {
                node: true
            },
            files: [
                '.eslintrc.{js,cjs}'
            ],
            parserOptions: {
                sourceType: 'script'
            }
        }
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: [
        'react'
    ],
    rules: {
        'array-callback-return': 1,
        'react/jsx-uses-react': 1,
        'react/jsx-fragments': 1,
        'no-irregular-whitespace': 1,
        'react/self-closing-comp': 1,
        indent: ['error', 4],
        semi: [2, 'always']
    }
};
