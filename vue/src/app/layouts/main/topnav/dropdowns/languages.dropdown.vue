<script setup lang="ts">
import { LOCALES, I18nService, locales } from '@/plugins/vuei18n.plugin'

import DropdownComponent from '@/app/components/dropdown/dropdown.component.vue'

const submit = (key: locales, callback: () => void): void => {
  I18nService.changeLocale(key)
  callback()
}
</script>

<template>
  <DropdownComponent :autoclose="'inside'">
    <template v-slot:button>
      <span>
        <font-awesome-icon :icon="['fas', 'language']" />
      </span>
    </template>
    <template v-slot:menu="{ close }">
      <div
        class="dropdown-menu dropdown-menu-dark dropdown-menu-end p-2 border-0"
        v-on:click="($event: MouseEvent) => $event.stopPropagation()"
      >
        <h3 class="dropdown-header p-0 my-1 px-2">{{ $t('general.language') }}</h3>
        <div class="pt-1">
          <template v-for="locale of Object.values(LOCALES)">
            <button
              :class="{ active: locale.key == $i18n.locale }"
              class="dropdown-item d-flex justify-content-between align-items-center px-2"
              type="button"
              v-on:click="(_$event: MouseEvent) => submit(locale.key, close)"
            >
              <span>{{ locale.display }}</span>
              <img :src="locale.flag" style="height: 12px" class="rounded-circle" />
            </button>
          </template>
        </div>
      </div>
    </template>
  </DropdownComponent>
</template>
