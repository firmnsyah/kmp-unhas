import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Batas modul microfrontend (PRD §2.2): modul lain hanya boleh diakses
  // lewat public API-nya (index.ts) — bukan file internalnya.
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules/*/*"],
              message:
                "Impor lintas modul hanya lewat public API: @/modules/<nama> (index.ts).",
            },
          ],
        },
      ],
      // Izinkan variabel sengaja tak dipakai dengan awalan _ (mis. honeypot).
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // Di dalam modulnya sendiri, file bebas saling impor (pakai path relatif).
  {
    files: ["src/modules/**"],
    rules: { "no-restricted-imports": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
