<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'

import { useFormUtil } from '@/library/utilities/helpers/forms.util'
import TextInput from '@/app/components/inputs/text.input.vue'

const validateUtil = useFormUtil()
const partials = ref<number[]>()

type result = { multiplicand: number; multiplier: number }
const validationSchema = Yup.object().shape({
  multiplicand: Yup.number().required(),
  multiplier: Yup.number().required()
})

const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: result) => {
  const _partial = String(values.multiplier)
    .split('')
    .map((v) => parseInt(v))
    .reverse()
    .reduce((accumulator, currentValue, index) => {
      const multiplicand = String(values.multiplicand)
        .split('')
        .map((v) => parseInt(v) * currentValue)

      Array.apply(null, Array(index)).forEach(() => {
        multiplicand.push(0)
      })

      const value = multiplicand
        .reduceRight((accumulator, currentValue, index) => {
          multiplicand[index] = currentValue + Math.floor((multiplicand[index + 1] || 0) / 10)
          return [...accumulator, index ? multiplicand[index] % 10 : multiplicand[index]]
        }, Array<number>(0))
        .reverse()

      return [...accumulator, parseInt(value.join(''))]
    }, Array<number>(0))

  partials.value = _partial
})
</script>

<template>
  <div class="p-3 d-flex flex-column gap-3" style="width: 30rem">
    <div class="card d-flex flex-column">
      <div class="section py-1 bg-alt d-flex justify-content-center">
        <span class="fw-semibold">Long Multiplication Calculator</span>
      </div>
      <div class="section p-2">
        <Form @submit="onSubmit" v-slot="{ meta }" :validation-schema="validationSchema">
          <div class="d-flex flex-column gap-2">
            <div class="d-flex align-items-center gap-1">
              <span style="width: 2rem"></span>
              <TextInput type="number" name="multiplicand" />
            </div>
            <div class="d-flex align-items-center gap-1">
              <span style="width: 2rem"><font-awesome-icon :icon="['fas', 'xmark']" /></span>
              <TextInput type="number" name="multiplier" />
            </div>
            <div class="d-flex flex-row justify-content-between">
              <button class="btn btn-secondary px-2" type="reset" @click="partials = undefined">
                {{ $t('actions.clear') }}
              </button>
              <button :disabled="!meta.valid" class="btn btn-primary px-2" type="submit">
                {{ $t('actions.calculate') }}
              </button>
            </div>
          </div>
        </Form>
      </div>
      <div class="section p-2 d-flex flex-column" v-if="partials">
        <template v-for="partial of partials">
          <span>+ {{ partial }}</span>
        </template>
        <hr class="my-2" />
        <span>
          =
          {{
            partials.reduce((accumulator, currentValue) => {
              return accumulator + currentValue
            }, 0)
          }}
        </span>
      </div>
    </div>
  </div>
</template>
