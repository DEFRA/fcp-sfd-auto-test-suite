module.exports = {
  env: {
    es2022: true,
    node: true,
    jest: true
  },
  globals: {
    before: true,
    after: true
  },
  extends: ['standard', 'prettier', 'eslint:recommended'],
  overrides: [
    {
      files: ['bin/**/*.js'],
      rules: { 'no-console': 'off' }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'error'
  }
}
