import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // App Router uses `app/layout.tsx` for head tags; this rule is geared toward Pages Router.
      "@next/next/no-page-custom-font": "off",
      // Pixel-parity port of the HTML prototype uses raw <img> tags for now.
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
