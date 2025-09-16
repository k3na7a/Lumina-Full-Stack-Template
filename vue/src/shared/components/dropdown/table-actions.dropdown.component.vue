<script setup lang="ts">
import DropdownComponent from '@/shared/components/dropdown/base/dropdown.component.vue'
import { actions } from '@/shared/layouts/main/composables/main.composable'

type props = {
  size?: 'sm' | 'lg' | 'xl'
  disabled?: boolean
  payload: actions[]
}

const { payload } = defineProps<props>()
</script>

<template>
  <DropdownComponent :disabled="disabled" dropdownAlign="end" class="th-action-dropdown">
    <template #button>
      <font-awesome-icon :size="size" :icon="['fas', 'ellipsis-vertical']" />
    </template>
    <template #menu="{ close }">
      <div class="d-flex flex-column gap-1">
        <div class="d-flex flex-column gap-1 overflow-hidden">
          <div class="px-2 py-1 text-truncate">
            <h5 class="text-muted fw-bolder text-nowrap display-font text-truncate">{{ $t('forms.actions') }}</h5>
            <slot></slot>
          </div>

          <div class="d-flex flex-column gap-1">
            <template v-for="action of payload" :key="action.title">
              <button
                class="dropdown-item d-flex justify-content-between align-items-center px-2 m-0"
                :class="{ [`text-${action.theme}`]: action.theme }"
                type="button"
                :disabled="action.disabled"
                @click="(_: MouseEvent) => {
                    action.callback && action.callback()
                    close()
                }"
              >
                <span class="text-truncate pe-2">{{ $t(action.title) }}</span>
                <span style="width: 1.5rem" class="text-center"><font-awesome-icon :icon="action.icon" /></span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </template>
  </DropdownComponent>
</template>
