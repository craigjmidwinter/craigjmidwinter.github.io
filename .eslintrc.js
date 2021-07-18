module.exports ={
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parserOptions: { ecmaVersion: 2020, sourceType:"module"},
    extends: ['eslint:recommended',
        'plugin:prettier/recommended',
    ],
  overrides: [
    {
      files: ['**/*.js', '**/*.jsx'],
      settings: { react: { version: 'detect' } },
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
      ],
      rules: {
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
      },
    },
  ],
}

