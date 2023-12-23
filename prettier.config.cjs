/** @type {import("prettier").Config} */
const config = {
  printWidth: 80,
  tabWidth: 2,
  trailingComma: "all",
  singleQuote: false,
  semi: true,
  importOrder: [
    "^next/(.*)$",
    "^next-auth/(.*)$",
    "^react$",
    "^@nextui-org/(.*)$",
    "^@/server/(.*)$",
    "^@/trpc/(.*)$",
    "^@/env([.]js)?$",
    "^@/app/api/(.*)$",
    "^@/app/(.*)$",
    "@(.*)",
    "^[./]",
    ".*",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    require.resolve("prettier-plugin-tailwindcss"),
    // "prettier-plugin-tailwindcss",
    // "@trivago/prettier-plugin-sort-imports",
  ],
};

module.exports = config;
