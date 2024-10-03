<script lang="ts" setup>
import { useField } from 'vee-validate'
import { onMounted, ref, toRef, watch } from 'vue'

const props = defineProps<{ name: string; label?: string }>()

const inputRef = ref<InstanceType<typeof HTMLElement>>()

const name = toRef(props, 'name')
const { value } = useField<boolean>(name.value, undefined, { initialValue: false })

const emit = defineEmits<{ update: [value: boolean] }>()
watch(value, (newVal: boolean) => {
  emit('update', newVal)
})

onMounted(() => {
  emit('update', value.value)
})
</script>

<template>
  <div class="th-custom d-flex">
    <label :for="name" class="align-items-center">
      <input
        ref="inputRef"
        :id="name"
        :name
        class="opacity-0"
        type="checkbox"
        v-model="value"
        @keyup.enter.prevent="value = !value"
      />
      <div class="d-flex align-items-center gap-2">
        <div class="d-flex justify-content-center align-items-center th-checkbox" :class="{ active: value }">
          <font-awesome-icon v-if="value" size="sm" class="text-light" :icon="['fas', 'check']" />
        </div>
        <small v-if="props.label" class="text-light-alt">{{ $t(props.label) }}</small>
      </div>
    </label>
  </div>
</template>

<style lang="scss">
@import '@/library/sass/variables/index';

.th-custom {
  label {
    cursor: pointer;

    input {
      position: absolute;
      width: 0px;
      height: 0px;
    }

    .th-checkbox {
      height: 1.8rem;
      aspect-ratio: 1 / 1;
      border: 0.1rem solid $muted;
      background-color: $backgroundAlt;
      transition: border 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    &:hover {
      .th-checkbox {
        box-shadow: 0 0 0 0.1rem $muted;
      }
    }

    &:focus-within,
    &:has(:active) {
      .th-checkbox {
        border: 0.1rem solid $primary;
        box-shadow: 0 0 0 0.1rem $primary;
      }
    }
  }
}
</style>
