<script setup lang="ts" />

<template>
  <div id="footer" class="align-items-stretch">
    <div class="container-lg d-flex px-3 py-2">
      <div class="d-flex flex-grow-1 align-items-center">
        {{ $t('footer.legal', { year: new Date().getFullYear() }) }}
      </div>
    </div>
  </div>
</template>
