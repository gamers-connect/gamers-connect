import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Add ignores configuration first
  {
    ignores: [
      ".next/**",
      "node_modules/**", 
      ".vercel/**",
      "out/**",
      "build/**",
      "dist/**",
      "src/generated/**",
      "*.config.js",
      "*.config.ts",
      "next-env.d.ts"
    ]
  },
  // Your existing Next.js ESLint config
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
