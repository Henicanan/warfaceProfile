<script setup>
import { onMounted, ref, watch } from 'vue'
import { userApi } from '../api/user'
import { achievementApi } from '../api/achivment'
import { computed } from '@vue/reactivity'
import { watchDebounced } from '@vueuse/core'

const isAcheivementLoading = ref(false)
const isSearching = ref(false)

const search = ref('')
let achievements = {}
const userAchievements = ref([])
const validAchievements = computed(() => {
  return userAchievements.value.filter((value) => {
    return achievements[value.achievement_id]
  })
})
const finished = computed(() => {
  return validAchievements.value.filter((value) => {
    return value.completion_time
  })
})
const unfinished = computed(() => {
  return validAchievements.value.filter((value) => {
    return !value.completion_time
  })
})

const isLoading = computed(() => {
  return isAcheivementLoading.value && isSearching.value
})

onMounted(async () => {
  search.value = localStorage.getItem('search')
  try {
    isAcheivementLoading.value = true
    const response = await achievementApi.getCatalog()
    achievements = response.reduce((prev, current) => {
      return { ...prev, ...{ [current.id]: current.name } }
    }, {})
  } finally {
    isAcheivementLoading.value = false
  }
})

watchDebounced(
  search,
  async () => {
    localStorage.setItem('search', search.value)
    try {
      isSearching.value = true
      userAchievements.value = await userApi.getAchievements(search.value)
    } finally {
      isSearching.value = false
    }
  },
  { debounce: 500 }
)
</script>

<template>
  <div class="container">
    <div class="card">
      <h1 class="title">Поиск по имени</h1>
      <el-input class="input" v-model="search" placeholder="Введите имя" />
      <div class="wrapper">
        <div class="list">
          <div class="list-header">
            <p class="acheivement-list-title">Полученные достижения</p>
          </div>
          <ul class="acheivement-list">
            <el-skeleton v-if="isLoading" />
            <template v-else>
              <li class="acheivement" v-for="item in finished" :key="item.achievement_id">
                <p class="acheivement-name">{{ achievements[item.achievement_id] }}</p>
                <span>{{ item.progress }}</span>
              </li>
            </template>
          </ul>
        </div>
        <div class="list">
          <div class="list-header">
            <p class="acheivement-list-title">Не полученные достижения</p>
          </div>
          <ul class="acheivement-list">
            <el-skeleton v-if="isLoading" />
            <template v-else>
              <li class="acheivement" v-for="item in unfinished" :key="item.achievement_id">
                <p class="acheivement-name">{{ achievements[item.achievement_id] }}</p>
                <span>{{ item.progress }}</span>
              </li>
            </template>
          </ul>
        </div>
      </div>
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
  padding-top: 40px;
}

.wrapper {
  display: flex;
  gap: 16px;
}

.input {
  margin-bottom: 16px;
}

.title {
  margin-bottom: 16px;
  font-size: 150%;
}

.list {
  width: 100%;
}

.acheivement {
  padding: 6px 0px;
  border-bottom: 1px solid var(--black-white-gray-300);

  &:last-child {
    border-bottom: none;
  }
}

.acheivement-list {
  border: 1px solid var(--black-white-gray-300);
  padding: 8px 16px;
  border-radius: 8px;
  border-top: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.list-header {
  border: 1px solid var(--black-white-gray-500);
  padding: 8px 16px;
  border-radius: 8px;
  border-bottom: none;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  background: var(--black-white-gray-10);
}

.acheivement-name {
  font-weight: 500;
}

.acheivement-list-title {
  font-weight: 500;
  font-size: 125%;
  color: var(--black-white-gray-700);
}

.card {
  width: 720px;
  padding: 16px;
  border-radius: 16px;
  background: var(--black-white-white);
}
</style>
