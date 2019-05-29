module.exports = {
  extends: "stylelint-config-standard",
  syntax: "scss",
  plugins: ["stylelint-no-unsupported-browser-features"],
  rules: {
    indentation: 2,
    "selector-type-no-unknown": null,
    "at-rule-empty-line-before": null,
    "no-empty-source": null,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["include", "mixin"]
      }
    ],
    "number-leading-zero": "never",
    "selector-list-comma-newline-after": null,
    "declaration-colon-newline-after": null,
    "selector-pseudo-element-no-unknown": [
      true,
      {
        message: "Avoid non-standard pseudo elements such as ng-deep!",
        severity: "warning"
      }
    ],
    "font-family-name-quotes": "always-where-recommended",
    "font-family-no-missing-generic-family-keyword": null,
    "function-url-quotes": "always",
    "selector-attribute-quotes": "always",
    "string-quotes": "single",
    "at-rule-no-vendor-prefix": true,
    "media-feature-name-no-vendor-prefix": true,
    "property-no-vendor-prefix": true,
    "selector-no-vendor-prefix": true,
    "value-no-vendor-prefix": true,
    "max-nesting-depth": 4,
    "selector-max-compound-selectors": 6,
    "color-named": "never",
    "color-hex-case": "lower",
    "color-hex-length": "short",
    "no-descending-specificity": null,
    "function-url-scheme-whitelist": ["https"],
    "declaration-no-important": [
      true,
      {
        severity: "warning"
      }
    ],
    "declaration-property-unit-whitelist": {
      "font-size": ["rem", "vmin"],
      "line-height": []
    },
    "selector-no-qualifying-type": [
      true,
      {
        ignore: ["attribute"]
      }
    ],
    "custom-property-pattern": /^[a-z-]+$/,
    "selector-class-pattern": [
      /^[a-z0-9-]+$/,
      {
        resolveNestedSelectors: true
      }
    ],
    "selector-id-pattern": [
      /^[a-z0-9-]+$/,
      {
        resolveNestedSelectors: true
      }
    ],
    "function-url-no-scheme-relative": true,
    "plugin/no-unsupported-browser-features": [
      true,
      {
        severity: "warning",
        ignore: [
          "viewport-units",
          "multicolumn",
          "outline",
          "css-resize",
          "user-select-none"
        ]
      }
    ]
  }
};
