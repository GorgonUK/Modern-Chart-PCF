import eslintjs from "@eslint/js";
import microsoftPowerApps from "@microsoft/eslint-plugin-power-apps";
import pluginPromise from "eslint-plugin-promise";
import reactPlugin from "eslint-plugin-react";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["**/generated"],
  },
  eslintjs.configs.recommended,
  ...typescriptEslint.configs.recommendedTypeChecked,
  ...typescriptEslint.configs.stylisticTypeChecked,
  pluginPromise.configs["flat/recommended"],
  microsoftPowerApps.configs.paCheckerHosted,
  reactPlugin.configs.flat.recommended,
  {
    plugins: {
      "@microsoft/power-apps": microsoftPowerApps,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ComponentFramework: true,
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-undef": "off",
      "@typescript-eslint/no-debugger": "off",
      "@typescript-eslint/no-unescaped-entities": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-indexed-object-style": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/prefer-regexp-exec": "off",
      "react/prop-types": "off"
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
