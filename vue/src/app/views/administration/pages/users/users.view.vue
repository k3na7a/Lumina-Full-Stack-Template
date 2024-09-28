<script setup lang="ts">
import UserAdministrationTable from './components/users-paginated.component.vue'
</script>

<template>
  <div class="content-view-administration d-flex flex-column gap-2">
    <div class="d-flex flex-column">
      <h4 class="text-light fw-semibold">{{ $t('administration.users.title') }}</h4>
      <p class="text-muted fw-normal">{{ $t('administration.users.subtitle') }}</p>
    </div>
    <div class="card d-flex flex-column">
      <div class="section p-3">
        <UserAdministrationTable />
      </div>
    </div>
  </div>
</template>
