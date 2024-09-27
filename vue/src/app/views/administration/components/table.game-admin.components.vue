<script setup lang="ts">
// import { defaultOptions } from '../schema/games-list.config'

// import TablePaginatedComponent from '@/app/components/table/paginated.component.vue'
import InputDateComponent from '@/app/components/inputs/input.date.component.vue'
import InputMultiSelectComponent from '@/app/components/inputs/input.multi-select.component.vue'
</script>

<template>
  <!-- <TablePaginatedComponent
    v-model:options="defaultOptions"
    :columns="[
      { name: 'user', label: 'forms.name' },
      { name: 'created', label: 'Release Date' },
      { name: 'role', label: 'Platforms' },
      { name: 'role', label: 'Genres' },
      { name: 'actions', label: 'forms.actions' }
    ]"
    :rows="[]"
    :pages="1"
  >
    <template v-slot>
      <button class="btn btn-dark btn-icon" disabled type="button">
        <font-awesome-icon size="lg" :icon="['fas', 'ellipsis-vertical']" />
      </button>
    </template>
  </TablePaginatedComponent> -->

  <InputMultiSelectComponent
    :filter-key="'label'"
    name="test2"
    :options="[
      { id: '1', label: 'Playstation 5' },
      { id: '1', label: 'XBOX Series S' },
      { id: '1', label: 'Nintendo Switch' }
    ]"
  >
    <template v-slot:option="{ option }">
      {{ option.label }}
    </template>
  </InputMultiSelectComponent>

  <InputDateComponent class="mt-3" name="date" style="width: 20rem" />
</template>
