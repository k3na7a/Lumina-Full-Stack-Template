<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'

import TextInput from '@/shared/components/inputs/text.input.vue'
import FileInput from '@/shared/components/inputs/file.input.vue'
import DateInput from '@/shared/components/inputs/date.input.vue'
import TextAreaInput from '@/shared/components/inputs/text-area.input.vue'
import SearchPaginatedInput from '@/shared/components/inputs/search-paginated-input.input.vue'

import Layout from '../layouts/new-game.layout.vue'

import { useFormUtil } from '@/core/utilities/forms.util'
import { validationSchema, defaultPlatformOptions } from '../schema/games.schema'
import { PaginationDto, PaginationOptions } from '@/core/apis/dto/pagination.dto'
import { PlatformDto } from '@/core/apis/dto/platform.dto'

const props = defineProps<{
  callback: (values: any) => Promise<void>
  platforms: (params: PaginationOptions) => Promise<PaginationDto<PlatformDto>>
}>()

const loading = ref<boolean>(false)

const validateUtil = useFormUtil()
const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: object) => {
  loading.value = true
  await props.callback(values).finally(() => {
    loading.value = false
  })
})
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ meta, values }">
    <Layout>
      <template #name>
        <TextInput
          name="name"
          type="text"
          :placeholder="$t('administration.games-and-software.games.create.form.placeholders.name')"
        />
      </template>
      <template #cover>
        <FileInput name="cover" />
      </template>
      <template #release_date>
        <DateInput name="release_date" />
      </template>
      <template #description>
        <TextAreaInput
          name="description"
          :rows="5"
          :placeholder="$t('administration.games-and-software.games.create.form.placeholders.description')"
        />
      </template>
      <template #platforms>
        <SearchPaginatedInput
          name="platforms"
          :callback="platforms"
          sort="platform.release_date"
          :options="defaultPlatformOptions"
        >
          <template #option="{ option }">
            {{ option.name }}
            <small class="ms-2 text-muted fst-italic">{{ option.id }}</small>
          </template>
        </SearchPaginatedInput>
      </template>
      <template #slug>
        <TextInput
          :value="
            values.name
              ?.replace(/[^a-zA-Z0-9 ]/g, ' ')
              .trim()
              .replace(/\W+/g, '-')
              .toLowerCase()
          "
          name="slug"
          label="forms.slug"
          type="text"
          :placeholder="$t('administration.games-and-software.games.create.form.placeholders.slug')"
        />
      </template>
      <template #submit>
        <button :disabled="!meta.valid || loading" class="btn btn-primary px-0" type="submit">
          <div class="containter">
            {{ $t('administration.games-and-software.games.create.action') }}
          </div>
        </button>
      </template>
    </Layout>
  </Form>
</template>
