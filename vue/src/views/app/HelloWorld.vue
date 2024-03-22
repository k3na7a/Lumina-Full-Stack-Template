<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { LocalhostAPI as API } from '@/helpers/apis/localhost.api'
import { useAuthStore } from '@/store/authentication.store'

onMounted(async () => {
  await API.users.getMe()
})

const store = useAuthStore()

const props = defineProps<{
  msg: string
}>()

const data = reactive<{
  count: number
}>({ count: 0 })

const authenticated = computed({
  get(): boolean {
    return store.$authenticated
  },
  set(newValue: boolean): void {
    store.$authenticated = newValue
  }
})

async function login(): Promise<void> {
  store.singIn({ email: 'desjjoh@gmail.com', password: 'Password123!' })
}
</script>

<template>
  <h1>{{ props.msg }}</h1>
  {{ authenticated }}
  <div class="card">
    <button type="button" @click="login" class="btn btn-primary">count is {{ data.count }}</button>
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
./store/authentication.store ../../helpers/apis/localhost.api../../store/authentication.store
