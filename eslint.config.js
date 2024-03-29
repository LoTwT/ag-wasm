// @ts-check

import { defineFlatConfig } from "@ayingott/eslint-config"

export default defineFlatConfig(
  [
    {
      ignores: ["**/src/**", "**/tests/**", "**/target/**", "**/pkg/**"],
    },
  ],
  {
    prettier: true,
    vue: false,
    unocss: false,
    react: false,
  },
)
