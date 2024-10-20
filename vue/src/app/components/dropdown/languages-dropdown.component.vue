<script setup lang="ts">
import { LOCALES } from '@/plugins/vuei18n.plugin'

import DropdownComponent from '@/app/components/dropdown/base/dropdown.component.vue'
import { useI18n } from 'vue-i18n'
import { ILocalStorageUtil, useLocalStorageUtil } from '@/library/utilities/local-storage.util'
import { TOKEN } from '@/plugins/vuei18n.plugin'

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
        <h5 class="p-0 px-2 py-1 text-muted fw-bolder text-nowrap">{{ $t('navigation.language') }}</h5>
        <div class="d-flex flex-column gap-1">
          <template v-for="_locale of Object.values(LOCALES)" :key="_locale.key">
            <button
              :class="{ active: _locale.key == $i18n.locale }"
              class="dropdown-item d-flex justify-content-between align-items-center px-2 m-0"
              type="button"
              @click="(_$event: MouseEvent) => {
                locale = _locale.key
                saveItem(_locale.key)
                close()
              }"
            >
              <span class="text-truncate pe-2">{{ _locale.display }}</span>
              <img :src="_locale.flag" style="height: 15px" class="rounded-circle" />
            </button>
          </template>
        </div>
      </div>
    </template>
  </DropdownComponent>
</template>
