module.exports = {
    "plugins": [
        "import",
        "meteor",
        "mocha",
        "underscore"
    ],
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        },
        "allowImportExportEverywhere": true
    },
    "extends": [
        "airbnb", "plugin:meteor/recommended"
    ],
    "rules": {
        "comma-dangle": "off",
        "no-unused-expressions": "off",
        "func-names": "off",
        "consistent-return": "off",
        "import/no-extraneous-dependencies": "off",
        "import/prefer-default-export": "off",
        "import/extensions": "off",
        "no-underscore-dangle": "off",
        "meteor/eventmap-params": [
            "error", {
                "eventParamName": "event",
                "templateInstanceParamName": "instance"
            }
        ],
        "meteor/template-names": ["off"],
        "meteor/audit-argument-checks": ["off"],
        "arrow-body-style": [
            "error", "as-needed"
        ],
        "max-len": [
            2, {
                "code": 180,
                "ignoreUrls": true,
                "ignoreStrings": true,
                "ignoreTemplateLiterals": true
            }
        ],
        "indent": [
            1,
            4, {
                "SwitchCase": 1
            }
        ],
        "semi": "off",
        "no-trailing-spaces": "error",
        "class-methods-use-this": "off",
        "meteor/no-session": "off",
        "no-var": "off",
        "no-unused-vars": "off",
        "no-tabs": "off",
        "object-shorthand": 0,
        "prefer-arrow-callback": "off",
        "no-param-reassign": "off",
        "no-return-assign": "off",
        "no-restricted-syntax": "off",
        "no-lonely-if": "off"
    },
    "settings": {
        "import/resolver": "meteor"
    } 
}
