<script setup lang="ts">
import SelectInputComponent from '@/shared/components/inputs/select.input.vue'

type props = {
  disabled?: boolean
  page: number
  total: number
}

const emit = defineEmits<{ update: [value: number] }>()
const { disabled, page, total } = defineProps<props>()
</script>

<template>
  <ul class="pagination th-pagination m-0 flex-nowrap user-select-none gap-2">
    <div class="d-flex align-items-center gap-1">
      <li class="page-item">
        <button
          v-tooltip="{ text: $t('forms.first'), position: 'bottom', trigger: 'hover' }"
          type="button"
          class="btn btn-secondary btn-icon"
          @click="(_: MouseEvent) => emit('update', 1)"
          :disabled="page == 1 || disabled"
        >
          <font-awesome-icon :icon="['fas', 'angles-left']" />
        </button>
      </li>

      <li class="page-item">
        <button
          v-tooltip="{ text: $t('forms.previous'), position: 'bottom', trigger: 'hover' }"
          type="button"
          class="btn btn-secondary btn-icon"
          @click="(_: MouseEvent) => emit('update', page - 1)"
          :disabled="page == 1 || disabled"
        >
          <font-awesome-icon :icon="['fas', 'angle-left']" />
        </button>
      </li>
    </div>

    <i18n-t
      keypath="forms.pagination-page"
      tag="small"
      class="fw-normal text-light-alt d-flex gap-2 align-items-center text-nowrap"
      scope="global"
    >
      <SelectInputComponent
        name="page"
        :disabled="total <= 1"
        @update="(page: any) => emit('update', page)"
        style="width: 6.5rem"
        :value="page"
        :options="Array.from({ length: total }, (_, i) => i + 1)"
      >
        <template #option="{ option }">
          {{ option }}
        </template>
      </SelectInputComponent>
      {{ total }}
    </i18n-t>

    <div class="d-flex align-items-center gap-1">
      <li class="page-item">
        <button
          v-tooltip="{ text: $t('forms.next'), position: 'bottom', trigger: 'hover' }"
          :disabled="page == total || disabled"
          type="button"
          class="btn btn-secondary btn-icon"
          @click="(_: MouseEvent) => emit('update', page + 1)"
        >
          <font-awesome-icon :icon="['fas', 'angle-right']" />
        </button>
      </li>

      <li class="page-item">
        <button
          v-tooltip="{ text: $t('forms.last'), position: 'bottom', trigger: 'hover' }"
          type="button"
          :disabled="page == total || disabled"
          class="btn btn-secondary btn-icon"
          @click="(_: MouseEvent) => emit('update', total)"
        >
          <font-awesome-icon :icon="['fas', 'angles-right']" />
        </button>
      </li>
    </div>
  </ul>
</template>
-+*
