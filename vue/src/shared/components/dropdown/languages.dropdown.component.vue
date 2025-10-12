<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { ILocalStorageUtil, useLocalStorageUtil } from '@lib/utilities/local-storage.util'
import { TOKEN } from '@/core/plugins/vuei18n.plugin'

import { LOCALES } from '@lib/locales'

import DropdownComponent from './base/dropdown.component.vue'

const { locale } = useI18n()
const { saveItem }: ILocalStorageUtil = useLocalStorageUtil(TOKEN)
</script>

<template>
  <DropdownComponent dropdown-align="end">
    <template #button>
      <font-awesome-icon :icon="['fas', 'language']" />
    </template>
    <template #menu="{ close }">
      <div class="d-flex flex-column gap-1">
        <h5 class="p-0 px-2 py-1 text-muted fw-bolder text-nowrap display-font text-truncate">
          {{ $t('navigation.language') }}
        </h5>
        <div class="d-flex flex-column gap-1">
          <template v-for="_locale of Object.values(LOCALES)" :key="_locale.key">
            <button
              :class="{ active: _locale.key == $i18n.locale }"
              class="dropdown-item d-flex justify-content-between align-items-center px-2 m-0"
              type="button"
              @click="(_: MouseEvent) => {
                locale = _locale.key
                saveItem(_locale.key)
                close()
              }"
            >
              <span class="text-truncate pe-2">{{ _locale.display }}</span>
              <img :src="_locale.flag" style="height: 1.5rem; width: 1.5rem" class="border border-secondary" />
            </button>
          </template>
        </div>
      </div>
    </template>
  </DropdownComponent>
</template>
