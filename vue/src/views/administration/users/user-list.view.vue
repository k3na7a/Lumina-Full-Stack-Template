<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { AxiosError } from 'axios'

import { LocalhostAPI } from '@/apis/localhost/localhost.api'
import { Order, PaginationDto, PaginationMeta, PaginationOptions } from '@/library/dto/pagination.dto'
import { ToastStore, useToastStore } from '@/store/toast.store'
import { UserDto } from '@/library/dto/user.dto'

const { addToast }: ToastStore = useToastStore()

type localState = { loading: boolean; data: Array<UserDto>; meta: PaginationMeta }
const state = reactive<localState>({
  loading: true,
  data: [],
  meta: new PaginationMeta({
    pageOptions: {
      take: 25,
      order: Order.ASC,
      page: 1
    },
    itemCount: 0,
    totalCount: 0
  })
})

const getPaginated = async (payload: PaginationOptions) => {
  state.loading = true
  return LocalhostAPI.administration.users
    .getUsersPaginated(payload)
    .then((response: PaginationDto<UserDto>) => {
      state.data = response.data
      state.meta = response.meta
    })
    .catch((error: AxiosError) => addToast({ title: error.response?.statusText || 'ERROR', body: error.message }))
    .finally(() => (state.loading = false))
}

onMounted(async () => {
  await getPaginated({
    take: 1,
    order: Order.ASC,
    page: 1
  })
})
</script>

<template>
  <div class="user-list-view">
    <div class="mb-2">
      <h4 class="text-light fw-semibold mb-1">
        {{ $t('administration.users.title') }}
      </h4>
    </div>
    <div class="card d-flex flex-column">
      <div class="section p-3">
        {{ state.data }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/sass/variables/index';

.user-list-view {
  max-width: 900px;

  .row-header {
    width: 18rem;
    min-width: 18rem;
  }
}
</style>
