module.exports = {
  root: true,
  extends: ['eslint:recommended', '@react-native', 'prettier'],
  rules: {
    // Allow inline styles (should be removed at some point)
    'react-native/no-inline-styles': 'off',
    'sort-imports': [
      'warn',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        allowSeparatedGroups: true,
      },
    ],

    // Disable Prettier, because it conflicts with ESLint's "object-curly-spacing"
    // https://github.com/prettier/prettier/issues/1871
    // https://itnext.io/how-to-replace-prettier-by-eslint-rules-21574359e041
    'prettier/prettier': 'off',

    // Stylistic rules are deprecated in eslint v8.54.0
    // and should be added via prettier or https://eslint.style/
  },
};
