<script setup lang="ts">
import { computed } from 'vue'

// 能力项接口
export interface CapabilityItemData {
  id: string
  title: string
  description?: string
  expanded: boolean
  enabled?: boolean
  hasAdd?: boolean
  content?: any
}

// Props
interface Props {
  capability: CapabilityItemData
}

// Emits
interface Emits {
  (e: 'toggle'): void
  (e: 'toggle-enabled'): void
  (e: 'add'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 是否显示开关
const hasSwitch = computed(() => props.capability.enabled !== undefined)

// 是否显示添加按钮
const hasAddButton = computed(() => props.capability.hasAdd)
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200">
    <!-- 能力项头部 -->
    <div
      class="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
      @click="emit('toggle')"
    >
      <div class="flex items-center gap-2">
        <icon-down
          :size="14"
          :class="{ 'transform rotate-180': !capability.expanded }"
          class="text-gray-400 transition-transform"
        />
        <span class="text-sm font-medium">{{ capability.title }}</span>
      </div>
      <div class="flex items-center gap-2">
        <a-switch
          v-if="hasSwitch"
          :model-value="capability.enabled"
          size="small"
          @click.stop
          @change="emit('toggle-enabled')"
        >
          <template #checked>开启</template>
          <template #unchecked>关闭</template>
        </a-switch>
        <a-button v-if="hasAddButton" type="text" size="small" @click.stop="emit('add')">
          <icon-plus :size="14" />
        </a-button>
      </div>
    </div>

    <!-- 能力项内容 -->
    <div v-if="capability.expanded" class="px-4 pb-4 pt-2 border-t border-gray-100">
      <slot></slot>
    </div>
  </div>
</template>
