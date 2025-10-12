import { App } from "vue";
import { createI18n } from "vue-i18n";

import { useLocalStorageUtil } from "@lib/utilities/local-storage.util";
import { messages } from "@lib/locales";

const TOKEN: string = "i18n-locale";

export const $i18n = createI18n({
  legacy: false,
  fallbackLocale: "en",
  globalInjection: true,
  locale: useLocalStorageUtil(TOKEN).getItem<string>() || "en",
  messages,
});

class I18nService {
  public static init(app: App<Element>): void {
    app.use($i18n);
  }
}

export { I18nService, TOKEN };
