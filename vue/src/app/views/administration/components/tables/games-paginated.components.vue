<script setup lang="ts">
import InputDateComponent from '@/app/components/inputs/date.input.vue'
import InputMultiSelectComponent from '@/app/components/inputs/multi-select.input.vue'
</script>

<template>
  <InputMultiSelectComponent
    style="max-width: 50rem"
    :filter-key="'label'"
    name="test2"
    :options="[
      { id: '1', label: 'Playstation 5' },
      { id: '2', label: 'XBOX Series S' },
      { id: '3', label: 'Nintendo Switch' },
      { id: '3', label: 'Nintendo Wii' },
      { id: '3', label: 'Sega Genesis' },
      { id: '3', label: 'Super Nintendo' }
    ]"
  >
    <template #option="{ option }">
      {{ option.label }}
    </template>
  </InputMultiSelectComponent>

  <InputDateComponent class="mt-3" name="date" style="max-width: 20rem" />
</template>
