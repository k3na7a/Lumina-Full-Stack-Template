<script setup lang="ts">
import { Form } from 'vee-validate'
import * as Yup from 'yup'
// import { onMounted, onUnmounted, ref, Ref } from 'vue'

import { AxiosError } from 'axios'

import { useAuthStore } from '@/app/store/authentication.store'
import { useToastStore } from '@/app/store/toast.store'

import { credentials } from '@/library/dto/JWT.dto'
import { useFormUtil } from '@/helpers/utils/vee-validate.util'

import TextInput from '@/app/components/inputs/text.input.component.vue'
import { reactive } from 'vue'

type PropType = {
  close: () => void
}

const props = defineProps<PropType>()

const state = reactive<{ loading: boolean }>({ loading: false })

const validateUtil = useFormUtil()

const { singIn } = useAuthStore()
const { addToast } = useToastStore()

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required()
})

const onSubmit = validateUtil.getSubmitFn(validationSchema, (values: credentials) => {
  state.loading = true

  singIn(values)
    .then(props.close)
    .catch((error: AxiosError) => addToast({ title: error.response?.statusText || 'ERROR', body: error.message }))
    .finally(() => (state.loading = false))
})
</script>

<template>
  <Form ref="signInModalRef" id="sign-in-modal" v-on:submit="onSubmit" :validation-schema v-slot="{ meta }">
    <div class="d-flex justify-content-center pb-3">
      <div class="d-flex align-items-center">
        <div class="flex-shrink-0">
          <img id="logo" src="/media/logo.svg" style="width: 30px" />
        </div>
        <div class="flex-grow-1 ms-3">
          <span class="title">{{ $t('authentication.log-in-title') }}</span>
        </div>
      </div>
    </div>
    <TextInput class="pb-3" name="email" type="email" label="general.email" />
    <TextInput class="pb-2" name="password" type="password" label="general.password" />
    <p>{{ $t('authentication.trouble') }}</p>
    <div class="d-grid pt-3">
      <button :disabled="!meta.valid || state.loading" class="btn btn-primary px-0" type="submit">
        <div v-if="!state.loading" class="containter">{{ $t('actions.log-in') }}</div>
        <div v-else class="containter">{{ $t('actions.loading') }}</div>
      </button>
    </div>
  </Form>
</template>

<style lang="scss">
@import '@/app/sass/utils/utils';

#sign-in-modal {
  .title {
    font-family: $barlow;
    font-weight: 700;

    font-size: 1.25rem;

    color: $light;
    transition: color 0.25s ease;
  }

  p {
    display: block;
    margin-bottom: 0px;
    color: $primary;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
  }

  p:hover {
    text-decoration: underline;
  }

  button {
    font-weight: 600;
    font-size: 13px;
    border-radius: $border-radius;
    height: 30px;
    border: none;
  }

  button:disabled {
    background-color: $secondary;
    color: $muted;
  }

  input {
    height: 30px;
  }
}
</style>
