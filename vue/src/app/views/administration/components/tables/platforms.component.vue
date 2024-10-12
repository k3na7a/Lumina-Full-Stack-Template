<script setup lang="ts">
import { reactive } from 'vue'
import moment from 'moment'

import { PaginationOptions } from '@/apis/localhost/dto/pagination.dto'

import TablePaginatedComponent from '@/app/components/table/paginated.component.vue'

import { defaultOptions } from '../../config/user-list.config'
// import { useI18n } from 'vue-i18n'

import { GameLibraryService } from '../../services/games.service'

const { createPlatform } = GameLibraryService.platforms

// const { t } = useI18n()
const options = reactive<PaginationOptions>(defaultOptions)
</script>

<template>
  <TablePaginatedComponent
    v-model:options="options"
    :columns="[
      { name: 'name', label: 'Platform Name' },
      { name: 'abbreviation', label: 'Abbreviation' },
      { name: 'released', label: 'Release Date' },
      { name: 'created', label: 'Created Date' },
      { name: 'actions', label: 'forms.actions' }
    ]"
    :rows="[
      {
        id: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Nintendo Entertainment System',
        released: new Date('1985-10-18'),
        abbreviation: 'NES',
        slug: 'nes'
      },
      {
        id: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Super Nintendo Entertainment System',
        released: new Date('1991-8-23'),
        abbreviation: 'SNES',
        slug: 'snes'
      }
    ]"
    :pages="1"
  >
    <template v-slot>
      <button
        class="btn btn-dark btn-icon d-flex justify-content-center align-items-center"
        type="button"
        v-tooltip="{ text: $t('actions.create'), position: 'bottom', trigger: 'hover' }"
        @click="createPlatform"
      >
        <font-awesome-icon size="lg" :icon="['fas', 'plus']" />
      </button>
    </template>

    <template #name="{ row }">
      {{ row.name }}
    </template>

    <template #abbreviation="{ row }">
      {{ row.abbreviation }}
    </template>

    <template #released="{ row }">
      {{ moment(row.released).format('LL') }}
    </template>

    <template #created="{ row }">
      {{ moment(row.createdAt).startOf('y').fromNow() }}
    </template>

    <template #actions>
      <div class="d-flex gap-1 flex-nowrap">
        <button
          disabled
          v-tooltip="{ text: $t('actions.read'), position: 'bottom', trigger: 'hover' }"
          class="btn btn-dark btn-icon-sm px-0"
          type="button"
        >
          <div class="d-flex flex-column align-items-center text-info">
            <font-awesome-icon size="sm" :icon="['fas', 'book-open']" />
          </div>
        </button>

        <button
          v-tooltip="{ text: $t('actions.update'), position: 'bottom', trigger: 'hover' }"
          class="btn btn-dark btn-icon-sm px-0"
          type="button"
        >
          <div class="d-flex flex-column align-items-center text-warning">
            <font-awesome-icon size="sm" :icon="['fas', 'pencil']" />
          </div>
        </button>
        <button
          v-tooltip="{ text: $t('actions.delete'), position: 'bottom', trigger: 'hover' }"
          class="btn btn-dark btn-icon-sm px-0"
          type="button"
        >
          <div class="d-flex flex-column align-items-center text-danger">
            <font-awesome-icon size="sm" :icon="['fas', 'trash-can']" />
          </div>
        </button>
      </div>
    </template>
  </TablePaginatedComponent>
</template>
