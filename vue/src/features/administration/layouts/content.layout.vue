<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  return route.meta.breadcrumbs ?? []
})

type proptype = {
  title: string
  subtitle: string
}

const { title, subtitle } = defineProps<proptype>()
</script>

<template>
  <div class="content-view-administration d-flex flex-column gap-2">
    <div class="d-flex flex-column">
      <h4 class="text-light fw-semibold display-font">{{ $t(title) }}</h4>
      <p class="text-muted fw-normal">{{ $t(subtitle) }}</p>
    </div>
    <div class="card d-flex flex-column p-3">
      <div class="d-flex flex-column gap-3">
        <div v-if="breadcrumbs.length" class="bg-alt3 px-2 py-1">
          <ol
            class="d-flex flex-row gap-2 flex-wrap m-0 p-0 align-items-center text-primary"
            style="list-style-type: none"
          >
            <template v-for="(crumb, idx) in breadcrumbs" :key="idx">
              <li>
                <RouterLink v-if="crumb.to" :to="{ name: crumb.to }" class="text-decoration-none">
                  <p>{{ crumb.name }}</p>
                </RouterLink>
                <p v-else class="text-light-alt">{{ crumb.name }}</p>
              </li>
              <template v-if="idx < breadcrumbs.length - 1">
                <li class="text-muted"><font-awesome-icon size="sm" :icon="['fas', 'chevron-right']" /></li>
              </template>
            </template>
          </ol>
        </div>
        <slot name="table"></slot>
      </div>
    </div>
  </div>
</template>
