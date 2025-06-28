<script setup lang="ts">
import { Router, useRouter } from 'vue-router'

import { ROUTE_NAMES } from '@/library/enums/route-names.enum'

type props = {
  title: string
  routes: {
    name: ROUTE_NAMES
    label: string
    icon: string[]
  }[]
}

const { title, routes } = defineProps<props>()
const router: Router = useRouter()
</script>

<template>
  <div style="position: relative" class="d-flex h-100 overflow-hidden">
    <div class="admin-drawer bg-alt box-shadow d-flex flex-column p-2">
      <div class="d-flex flex-column gap-1 flex-grow-1">
        <h5 class="d-none d-lg-flex px-2 py-1 text-light fw-bold text-nowrap">{{ $t(title) }}</h5>
        <div class="d-flex flex-column gap-1">
          <template v-for="navigation_item of routes" :key="navigation_item.label">
            <RouterLink :to="{ name: navigation_item.name }" class="dropdown-item" activeClass="active">
              <button
                @click="(_: MouseEvent) => { router.push({ name: navigation_item.name }) }"
                class="dropdown-item d-flex align-items-center justify-content-center justify-content-lg-start gap-2 px-lg-2 py-1 m-0 overflow-hidden w-100"
                type="button"
              >
                <div style="width: 2rem" class="d-flex justify-content-center align-items-center">
                  <font-awesome-icon :icon="navigation_item.icon" />
                </div>
                <span class="d-none d-lg-block text-truncate">{{ $t(navigation_item.label) }}</span>
              </button>
            </RouterLink>
          </template>
        </div>
      </div>
    </div>

    <div class="admin-content flex-grow-1 h-100 overflow-auto">
      <slot name="content"></slot>
    </div>
  </div>
</template>
