<script setup lang="ts">
import InputDateComponent from '@/app/components/inputs/date.input.vue'
import InputMultiSelectComponent from '@/app/components/inputs/multi-select.input.vue'
import ckeditorInput from '@/app/components/inputs/ckeditor.input.vue'
</script>

<template>
  <div class="d-flex flex-column gap-2">
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
    <InputDateComponent name="date" style="max-width: 20rem" />
    <ckeditor-input />
  </div>
</template>
