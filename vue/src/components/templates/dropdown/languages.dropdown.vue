<script setup lang="ts">
import { LOCALES, I18nService, locales } from '@/plugins/vuei18n.plugin'

const props = defineProps<{
  close: () => void
}>()

const submit = (key: locales): void => {
  I18nService.changeLocale(key)
  props.close()
}
</script>

<template>
  <h6 class="dropdown-header">Languages</h6>
  <hr class="dropdown-divider m-0" />
  <div class="py-2">
    <template v-for="locale of Object.values(LOCALES)">
      <button
        :class="{ active: locale.key == $i18n.locale }"
        class="dropdown-item d-flex justify-content-between align-items-center"
        type="button"
        @click="(_$event: MouseEvent) => submit(locale.key)"
      >
        <span>{{ locale.display }}</span>
        <img :src="locale.flag" style="height: 12px" class="rounded-circle" />
      </button>
    </template>
  </div>
</template>
