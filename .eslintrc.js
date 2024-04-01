module.exports = {
  root: true,
  extends: ['eslint:recommended', '@react-native', 'prettier'],
  rules: {
    //FIXME: fix warnings reported by this rule and increase the severity to 'error'
    "no-irregular-whitespace": "warn",
    //FIXME: fix warnings reported by this rule and increase the severity to 'error'
    "no-case-declarations": "warn",
    //FIXME: fix warnings reported by this rule and increase the severity to 'error'
    "no-async-promise-executor": "warn",

    "no-prototype-builtins": "warn",

    // Allow inline styles
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

    'prettier/prettier': 'off',

    // Stylistic rules are deprecated in eslint v8.54.0
    // and should be added via prettier or https://eslint.style/
  },
};
