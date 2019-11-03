module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
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
    "import/prefer-default-export": "off",
    "react/forbid-prop-types": "off",
    "react/jsx-props-no-spreading": "off",
    "react-native/no-inline-styles": "off",
    "no-underscore-dangle": "off",
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
