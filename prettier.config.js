module.exports = {
  singleQuote: false,
  overrides: [
    {
      files: "*.hbs",
      options: {
        parser: "html",
      },
    },
  ],
};
