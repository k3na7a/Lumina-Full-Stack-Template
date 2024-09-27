<script setup lang="ts" generic="T">
const props = defineProps<{ columns: Array<{ label: string; name: string }>; rows: Array<T>; caption?: string }>()
</script>

<template>
  <div style="overflow-x: auto">
    <table class="m-0">
      <thead>
        <tr>
          <th scope="col" v-for="(column, idx) in props.columns" :key="`${column}-${idx}`">
            <div class="cell">
              <span class="fw-bold">{{ column.label }}</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in props.rows" :key="`${row}-${idx}`">
          <td v-for="column in props.columns" :key="`${column}-${idx}`">
            <div class="cell">
              <slot :name="column.name" :row="row"></slot>
            </div>
          </td>
        </tr>
      </tbody>
      <caption v-if="caption" class="text-end text-muted fw-semibold px-2">
        <small>{{ caption }}</small>
      </caption>
    </table>
  </div>
</template>
