<script setup lang="ts">
import ToastComponent from "@/shared/components/toast/toast.component.vue";
import ModalComponent from "@/shared/components/modal/base/modal.component.vue";
import RenderedView from "@/shared/components/page/page.component.vue";

import { useApp } from "./core/composables/app.composable";
import { useDynamicPageTitle } from "./core/composables/page-title.composable";

const { renderKey } = useApp();
useDynamicPageTitle();
</script>

<template>
  <RenderedView :key="renderKey" />

  <ModalComponent />
  <ToastComponent />
</template>
