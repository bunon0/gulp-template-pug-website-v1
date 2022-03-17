module.exports = {
  printWidth: 90,
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  endOfLine: "lf",
  bracketSpacing: true,
  bracketSameLine: true,
  arrowParens: "avoid",

  overrides: [
    {
      files: ["*.html"],
      options: {
        tabWidth: 2,
      },
    },
  ],
};
