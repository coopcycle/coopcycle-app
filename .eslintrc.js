module.exports = {
  root: true,
  extends: ['eslint:recommended', '@react-native', 'plugin:@typescript-eslint/recommended-type-checked', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    projectService: true,
    tsconfigRootDir: __dirname,
  },
  plugins: ['eslint-plugin-react-compiler', '@typescript-eslint'],
  overrides: [
    {
      files: ['**/*.js'],
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
    },
  ],
  rules: {
    //FIXME: fix warnings reported by this rule and increase the severity to 'error'
    'no-irregular-whitespace': 'warn',
    //FIXME: fix warnings reported by this rule and increase the severity to 'error'
    'no-case-declarations': 'warn',
    //FIXME: fix warnings reported by this rule and increase the severity to 'error'
    'no-async-promise-executor': 'warn',
    //FIXME: fix warnings reported by this rule and increase the severity to 'error'
    'no-var': 'warn',
    //FIXME: fix warnings reported by this rule and increase the severity to 'error'
    'prefer-const': 'warn',
    //FIXME: fix warnings reported by this rule and increase the severity to 'error'
    'prefer-rest-params': 'warn',

    'no-prototype-builtins': 'warn',

    'react-compiler/react-compiler': 'warn',

    // Allow inline styles
    'react-native/no-inline-styles': 'off',

    "react/react-in-jsx-scope": "off",

    'sort-imports': [
      'warn',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        allowSeparatedGroups: true,
      },
    ],

    // TypeScript-specific rules
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    //TODO: Gradually enable more TypeScript-specific rules, by moving them from 'warn' to 'error'
    '@typescript-eslint/await-thenable': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-array-constructor': 'warn',
    '@typescript-eslint/no-array-delete': 'warn',
    '@typescript-eslint/no-base-to-string': 'warn',
    '@typescript-eslint/no-duplicate-enum-values': 'warn',
    '@typescript-eslint/no-duplicate-type-constituents': 'warn',
    '@typescript-eslint/no-empty-object-type': 'warn',
    '@typescript-eslint/no-extra-non-null-assertion': 'warn',
    '@typescript-eslint/no-for-in-array': 'warn',
    '@typescript-eslint/no-implied-eval': 'warn',
    '@typescript-eslint/no-misused-new': 'warn',
    '@typescript-eslint/no-misused-promises': 'warn',
    '@typescript-eslint/no-namespace': 'warn',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
    '@typescript-eslint/no-redundant-type-constituents': 'warn',
    '@typescript-eslint/no-require-imports': 'warn',
    '@typescript-eslint/no-this-alias': 'warn',
    '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
    '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-declaration-merging': 'warn',
    '@typescript-eslint/no-unsafe-enum-comparison': 'warn',
    '@typescript-eslint/no-unsafe-function-type': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/no-unsafe-unary-minus': 'warn',
    '@typescript-eslint/no-unused-expressions': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-wrapper-object-types': 'warn',
    '@typescript-eslint/only-throw-error': 'warn',
    '@typescript-eslint/prefer-as-const': 'warn',
    '@typescript-eslint/prefer-namespace-keyword': 'warn',
    '@typescript-eslint/prefer-promise-reject-errors': 'warn',
    '@typescript-eslint/require-await': 'warn',
    '@typescript-eslint/restrict-plus-operands': 'warn',
    '@typescript-eslint/restrict-template-expressions': 'warn',
    '@typescript-eslint/triple-slash-reference': 'warn',
    '@typescript-eslint/unbound-method': 'warn',

    'prettier/prettier': 'off',

    // Stylistic rules are deprecated in eslint v8.54.0
    // and should be added via prettier or https://eslint.style/
  },
};
