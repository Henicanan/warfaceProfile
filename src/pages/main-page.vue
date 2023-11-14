<script setup>
import { ref, watch } from 'vue'
import { userApi } from '../api/user'

const search = ref('')

watch(search, () => {
  userApi.getAchievements(search.value)
})
</script>

<template>
  <div class="container">
    <div class="card">
      <h1 class="title">Поиск по имени</h1>
      <el-input v-model="search" placeholder="Введите имя" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  min-height: 100vh;
  background: var(--black-white-gray-800);
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  margin-bottom: 16px;
}

.card {
  width: 360px;
  padding: 16px;
  border-radius: 16px;
  background: var(--black-white-white);
}
</style>
