<script setup lang="ts" />

<template>
  <div>
    <small>{{ $t('authentication.password-validation.label') }}</small>
    <ul class="mb-0" style="list-style-type: circle">
      <template v-for="(, idx) of [...Array(4)]" :key="idx">
        <li>
          <small>{{ $t(`authentication.password-validation.contains.${idx + 1}`) }}</small>
        </li>
      </template>
    </ul>
  </div>
</template>
