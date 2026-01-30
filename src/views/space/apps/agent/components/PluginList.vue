<script setup lang="ts">
// 插件接口
export interface SelectedPlugin {
  id: string
  name: string
  description?: string
  icon?: string
}

// Props
interface Props {
  plugins: SelectedPlugin[]
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
    <p v-if="plugins.length === 0" class="text-xs text-gray-400">暂未添加插件</p>
    <div
      v-for="plugin in plugins"
      :key="plugin.id"
      class="flex items-center gap-3 p-3 rounded border border-gray-200 hover:border-gray-300 transition-colors"
    >
      <!-- 插件图标 -->
      <div class="w-10 h-10 rounded bg-gray-100 flex items-center justify-center shrink-0">
        <icon-apps :size="20" class="text-gray-600" />
      </div>

      <!-- 插件信息 -->
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-gray-800">{{ plugin.name }}</div>
        <div v-if="plugin.description" class="text-xs text-gray-500 mt-0.5 truncate">
          {{ plugin.description }}
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center gap-1 shrink-0">
        <a-button type="text" size="small" @click="emit('settings', plugin.id)">
          <icon-settings :size="14" class="text-gray-400" />
        </a-button>
        <a-button type="text" size="small" @click="emit('remove', plugin.id)">
          <icon-delete :size="14" class="text-gray-400" />
        </a-button>
      </div>
    </div>
  </div>
</template>
