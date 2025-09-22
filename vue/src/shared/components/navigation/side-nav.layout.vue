<script setup lang="ts">
import { ROUTE_NAMES } from '@lib/enums/route-names.enum'

type props = {
  title: string
  routes: {
    name: ROUTE_NAMES
    label: string
    icon: string[]
  }[]
  footer?: {
    action: () => void
    label: string
    icon: string[]
  }[]
}

const { title, routes } = defineProps<props>()
</script>

<template>
  <div style="position: relative" class="d-flex h-100 overflow-hidden">
    <div class="admin-drawer bg-alt box-shadow d-flex flex-column p-2">
      <div class="d-flex flex-column gap-1 flex-grow-1">
        <h5 class="d-none d-lg-flex px-2 py-1 text-light-alt fw-bolder text-nowrap display-font">{{ $t(title) }}</h5>
        <div class="d-flex flex-grow-1 flex-column gap-1">
          <template v-for="navigation_item of routes" :key="navigation_item.label">
            <RouterLink
              :to="{ name: navigation_item.name }"
              tag="button"
              class="dropdown-item d-flex align-items-center justify-content-center justify-content-lg-start gap-2 px-lg-2 py-1 m-0 overflow-hidden w-100"
              activeClass="active"
            >
              <div style="width: 2rem" class="d-flex justify-content-center align-items-center">
                <font-awesome-icon :icon="navigation_item.icon" />
              </div>
              <span class="d-none d-lg-block text-truncate">{{ $t(navigation_item.label) }}</span>
            </RouterLink>
          </template>
        </div>
        <div v-if="footer" class="d-flex flex-shrink-1 flex-column gap-1">
          <template v-for="navigation_item of footer" :key="navigation_item.label">
            <button
              @click="navigation_item.action"
              class="dropdown-item d-flex align-items-center justify-content-center justify-content-lg-start gap-2 px-lg-2 py-1 m-0 overflow-hidden w-100"
              type="button"
            >
              <div style="width: 2rem" class="d-flex justify-content-center align-items-center">
                <font-awesome-icon :icon="navigation_item.icon" />
              </div>
              <span class="d-none d-lg-block text-truncate">{{ $t(navigation_item.label) }}</span>
            </button>
          </template>
        </div>
      </div>
    </div>

    <div class="admin-content flex-grow-1 h-100 overflow-auto">
      <slot name="content"></slot>
    </div>
  </div>
</template>
