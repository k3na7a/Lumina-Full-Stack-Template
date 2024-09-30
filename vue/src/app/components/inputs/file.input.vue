<script setup lang="ts">
import { kilobyte } from '@/library/constants/size.constants'
import { useField } from 'vee-validate'
import { onMounted, ref, toRef, watch } from 'vue'

const props = defineProps<{ name: string }>()

const name = toRef(props, 'name')
const inputRef = ref<InstanceType<typeof HTMLInputElement>>()

const { value } = useField<File | undefined>(name.value, undefined, { initialValue: undefined })

const emit = defineEmits<{ update: [value: File | undefined] }>()
watch(value, (newVal: File | undefined) => {
  emit('update', newVal)
})

onMounted(() => {
  emit('update', value.value)
})

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  const files: FileList | null = target.files

  value.value = files?.length ? files[0] : undefined
}

function removeFile(_event: MouseEvent) {
  value.value = undefined
  if (inputRef.value) inputRef.value.value = ''
}
</script>

<template>
  <div class="file-input d-flex flex-column" :key="JSON.stringify(value)">
    <div class="file-input-component position-relative" v-if="!value">
      <input
        ref="inputRef"
        class="opacity-0 position-absolute start-0"
        type="file"
        @change="onChange"
        accept="image/x-png,image/gif,image/jpeg"
      />
      <div class="label text-center p-3 d-flex flex-column gap-2">
        <font-awesome-icon class="text-light-alt" :icon="['fas', 'cloud-arrow-up']" size="5x" />
        <div class="d-flex flex-column">
          <h6 class="text-light-alt fw-semibold">
            <span>Drop files to attach, or <span class="text-primary text-decoration-underline">browse</span></span>
          </h6>
          <small class="text-muted">PNG, JPEG, GIF up to 10MB</small>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column gap-1 text-light-alt" v-else>
      <div class="file-input-display d-flex align-items-stretch p-2 gap-2 flex-no-wrap">
        <div class="border border-info d-flex align-items-center">
          <div class="px-2 d-flex align-items-center text-nowrap">
            <small class="fw-bold text-truncate text-info">
              {{ value.type }}
            </small>
          </div>
        </div>
        <div class="d-flex align-items-center flex-grow-1 overflow-hidden">
          <p class="text-truncate" style="direction: rtl">{{ value.name }}</p>
        </div>
        <div class="d-flex align-items-center">
          <p>{{ (value.size / kilobyte).toFixed(2) }}KB</p>
        </div>
        <div class="d-flex align-items-center">
          <button
            class="btn btn-icon-sm btn-dark d-flex align-items-center justify-content-center"
            type="button"
            @click="removeFile"
          >
            <font-awesome-icon :icon="['fas', 'xmark']" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/library/sass/variables/index';

.file-input {
  .file-input-display {
    background-color: $backgroundAlt;
    border: 0.1rem dashed $muted;
  }

  .file-input-component {
    border: 0.1rem $muted dashed;
    width: 100%;
    transition: all 0.15s ease-in-out;

    &:hover,
    &:has(input:focus),
    &:has(input:active) {
      border: 0.1rem $lightAlt dashed;
      // box-shadow: 0 0 0 0.1rem $primary;
    }

    input {
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      cursor: pointer;
    }
  }
}
</style>
