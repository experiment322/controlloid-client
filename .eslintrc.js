module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
  },
  globals: {
    __DEV__: "readonly",
  },
  env: {
    es6: true,
    jest: true,
    node: true,
    browser: true,
    commonjs: true,
  },
  extends: ["@react-native-community", "airbnb", "plugin:prettier/recommended", "prettier/react"],
  rules: {
    "prettier/prettier": "error",
    "no-underscore-dangle": "off",
    "react/forbid-prop-types": "off",
    "import/prefer-default-export": "off",
    "react/jsx-filename-extension": ["warn", { extensions: [".js", ".jsx"] }],
    "max-len": [
      "warn",
      {
        code: 100,
        tabWidth: 2,
        comments: 100,
        ignoreComments: false,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
  },
};
