<template>
  <div class="h-full">
    <iframe class="wh-full" :src="src"></iframe>
  </div>
</template>

<script setup lang="ts">
const src = 'http://localhost:8848/nacos/index.html';
</script>
<style scoped></style>
