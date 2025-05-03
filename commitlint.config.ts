import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "colors",
        "css-normalize",
        "css-types",
        "dsa",
        "file",
        "schema",
        "text",
        "utils",
        "repo",
      ],
    ],
  },
};

export default Configuration;
