<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { useTestStore } from './store/test.store'
import { LocalhostAPI } from './helpers/apis/localhost.api'

onMounted(async () => {
  await LocalhostAPI.authentication.signIn({ email: '', password: '' }).catch((e: Error) => {
    console.log(e)
  })
})

const store = useTestStore()

const props = defineProps<{
  msg: string
}>()

const data = reactive<{
  count: number
}>({ count: 0 })

const computedCount = computed({
  get(): number {
    return store.count
  },
  set(newValue: number): void {
    store.count = newValue
  }
})
</script>

<template>
  <h1>{{ props.msg }}</h1>

  <div class="card">
    <button type="button" @click="computedCount++" class="btn btn-primary">
      count is {{ computedCount + data.count }}
    </button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
