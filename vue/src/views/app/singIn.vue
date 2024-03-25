<script setup lang="ts">
import { useAuthStore } from '@/store/authentication.store'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const $store = useAuthStore()
const $route = useRoute()
const $router = useRouter()

const redirect = computed(() => ($route.query.redirect as string) || '/')

async function login(): Promise<void> {
  await $store
    .singIn({ email: 'desjjoh@gmail.com', password: 'Password123!' })
    .then(() => $router.push({ path: redirect.value }))
}
</script>

<template>
  <h1>SIGN IN</h1>
  <button type="button" @click="login" class="btn btn-primary">Login</button>
</template>
