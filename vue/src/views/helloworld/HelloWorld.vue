<script setup lang="ts">
// import { useModalStore } from '@/store/modal.store'
import { useToastStore } from '@/store/toast.store'
// import { markRaw } from 'vue'
import {
  reactive,
  // computed,
  onMounted
  // computed,
  // watch
} from 'vue'
import { RouteLocationNormalizedLoaded } from 'vue-router'
// import { useAuthStore } from '@/store/authentication.store'
import { useRoute } from 'vue-router'

import Card from '@/components/base/card/card.component.vue'
// import GenericModalComponent from '@/components/modal/templates/generic.modal.vue'

// const store = useAuthStore()
const route: RouteLocationNormalizedLoaded = useRoute()

const toastStore = useToastStore()

// const modalStore = useModalStore()

// const authenticated = computed<boolean>(() => store.isAuthenticated)

function init() {
  toastStore.addToast({ title: 'Hello World', body: 'This is a toast message' })
  // modalStore.openModal({
  //   title: 'TEST MODAL',
  //   view: markRaw(GenericModalComponent),
  //   properties: {
  //     text: 'THIS IS A TEST'
  //   }
  // })
}

onMounted(async () => {
  console.log('init')
  // toastStore.addToast({ title: 'TEST', body: 'THIS IS A TEST' })
})

// watch(authenticated, async (_value: boolean, _oldValue: boolean): Promise<void> => {
//   init()
// })

// const store = useAuthStore()
const props = defineProps<{
  msg: string
}>()

const state = reactive<{
  count: number
}>({ count: 0 })
</script>

<template>
  <h1>{{ props.msg }}</h1>

  {{ route.meta.pageTitle }}

  {{ state.count }}

  <Card>
    <button type="button" @click="init" class="btn btn-primary rounded-0">count is {{ state.count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </Card>

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
