<script setup lang="ts" />

<template>
  <div>
    <small>{{ $t('authentication.password-validation.label') }}</small>
    <ul class="mb-0" style="list-style-type: circle">
      <li>
        <small>{{ $t('authentication.password-validation.contains.1') }}</small>
      </li>
      <li>
        <small>{{ $t('authentication.password-validation.contains.2') }}</small>
      </li>
      <li>
        <small>{{ $t('authentication.password-validation.contains.3') }}</small>
      </li>
      <li>
        <small>{{ $t('authentication.password-validation.contains.4') }}</small>
      </li>
    </ul>
  </div>
</template>
