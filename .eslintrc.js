module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    semi: 0,
    'space-unary-ops': 0,
    // Disable Prettier, because it conflicts with ESLint's "object-curly-spacing"
    // https://github.com/prettier/prettier/issues/1871
    // https://itnext.io/how-to-replace-prettier-by-eslint-rules-21574359e041
    'prettier/prettier': 'off',
    // Allow inline styles (should be removed at some point)
    'react-native/no-inline-styles': 'off',
    'sort-imports': [ 'warn', {
      'ignoreCase': false,
      'ignoreDeclarationSort': true,
      'ignoreMemberSort': false,
      'allowSeparatedGroups': true,
    }],
    'object-curly-spacing': [ 'warn', 'always' ],
    'array-bracket-spacing': [ 'warn', 'always', {
      'singleValue': false,
      'objectsInArrays': false,
      'arraysInArrays': false,
    }],
  },
};
