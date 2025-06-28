<script setup lang="ts">
type props = {
  disabled?: boolean
  page: number
  total: number
  offset: number
}

const emit = defineEmits<{ update: [value: number] }>()
const { disabled, page, total, offset } = defineProps<props>()
</script>

<template>
  <ul class="pagination th-pagination m-0 flex-wrap user-select-none">
    <li class="page-item">
      <button
        v-tooltip="{ text: $t('forms.first'), position: 'bottom', trigger: 'hover' }"
        type="button"
        class="btn btn-secondary btn-icon"
        @click="(_event: MouseEvent) => emit('update', 1)"
        :disabled="page == 1 || disabled"
      >
        <div class="d-flex align-items-center justify-content-center">
          <font-awesome-icon :icon="['fas', 'angles-left']" />
        </div>
      </button>
    </li>

    <li class="page-item">
      <button
        v-tooltip="{ text: $t('forms.previous'), position: 'bottom', trigger: 'hover' }"
        type="button"
        class="btn btn-secondary btn-icon"
        @click="(_event: MouseEvent) => emit('update', page - 1)"
        :disabled="page == 1 || disabled"
      >
        <div class="d-flex align-items-center justify-content-center">
          <font-awesome-icon :icon="['fas', 'angle-left']" />
        </div>
      </button>
    </li>

    <li
      v-for="(item, idx) of [...Array(total)]
        .map((_, index) => index + 1)
        .filter(
          (index) =>
            index >= page - offset + (page + offset > total ? total - page - offset : 0) &&
            index <= page + offset - (page - offset - 1 < 0 ? page - offset - 1 : 0)
        )"
      class="page-item"
      :key="idx"
    >
      <button
        type="button"
        class="btn btn-secondary btn-icon"
        :class="{ active: item == page }"
        :disabled="item == page || disabled"
        @click="(_event: MouseEvent) => emit('update', item)"
      >
        <div class="d-flex align-items-center justify-content-center">
          {{ item }}
        </div>
      </button>
    </li>

    <li class="page-item">
      <button
        v-tooltip="{ text: $t('forms.next'), position: 'bottom', trigger: 'hover' }"
        :disabled="page == total || disabled"
        type="button"
        class="btn btn-secondary btn-icon"
        @click="(_event: MouseEvent) => emit('update', page + 1)"
      >
        <div class="d-flex align-items-center justify-content-center">
          <font-awesome-icon :icon="['fas', 'angle-right']" />
        </div>
      </button>
    </li>

    <li class="page-item">
      <button
        v-tooltip="{ text: $t('forms.last'), position: 'bottom', trigger: 'hover' }"
        type="button"
        :disabled="page == total || disabled"
        class="btn btn-secondary btn-icon"
        @click="(_event: MouseEvent) => emit('update', total)"
      >
        <div class="d-flex align-items-center justify-content-center">
          <font-awesome-icon :icon="['fas', 'angles-right']" />
        </div>
      </button>
    </li>
  </ul>
</template>
