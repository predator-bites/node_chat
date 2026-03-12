module.exports = {
  parser: "@typescript-eslint/parser",

  extends: [
    '@mate-academy/eslint-config',
    "plugin:@typescript-eslint/recommended"
  ],
  env: {
    jest: true
  },
  rules: {
    'no-proto': 0
  },
  plugins: ['jest']
};
