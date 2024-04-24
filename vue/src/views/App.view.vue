<script setup lang="ts">
import { computed, markRaw, onMounted, reactive } from 'vue'

import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { AxiosError } from 'axios'

import { Tooltip } from 'bootstrap'

import NavbarComponent from '@/components/base/navbar/navbar.component.vue'
import DropdownComponent from '@/components/base/dropdown/dropdown.component.vue'
import OffcanvasComponent from '@/components/base/offcanvas/offcanvas.component.vue'
import ToastComponent from '@/components/base/toast/toast.component.vue'
import ModalComponent from '@/components/base/modal/modal.component.vue'

// import SignInModal from '@/components/templates/modal/signin.modal.vue'
import SidenavOffcanvas from '@/components/templates/offcanvas/sidenav.offcanvas.vue'
import TestDropdownComponent from '@/components/templates/dropdown/test.dropdown.vue'
import LanguagesDropdown from '@/components/templates/dropdown/languages.dropdown.vue'

import { AuthStore, useAuthStore } from '@/store/authentication.store'
import { UserDto } from '@/helpers/apis/localhost/dto/user.dto'
// import { ModalStore, useModalStore } from '@/store/modal.store'
import { OffcanvasStore, useOffcanvasStore } from '@/store/offcanvas.store'

// UTILITIES
const authStore: AuthStore = useAuthStore()
// const modalStore: ModalStore = useModalStore()
const offcanvasStore: OffcanvasStore = useOffcanvasStore()

const route: RouteLocationNormalizedLoaded = useRoute()

// DATA
const localState = reactive<{ loading: boolean }>({ loading: true })

// COMPUTED
const authenticatedUser = computed<UserDto | undefined>(() => authStore.authenticatedUser)

// METHODS
const openSidenavOffcanvas = (): void =>
  offcanvasStore.openOffcanvas({
    view: markRaw(SidenavOffcanvas),
    properties: {
      close: offcanvasStore.closeOffcanvas
    }
  })

// const openSignInModal = (): void =>
//   modalStore.openModal({
//     view: markRaw(SignInModal),
//     properties: {
//       title: 'TEST MODAL',
//       text: 'THIS IS A TEST',
//       close: modalStore.closeModal
//     }
//   })

// LIFECYCLE HOOKS
onMounted(async () => {
  new Tooltip(document.body, {
    selector: "[data-bs-toggle='tooltip']"
  })

  await authStore
    .init()
    .catch((error: AxiosError) => console.log('Could not Authenticate:', error))
    .finally(() => (localState.loading = false))
})
</script>

<template>
  <div class="vh-100 m-0 d-flex flex-row">
    <div class="d-flex flex-column flex-grow-1 flex-row-fluid w-100">
      <NavbarComponent>
        <template #left>
          <div class="d-flex align-items-stretch">
            <button type="button" class="btn btn-link p-2" @click="openSidenavOffcanvas">
              <font-awesome-icon :icon="['fas', 'bars']" size="lg" />
            </button>
            <div class="p-2 hover-cursor-pointer d-flex align-items-center" @click="$router.push({ name: 'home' })">
              <img src="/media/logo-header.svg" style="height: 28px" />
            </div>
            <ul class="nav nav-underline px-3">
              <li class="nav-item d-flex align-items-stretch">
                <button
                  type="button"
                  class="btn btn-link link-light nav-link px-2 rounded-0"
                  :class="{ active: route.name == 'home' }"
                  @click="$router.push({ name: 'home' })"
                >
                  {{ $t('navigation.home') }}
                </button>
              </li>
              <li class="nav-item d-flex align-items-stretch">
                <button type="button" class="btn btn-link link-light px-2 nav-link rounded-0">
                  {{ $t('navigation.browse') }}
                </button>
              </li>

              <li class="nav-item d-flex align-items-stretch">
                <DropdownComponent>
                  <template #button>
                    <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
                  </template>
                  <template #menu="{ close }">
                    <TestDropdownComponent :close="close" />
                  </template>
                </DropdownComponent>
              </li>
            </ul>
          </div>
        </template>
        <template #right>
          <template v-if="!authenticatedUser">
            <div class="d-flex align-items-stretch">
              <DropdownComponent>
                <template #button>
                  <font-awesome-icon :icon="['far', 'circle-user']" size="xl" />
                </template>
                <template #menu="{ close }">
                  <LanguagesDropdown :close="close" />
                </template>
              </DropdownComponent>
            </div>
          </template>
        </template>
      </NavbarComponent>
      <RouterView v-slot="{ Component }" :key="route.fullPath">
        <component :is="Component" />
      </RouterView>
    </div>
  </div>
  <ModalComponent />
  <OffcanvasComponent />
  <ToastComponent />
</template>

<style lang="scss">
@import '@/assets/sass/style.scss';

#app {
  & #wrapper {
    margin-top: map-get($header-config, height, desktop);
  }
}
</style>
