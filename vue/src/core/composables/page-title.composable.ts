import { watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

export function useDynamicPageTitle() {
  const { locale, t } = useI18n();
  const route = useRoute();

  const updateTitle = () => {
    const titleKey = route.meta.pageTitle as string | undefined;
    const translatedPage = titleKey ? t(titleKey) : "";
    const translatedSite = t("navigation.site-name");

    document.title = titleKey
      ? `${translatedPage} - ${translatedSite}`
      : translatedSite;
  };

  watch([() => route.fullPath, locale], updateTitle, { immediate: true });
}
