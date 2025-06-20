<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Router, useRouter } from 'vue-router'

import { useUserAdminHandler } from '../handlers/user.handler'
import { ROUTE_NAMES } from '@/core/enums/route-names.enum'
import { UserDto } from '@/core/apis/dto/user.dto'

const { t } = useI18n()
const handler = useUserAdminHandler(t)

const $router: Router = useRouter()

const props = defineProps<{
  user: UserDto
}>()

function remove(_: MouseEvent): void {
  handler.remove(props.user, (_: UserDto) => {
    $router.push({ name: ROUTE_NAMES.ADMIN_USERS })
  })
}
</script>

<template>
  <div class="d-flex flex-column flex-sm-row gap-3 p-3">
    <div class="row-header">
      <h6 class="fw-bold">
        {{ $t('administration.users.single.delete-account.label') }}
      </h6>
    </div>
    <div class="d-flex align-items-center justify-content-sm-end flex-grow-1">
      <button class="btn btn-link fw-normal" type="button" @click="remove">
        {{ $t('actions.disable-account') }}
      </button>
    </div>
  </div>
</template>
