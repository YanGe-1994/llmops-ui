<script setup lang="ts">
import { ref, computed } from 'vue'

// 定义知识库接口
interface Knowledge {
  id: string
  name: string
  icon?: string
  description?: string
}

// Props
interface Props {
  visible: boolean
  selectedKnowledges?: string[] // 已选中的知识库ID列表
  maxSelect?: number // 最多可选择数量
}

// Emits
interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', knowledges: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  selectedKnowledges: () => [],
  maxSelect: 5,
})
const emit = defineEmits<Emits>()

// 当前选中的知识库
const currentSelected = ref<string[]>([...props.selectedKnowledges])

// 知识库列表（示例数据）
const knowledgeList: Knowledge[] = [
  {
    id: 'langchain',
    name: 'LangChain翻译文档',
    icon: '📚',
  },
  {
    id: 'llmops-api',
    name: '睿课LLMOps项目API文档',
    icon: '📘',
  },
  {
    id: 'llmops-demo',
    name: 'LLMOps项目提示词文档',
    icon: '📄',
  },
  {
    id: 'llmops-source',
    name: '睿课LLMOps项目前端源码',
    icon: '💻',
  },
  {
    id: 'ecommerce',
    name: '合成电商数据合集',
    icon: '🛒',
  },
]

// 已选数量
const selectedCount = computed(() => currentSelected.value.length)

// 是否达到最大选择数量
const isMaxSelected = computed(() => selectedCount.value >= props.maxSelect)

// 判断知识库是否已选中
const isSelected = (id: string) => {
  return currentSelected.value.includes(id)
}

// 切换选中状态
const toggleSelect = (id: string) => {
  const index = currentSelected.value.indexOf(id)
  if (index > -1) {
    // 已选中，取消选择
    currentSelected.value.splice(index, 1)
  } else {
    // 未选中，添加选择
    if (isMaxSelected.value) {
      // 已达到最大数量，不允许继续选择
      return
    }
    currentSelected.value.push(id)
  }
}

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
  // 重置为初始选中状态
  currentSelected.value = [...props.selectedKnowledges]
}

// 取消
const handleCancel = () => {
  handleClose()
}

// 确认
const handleConfirm = () => {
  emit('confirm', currentSelected.value)
  emit('update:visible', false)
}
</script>

<template>
  <a-drawer
    :visible="visible"
    :width="500"
    :footer="false"
    :header="false"
    :body-style="{ padding: 0 }"
    placement="right"
    unmount-on-close
    @cancel="handleClose"
  >
    <div class="h-full flex flex-col">
      <!-- 顶部标题栏 -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium">选择引用知识库</h2>
        <a-button type="text" @click="handleClose">
          <icon-close :size="18" />
        </a-button>
      </div>

      <!-- 知识库列表 -->
      <div class="flex-1 overflow-y-auto p-6">
        <div class="space-y-2">
          <div
            v-for="knowledge in knowledgeList"
            :key="knowledge.id"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all',
              isSelected(knowledge.id)
                ? 'bg-blue-50 border-2 border-blue-500'
                : 'border-2 border-gray-200 hover:border-gray-300',
              !isSelected(knowledge.id) && isMaxSelected ? 'opacity-50 cursor-not-allowed' : '',
            ]"
            @click="toggleSelect(knowledge.id)"
          >
            <!-- 知识库图标 -->
            <div
              class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0 text-white text-xl"
            >
              {{ knowledge.icon || '📚' }}
            </div>

            <!-- 知识库信息 -->
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-800">
                {{ knowledge.name }}
              </div>
              <div v-if="knowledge.description" class="text-xs text-gray-500 mt-0.5">
                {{ knowledge.description }}
              </div>
            </div>

            <!-- 选中标识 -->
            <div v-if="isSelected(knowledge.id)" class="shrink-0">
              <icon-check-circle-fill :size="20" class="text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <div class="text-sm text-gray-500">
          {{ selectedCount }} 个知识库被选中
        </div>
        <div class="flex gap-2">
          <a-button @click="handleCancel">取消</a-button>
          <a-button type="primary" @click="handleConfirm">添加</a-button>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
