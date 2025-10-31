const js = require("@eslint/js");
const pluginSecurity = require("eslint-plugin-security");
const prettier = require("eslint-config-prettier");

module.exports = [
  js.configs.recommended,
  prettier,
  {
    plugins: {
      security: pluginSecurity,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        process: "readonly",
        __dirname: "readonly",
        Buffer: "readonly",
        console: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "security/detect-object-injection": "off",
    },
  },
];
