<script setup lang="ts">
import DropdownComponent from '@/shared/components/dropdown/base/dropdown.component.vue'

const props = defineProps<{
  id: string
  type: string
  updateCallback?: () => void
  deleteCallback?: () => void
}>()
</script>

<template>
  <DropdownComponent dropdownAlign="end">
    <template #button>
      <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
    </template>
    <template #menu="{ close }">
      <div class="d-flex flex-column gap-1">
        <div class="d-flex flex-column gap-1 overflow-hidden">
          <div class="px-2 py-1 text-truncate">
            <h5 class="text-muted fw-bolder text-nowrap">{{ $t('forms.actions') }}</h5>
            <small class="text-primary fst-italic text-nowrap">
              {{ props.type }}: <span class="text-light-alt">{{ props.id }}</span>
            </small>
          </div>
          <div class="d-flex flex-column gap-1">
            <button
              v-if="updateCallback"
              class="dropdown-item d-flex justify-content-between align-items-center px-2 m-0 text-warning"
              type="button"
              @click="(_:MouseEvent) => {
                updateCallback && updateCallback()
                close()
              }"
            >
              <span class="text-truncate pe-2">Update</span>
              <span style="width: 1.5rem" class="text-center">
                <font-awesome-icon :icon="['fas', 'pen-to-square']" />
              </span>
            </button>
            <button
              v-if="deleteCallback"
              class="dropdown-item d-flex justify-content-between align-items-center px-2 m-0 text-danger"
              type="button"
              @click="(_:MouseEvent) => {
                deleteCallback && deleteCallback()
                close()
              }"
            >
              <span class="text-truncate pe-2">Delete</span>
              <span style="width: 1.5rem" class="text-center">
                <font-awesome-icon :icon="['fas', 'trash-can']" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </DropdownComponent>
</template>

<style lang="scss" scoped>
@import '@/shared/sass/variables/index';

*:disabled {
  opacity: 40%;
}
</style>
