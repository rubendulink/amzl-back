module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    "standard"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module"
  },
  rules: {
    semi: [2, "always"],
    quotes: [2, "double", { avoidEscape: true, allowTemplateLiterals: false }],
    "padded-blocks": ["error", "always", { allowSingleLineBlocks: true }]
  }
};
