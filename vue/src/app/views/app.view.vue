<script setup lang="ts">
import ToastComponent from '@/app/components/toast/toast.component.vue'
import ModalComponent from '@/app/components/modal/modal.component.vue'
import { provide, ref } from 'vue'
import { UpdateKeySymbol } from '@/library/data/schema/key.schema'

const renderKey = ref(Date.now())
const updateKey = () => (renderKey.value = Date.now())

provide(UpdateKeySymbol, updateKey)
</script>

<template>
  <!-- <RouterView v-slot="{ Component }">
    <Suspense>
      <component :is="Component" />

      <template #fallback>{{ $t('actions.loading') }}</template>
    </Suspense>
  </RouterView> -->

  <Suspense>
    <template #default>
      <RouterView />
    </template>
    <template #fallback>
      <div style="background: red; color: white; padding: 20px">⏳ Suspense Fallback: Loading...</div>
    </template>
  </Suspense>

  <ModalComponent />
  <ToastComponent />
</template>
