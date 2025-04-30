<script setup lang="ts">
import DropdownComponent from '@/app/components/dropdown/dropdown.component.vue'

type more_navigation = Array<{
  title: string
  children: Array<{ title: string; redirect: string }>
}>

const MORE_NAVIGATION: more_navigation = [
  {
    title: 'navigation.general',
    children: [
      { title: 'navigation.subnavigation.about', redirect: 'About' },
      { title: 'navigation.subnavigation.blog', redirect: 'About' },
      { title: 'navigation.subnavigation.developers', redirect: 'About' },
      { title: 'navigation.subnavigation.jobs', redirect: 'About' },
      { title: 'navigation.subnavigation.partners', redirect: 'About' }
    ]
  },
  {
    title: 'navigation.help&legal',
    children: [
      { title: 'navigation.subnavigation.community', redirect: 'About' },
      { title: 'navigation.subnavigation.cookies', redirect: 'About' },
      { title: 'navigation.subnavigation.help', redirect: 'About' },
      { title: 'navigation.subnavigation.privacy', redirect: 'About' },
      { title: 'navigation.subnavigation.terms', redirect: 'About' }
    ]
  }
]
</script>

<template>
  <DropdownComponent>
    <template #button>
      <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
    </template>
    <template #menu="{ close }">
      <div class="d-flex flex-column gap-2">
        <template v-for="(nav, index) of MORE_NAVIGATION">
          <hr v-if="index" class="dropdown-divider mx-1 my-0 bg-secondary opacity-50" />

          <div class="d-flex flex-column gap-1">
            <h5 class="p-0 py-1 px-2 text-muted fw-bolder text-nowrap">{{ $t(nav.title) }}</h5>
            <div class="d-flex flex-column gap-1">
              <template v-for="navigation_item of nav.children" :key="navigation_item.title">
                <button
                  class="dropdown-item d-flex justify-content-between align-items-center px-2 m-0"
                  type="button"
                  @click="close"
                >
                  <span class="text-truncate">{{ $t(navigation_item.title) }}</span>
                </button>
              </template>
            </div>
          </div>
        </template>
      </div>
    </template>
  </DropdownComponent>
</template>
