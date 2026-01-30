<script setup lang="ts">
// 知识库接口
export interface SelectedKnowledge {
  id: string
  name: string
  icon?: string
  description?: string
}

// Props
interface Props {
  knowledges: SelectedKnowledge[]
}

// Emits
interface Emits {
  (e: 'remove', id: string): void
  (e: 'settings', id: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <div class="space-y-2">
    <p v-if="knowledges.length === 0" class="text-xs text-gray-400">暂未添加知识库</p>
    <div
      v-for="knowledge in knowledges"
      :key="knowledge.id"
      class="flex items-center gap-3 p-3 rounded border border-gray-200 hover:border-gray-300 transition-colors"
    >
      <!-- 知识库图标 -->
      <div
        class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0 text-white text-xl"
      >
        {{ knowledge.icon || '📚' }}
      </div>

      <!-- 知识库信息 -->
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-gray-800">{{ knowledge.name }}</div>
        <div v-if="knowledge.description" class="text-xs text-gray-500 mt-0.5 truncate">
          {{ knowledge.description }}
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center gap-1 shrink-0">
        <a-button type="text" size="small" @click="emit('settings', knowledge.id)">
          <icon-settings :size="14" class="text-gray-400" />
        </a-button>
        <a-button type="text" size="small" @click="emit('remove', knowledge.id)">
          <icon-delete :size="14" class="text-gray-400" />
        </a-button>
      </div>
    </div>
  </div>
</template>
