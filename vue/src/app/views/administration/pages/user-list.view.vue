<script setup lang="ts">
import UserAdministrationTable from '../components/table.user-admin.component.vue'
</script>

<template>
  <div class="content-view-administration">
    <div class="mb-2">
      <h4 class="text-light fw-semibold">{{ $t('administration.users.title') }}</h4>
      <p class="text-muted fw-normal mb-2">{{ $t('administration.users.subtitle') }}</p>
    </div>
    <div class="card d-flex flex-column">
      <div class="section p-3">
        <UserAdministrationTable />
      </div>
    </div>
  </div>
</template>
