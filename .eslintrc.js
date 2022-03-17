module.exports = {
  extends: ["eslint:recommended"],
  plugins: [],
  parser: "babel-eslint",
  env: {
    browser: true,
    es6: true,
    node: true,
    jquery: true,
  },
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "no-unused-vars": ["warn"],
    "no-var": ["error"],
  },
};
