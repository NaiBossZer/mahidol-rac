import "i18next";
import type { TranslationKey } from "@/i18n";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: Record<TranslationKey, string>;
    };
  }
}
