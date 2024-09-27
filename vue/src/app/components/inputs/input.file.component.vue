<script setup lang="ts">
import { kilobyte } from '@/library/constants/size.constants'
import { useField } from 'vee-validate'
import { onMounted, ref, toRef, watch } from 'vue'

import BadgeComponent from '@/app/components/badge/badge.component.vue'

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
  <div class="file-input d-flex flex-column">
    <div class="file-input-component position-relative">
      <input
        ref="inputRef"
        class="opacity-0 position-absolute start-0"
        type="file"
        @change="onChange"
        accept="image/x-png,image/gif,image/jpeg"
      />
      <div class="label text-center p-3">
        <font-awesome-icon class="text-muted" :icon="['fas', 'cloud-arrow-up']" size="5x" />
        <h6 class="mt-2 text-light-alt fw-semibold">
          <span>Drop files to attach, or <span class="text-primary text-decoration-underline">browse</span></span>
        </h6>
        <small class="text-muted">PNG, JPEG, GIF up to 10MB</small>
      </div>
    </div>
    <div class="mt-3" v-if="value">
      <div class="file-input-display d-flex align-items-stretch p-2 gap-2 flex-no-wrap">
        <div class="d-flex align-items-center">
          <BadgeComponent theme="secondary">{{ value.type }}</BadgeComponent>
        </div>
        <div class="d-flex align-items-center flex-grow-1 overflow-hidden text-light-alt">
          <p class="text-truncate" style="direction: rtl">{{ value.name }}</p>
        </div>
        <div class="d-flex align-items-center">
          <p>{{ (value.size / kilobyte).toFixed(2) }}KB</p>
        </div>
        <div class="d-flex align-items-center">
          <button
            class="btn btn-icon-sm btn-dark d-flex align-items-center justify-content-center"
            type="button"
            v-on:click="removeFile"
          >
            <font-awesome-icon :icon="['fas', 'xmark']" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
