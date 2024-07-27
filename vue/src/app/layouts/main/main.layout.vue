<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { computed, ComputedRef, markRaw } from 'vue'
import { AxiosError } from 'axios'

// import OffcanvasComponent from '@/app/components/offcanvas/base/offcanvas.component.vue'
import ToastComponent from '@/app/components/toast/toast.component.vue'
import ModalComponent from '@/app/components/modal/modal.component.vue'

import { ModalStore, useModalStore } from '@/app/store/modal.store'

import NavbarComponent from '@/app/components/navbar/navbar.component.vue'
import NavigationComponent from './topnav/navigation.component.vue'
import ActionComponent from './topnav/actions.component.vue'

import SignInModal from '@/app/layouts/main/modals/signin.modal.component.vue'

import { useToastStore } from '@/app/store/toast.store'
import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { UserDto } from '@/library/dto/user.dto'

import { MORE_NAVIGATION } from '@/library/config/more.navigation.config'

// const localState = reactive<{ loading: boolean }>({ loading: true })

const route: RouteLocationNormalizedLoaded = useRoute()

const authStore: AuthStore = useAuthStore()
const { openModal, closeModal }: ModalStore = useModalStore()
const { addToast } = useToastStore()

const path: ComputedRef<string | undefined> = computed<string | undefined>(() => route.name?.toString())
const isAuthenticated: ComputedRef<boolean> = computed(() => authStore.isAuthenticated)
const authenticatedUser: ComputedRef<UserDto | undefined> = computed<UserDto | undefined>(
  () => authStore.authenticatedUser
)

const signin = (_event: MouseEvent): void =>
  openModal({
    view: markRaw(SignInModal),
    properties: {
      close: closeModal
    }
  })

const signout = (_event: MouseEvent) => {
  authStore.signOut().catch((error: AxiosError) => {
    addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
  })
}
</script>

<template>
  <NavbarComponent>
    <template v-slot:left>
      <NavigationComponent :path :is-authenticated :navigation_list="MORE_NAVIGATION" />
    </template>

    <template v-slot:right>
      <ActionComponent :signin :signout :is-authenticated :authenticated-user />
    </template>
  </NavbarComponent>

  <div id="content-wrapper">
    <RouterView v-slot="{ Component }" :key="route.fullPath">
      <component :is="Component" />
    </RouterView>
  </div>

  <ModalComponent />
  <!-- <OffcanvasComponent /> -->
  <ToastComponent />
</template>
