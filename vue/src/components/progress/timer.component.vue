<script setup lang="ts">
import { computed, onUnmounted } from 'vue'
import { reactive } from 'vue'

type localProps = { timeout: number }
const props = defineProps<localProps>()

type localstate = { value: number }
const state = reactive<localstate>({ value: 0 })

const max = computed<number>(() => props.timeout * 10)

const timer = setInterval(() => {
  state.value++
  if (state.value >= max.value) clearInterval(timer)
}, 100)

onUnmounted((): void => {
  clearInterval(timer)
})
</script>

<template>
  <div class="progress rounded-0" role="progressbar" style="height: 1px">
    <div class="progress-bar" :style="`width: ${(state.value / max) * 100}%`"></div>
  </div>
</template>
