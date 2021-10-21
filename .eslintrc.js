const { off } = require("process");

module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        'plugin:@next/next/recommended',
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {        
        'no-console': 'off',
        'no-var': 'off',
        '@typescript-eslint/no-explicit-any':'off',
        '@typescript-eslint/no-unused-vars':'off',
        'explicit-module-boundary-types':'off',
        '@typescript-eslint/no-var-requires':'off',
        'prefer-const':'off',
        '@typescript-eslint/ban-types':'off',
        'no-inferrable-types':'off',
        "react/react-in-jsx-scope":"off",
        "react/no-unescaped-entities": "off",
        "@next/next/no-page-custom-font": "off",
        'react/prop-types':'off',
        "@typescript-eslint/ban-ts-comment":"off"
    }
};
