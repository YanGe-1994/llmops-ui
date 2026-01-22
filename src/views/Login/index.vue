<script setup lang="ts">
import { debug } from '@/services/test.ts'

const debugFn = async () => {
  const data = await debug({ query: '你是谁' })
  console.log('data', data)
}
</script>

<template>
  <a-button @click="debugFn">发起请求</a-button>
</template>

<style scoped></style>
