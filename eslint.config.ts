import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import * as importPlugin from "eslint-plugin-import";
import tsdoc from "eslint-plugin-tsdoc";
import tseslint, { type ConfigWithExtends } from "typescript-eslint";

const ignores: ConfigWithExtends["ignores"] = [
  "**/dist/**",
  "**/build/**",
  "**/docs/**",
  "**/node_modules/**",
  "**/**/*.d.ts",
];

const rules: ConfigWithExtends["rules"] = {
  "tsdoc/syntax": "warn",
  "@typescript-eslint/consistent-type-imports": [
    "error",
    { fixStyle: "inline-type-imports", prefer: "type-imports" },
  ],
  "@typescript-eslint/consistent-type-exports": [
    "error",
    { fixMixedExportsWithInlineTypeSpecifier: true },
  ],
  "@typescript-eslint/no-import-type-side-effects": "error",
  "@typescript-eslint/restrict-template-expressions": [
    "error",
    { allowNumber: true, allowBoolean: true, allowNever: true },
  ],
  "@typescript-eslint/no-unnecessary-type-parameters": "off",
  "@typescript-eslint/no-explicit-any": [
    "error",
    { fixToUnknown: true, ignoreRestArgs: true },
  ],
  "@typescript-eslint/consistent-indexed-object-style": "off",
  "@typescript-eslint/no-dynamic-delete": "off",
  "@typescript-eslint/no-redundant-type-constituents": "off",
  "@typescript-eslint/prefer-reduce-type-parameter": "off",
  "@typescript-eslint/no-non-null-assertion": "off",
  "@typescript-eslint/no-base-to-string": "off",
  "@typescript-eslint/no-confusing-void-expression": "off",
  "@typescript-eslint/no-invalid-void-type": [
    "error",
    { allowInGenericTypeArguments: true, allowAsThisParameter: true },
  ],
  "@typescript-eslint/restrict-plus-operands": ["error", { allowAny: true }],
};

export default tseslint.config(
  {
    name: "packages",
    files: ["packages/**/*.ts"],
    ignores: [...ignores],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin,
      tsdoc,
    },
    settings: {
      "import/resolver": {
        typescript: { project: "./tsconfig.eslint.json" },
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      },
    },
    languageOptions: {
      parser: tseslint.parser,
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...rules,
      "no-duplicate-imports": "off",
      "import/no-duplicates": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      "@typescript-eslint/method-signature-style": "error",
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      prettierConfig,
    ],
  },
  {
    name: "dev",
    files: ["*.ts", ".dev/**/*.ts", "**/*.test.ts", "bin/**/*.ts"],
    ignores: [...ignores],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin,
      tsdoc,
    },
    settings: {
      "import/resolver": {
        typescript: { project: "./tsconfig.test.json" },
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      },
    },
    languageOptions: {
      parser: tseslint.parser,
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.test.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...rules,
      "no-duplicate-imports": "off",
      "import/no-duplicates": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/method-signature-style": "error",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unnecessary-boolean-literal-compare": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      prettierConfig,
    ],
  },
);
