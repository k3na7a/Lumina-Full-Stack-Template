<script setup lang="ts">
import { LOCALES, I18nService } from '@/plugins/vuei18n.plugin'

import DropdownComponent from '@/components/dropdown/base/dropdown.component.vue'
</script>

<template>
  <DropdownComponent dropdown-align="end" :autoclose="'inside'">
    <template v-slot:button>
      <font-awesome-icon :icon="['fas', 'language']" />
    </template>
    <template v-slot:menu="{ close }">
      <h5 class="p-0 my-1 px-2 text-muted fw-bolder text-nowrap">{{ $t('navigation.language') }}</h5>
      <div class="pt-1">
        <template v-for="locale of Object.values(LOCALES)">
          <button
            :class="{ active: locale.key == $i18n.locale }"
            class="dropdown-item d-flex justify-content-between align-items-center px-2"
            type="button"
            v-on:click="(_$event: MouseEvent) => {
                I18nService.changeLocale(locale.key)
                close()
              }"
          >
            <span class="text-truncate pe-2">{{ locale.display }}</span>
            <img :src="locale.flag" style="height: 15px" class="rounded-circle" />
          </button>
        </template>
      </div>
    </template>
  </DropdownComponent>
</template>
