module.exports = {
  plugins: ["stylelint-scss"],
  extends: ["stylelint-config-recommended-scss"],
  ignoreFiles: ["node_modules/**/*.css", "dist/**/*.css", "src/assets/scss/libs/**"],
  rules: {
    "no-descending-specificity": null,
  },
};
