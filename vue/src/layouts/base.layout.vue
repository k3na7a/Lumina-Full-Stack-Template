<script setup lang="ts">
import NavbarComponent from '@/components/navbar/navbar.component.vue'
import FooterComponent from '@/components/footer/footer.component.vue'
import { useRoute } from 'vue-router'

import ToastComponent from '@/components/toast/toast.component.vue'
import ModalComponent from '@/components/modal/modal.component.vue'

const route = useRoute()
</script>

<template>
  <ModalComponent />
  <div class="vh-100 m-0 d-flex flex-row">
    <div class="d-flex flex-column flex-grow-1 flex-row-fluid w-100">
      <NavbarComponent />
      <div id="wrapper" class="flex-grow-1">
        <RouterView v-slot="{ Component }" :key="route.fullPath">
          <component :is="Component" />
        </RouterView>
      </div>
      <FooterComponent />
    </div>
  </div>
  <ToastComponent />
</template>
