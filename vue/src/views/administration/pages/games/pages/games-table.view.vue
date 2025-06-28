<script setup lang="ts">
import moment from 'moment'
import TablePaginatedComponent from '@/shared/components/table/paginated-table.component.vue'
import ActionsComponent from '@/shared/components/dropdown/actions-dropdown.component.vue'
import ContentLayout from '@/views/administration/layouts/content.layout.vue'
import { useGamesTable } from '../composables/game-table.composable'

const { t, options, loading, tableColumns, response, sort, createGame, updateGame, removeGame, getPaginatedData } =
  useGamesTable()

await getPaginatedData(options.value)
</script>

<template>
  <ContentLayout
    title="administration.games-and-software.games.title"
    subtitle="administration.games-and-software.games.subtitle"
  >
    <template #table>
      <TablePaginatedComponent
        v-model:options="options"
        :loading
        :columns="tableColumns"
        :rows="response.data"
        :pages="response.meta?.pageCount"
        :sort-options="sort"
        :caption="
          t(
            'administration.games-and-software.games.caption',
            { showing: response.data.length },
            response.meta.itemCount
          )
        "
      >
        <template v-slot>
          <div class="d-flex gap-2">
            <button class="btn btn-dark btn-icon" type="button" @click="createGame">
              <font-awesome-icon size="lg" :icon="['fas', 'plus']" />
            </button>
          </div>
        </template>
        <template #user="{ row }">
          <div class="d-flex flex-row align-items-center gap-2">
            <img class="cover-icon" :src="row.cover" />
            <div class="d-flex flex-column">
              <small class="text-muted fst-italic">
                {{ row.id }}
              </small>
              <p class="fw-semibold text-light">
                {{ row.name }}
              </p>
            </div>
          </div>
        </template>
        <template #platforms="{ row }">
          <small class="fw-semibold text-muted">
            <template v-if="row.platforms.length">
              <div class="d-flex flex-column gap-1">
                <small v-for="platform of row.platforms" class="text-primary fw-semibold">{{ platform.name }}</small>
              </div>
            </template>
            <template v-else>-</template>
          </small>
        </template>
        <template #release="{ row }">
          <small class="fw-semibold text-muted">
            {{ moment(row.release_date).format('L') }}
          </small>
        </template>
        <template #actions="{ row }">
          <ActionsComponent
            :id="row.id"
            type="game"
            :updateCallback="() => updateGame(row)"
            :deleteCallback="() => removeGame(row)"
          />
        </template>
      </TablePaginatedComponent>
    </template>
  </ContentLayout>
</template>

<style lang="scss" scoped>
@import '@/shared/sass/variables/index';

.cover-icon {
  height: 4.2rem;
  width: 3.2rem;
  object-fit: cover;
  border: 0.1rem $secondary dashed;
}
</style>
