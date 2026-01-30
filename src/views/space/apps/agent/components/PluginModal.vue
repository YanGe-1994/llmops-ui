<script setup lang="ts">
import { ref, computed } from 'vue'

// 定义插件接口
interface Plugin {
  id: string
  name: string
  description?: string
  icon?: string
  category?: string
  provider?: string // 插件提供商
  type: 'custom' | 'builtin' // 插件类型
}

// Props
interface Props {
  visible: boolean
  selectedPlugins?: string[] // 已选中的插件ID列表
}

// Emits
interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'select', plugin: Plugin): void
}

const props = withDefaults(defineProps<Props>(), {
  selectedPlugins: () => [],
})
const emit = defineEmits<Emits>()

// 当前选中的插件类型
const selectedType = ref<'custom' | 'builtin'>('builtin')

// 选中的分类
const selectedCategory = ref('all')

// 自定义插件分类
const customCategories = [
  { id: 'all', name: '全部', icon: 'icon-apps' },
  { id: 'custom', name: '自定义插件', icon: 'icon-file' },
]

// 内置插件分类
const builtinCategories = [
  { id: 'all', name: '全部', icon: 'icon-apps' },
  { id: 'search', name: '搜索', icon: 'icon-search' },
  { id: 'weather', name: '天气', icon: 'icon-thunderbolt' },
  { id: 'travel', name: '旅行', icon: 'icon-compass' },
]

// 当前分类列表
const currentCategories = computed(() => {
  return selectedType.value === 'custom' ? customCategories : builtinCategories
})

// 当前插件类型标题
const currentTypeTitle = computed(() => {
  return selectedType.value === 'custom' ? '自定义插件' : '内置插件'
})

// 内置插件列表
const builtInPlugins: Plugin[] = [
  // Google 系列
  {
    id: 'google',
    name: 'Google',
    category: 'search',
    provider: 'Google',
    type: 'builtin',
    icon: 'icon-google',
  },
  {
    id: 'google-search',
    name: '谷歌搜索',
    category: 'search',
    provider: 'Google',
    type: 'builtin',
    icon: 'icon-search',
  },
  {
    id: 'google-serper-api',
    name: 'Google Serper API',
    category: 'search',
    provider: 'Google',
    type: 'builtin',
    icon: 'icon-google',
  },
  {
    id: 'google-jobs-api',
    name: 'Google Jobs API',
    category: 'search',
    provider: 'Google',
    type: 'builtin',
    icon: 'icon-user-group',
  },
  {
    id: 'google-news-api',
    name: 'Google News API',
    category: 'search',
    provider: 'Google',
    type: 'builtin',
    icon: 'icon-notification',
  },
  {
    id: 'youtube-api',
    name: 'YouTube 视频 API',
    category: 'search',
    provider: 'Google',
    type: 'builtin',
    icon: 'icon-play-circle',
  },
  // DuckDuckGo 系列
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    category: 'search',
    provider: 'DuckDuckGo',
    type: 'builtin',
    icon: 'icon-find-replace',
  },
  {
    id: 'duckduckgo-ai',
    name: 'DuckDuckGo AI问天',
    category: 'search',
    provider: 'DuckDuckGo',
    type: 'builtin',
    icon: 'icon-robot',
  },
  {
    id: 'duckduckgo-image',
    name: 'DuckDuckGo 图片搜索',
    category: 'search',
    provider: 'DuckDuckGo',
    type: 'builtin',
    icon: 'icon-image',
  },
  {
    id: 'duckduckgo-search',
    name: 'DuckDuckGo 搜索',
    category: 'search',
    provider: 'DuckDuckGo',
    type: 'builtin',
    icon: 'icon-search',
  },
  {
    id: 'duckduckgo-translate',
    name: 'DuckDuckGo 翻译',
    category: 'search',
    provider: 'DuckDuckGo',
    type: 'builtin',
    icon: 'icon-language',
  },
  // SerperApi
  {
    id: 'serper-api',
    name: 'SerperApi',
    category: 'search',
    provider: 'SerperApi',
    type: 'builtin',
    icon: 'icon-code',
  },
]

// 自定义插件列表（示例）
const customPlugins: Plugin[] = []

// 当前插件列表
const currentPlugins = computed(() => {
  return selectedType.value === 'custom' ? customPlugins : builtInPlugins
})

// 过滤后的插件列表
const filteredPlugins = computed(() => {
  let plugins = currentPlugins.value

  // 按分类过滤
  if (selectedCategory.value !== 'all') {
    if (selectedType.value === 'custom') {
      // 自定义插件筛选
      plugins = plugins.filter((p) => p.type === 'custom')
    } else {
      // 内置插件按场景分类筛选
      plugins = plugins.filter((p) => p.category === selectedCategory.value)
    }
  }

  return plugins
})

// 按提供商分组的插件
const pluginsByProvider = computed(() => {
  const grouped: Record<string, Plugin[]> = {}

  filteredPlugins.value.forEach((plugin) => {
    const provider = plugin.provider || '其他'
    if (!grouped[provider]) {
      grouped[provider] = []
    }
    grouped[provider].push(plugin)
  })

  return grouped
})

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
}

// 选择插件
const handleSelectPlugin = (plugin: Plugin) => {
  emit('select', plugin)
}

// 判断插件是否已选中
const isPluginSelected = (pluginId: string) => {
  return props.selectedPlugins.includes(pluginId)
}

// 切换插件类型
const switchType = (type: 'custom' | 'builtin') => {
  selectedType.value = type
  selectedCategory.value = 'all'
}

// 创建自定义插件
const handleCreateCustomPlugin = () => {
  console.log('创建自定义插件')
  // TODO: 实现创建自定义插件功能
}
</script>

<template>
  <a-drawer
    :visible="visible"
    :width="900"
    :footer="false"
    :header="false"
    :body-style="{ padding: 0 }"
    placement="right"
    unmount-on-close
    @cancel="handleClose"
  >
    <div class="h-full flex">
      <!-- 左侧：分类导航 -->
      <div class="w-56 bg-gray-50 flex flex-col">
        <!-- 标题 -->
        <div class="px-4 py-4">
          <h2 class="text-base font-medium text-gray-800">添加插件</h2>
        </div>

        <!-- 创建自定义插件按钮 -->
        <div class="px-4 pb-4">
          <a-button type="primary" long class="rounded-full" @click="handleCreateCustomPlugin">
            <template #icon>
              <icon-plus />
            </template>
            创建自定义插件
          </a-button>
        </div>

        <!-- 插件类型切换 -->
        <div class="px-4 pb-4">
          <div class="space-y-1">
            <div
              :class="[
                'flex items-center gap-2 px-3 py-2 rounded cursor-pointer text-sm transition-colors',
                selectedType === 'custom'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
              @click="switchType('custom')"
            >
              <icon-file :size="16" />
              <span>自定义插件</span>
            </div>
            <div
              :class="[
                'flex items-center gap-2 px-3 py-2 rounded cursor-pointer text-sm transition-colors',
                selectedType === 'builtin'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
              @click="switchType('builtin')"
            >
              <icon-book :size="16" />
              <span>内置插件</span>
            </div>
          </div>
        </div>

        <!-- 场景分类 -->
        <div class="flex-1 overflow-y-auto px-4">
          <div class="text-xs text-gray-400 mb-3">类别</div>
          <div class="space-y-1">
            <div
              v-for="category in currentCategories"
              :key="category.id"
              :class="[
                'flex items-center gap-2 px-3 py-2 rounded cursor-pointer text-sm transition-colors',
                selectedCategory === category.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
              @click="selectedCategory = category.id"
            >
              <component :is="category.icon" :size="14" />
              <span>{{ category.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：插件列表 -->
      <div class="flex-1 flex flex-col overflow-hidden bg-white">
        <!-- 顶部标题栏 -->
        <div class="flex items-center justify-between px-6 py-4">
          <h2 class="text-lg font-medium">{{ currentTypeTitle }}</h2>
          <a-button type="text" @click="handleClose">
            <icon-close :size="18" />
          </a-button>
        </div>

        <!-- 插件列表 -->
        <div class="flex-1 overflow-y-auto">
          <!-- 自定义插件为空状态 -->
          <div
            v-if="selectedType === 'custom' && customPlugins.length === 0"
            class="flex flex-col items-center justify-center h-full text-gray-400"
          >
            <icon-empty :size="80" class="mb-4" />
            <div class="text-base mb-2">暂无自定义插件</div>
            <div class="text-sm text-gray-400 mb-6">点击左上方按钮创建您的第一个插件</div>
          </div>

          <!-- 按提供商分组显示插件 -->
          <div v-else class="p-6">
            <div
              v-for="(plugins, provider) in pluginsByProvider"
              :key="provider"
              class="mb-8 last:mb-0"
            >
              <!-- 提供商标题 -->
              <div class="flex items-center gap-2 mb-4">
                <div class="text-base font-medium text-gray-800">{{ provider }}</div>
                <div class="text-xs text-gray-400">({{ plugins.length }})</div>
              </div>

              <!-- 插件列表 - 一行一个 -->
              <div class="space-y-2">
                <div
                  v-for="plugin in plugins"
                  :key="plugin.id"
                  :class="[
                    'flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all',
                    isPluginSelected(plugin.id)
                      ? 'bg-blue-50 border border-blue-400'
                      : 'hover:bg-gray-50',
                  ]"
                  @click="handleSelectPlugin(plugin)"
                >
                  <!-- 插件图标 -->
                  <div
                    class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0"
                  >
                    <component
                      :is="plugin.icon || 'icon-apps'"
                      :size="20"
                      class="text-white"
                    />
                  </div>

                  <!-- 插件信息 -->
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-800">
                      {{ plugin.name }}
                    </div>
                    <div v-if="plugin.description" class="text-xs text-gray-500 mt-0.5">
                      {{ plugin.description }}
                    </div>
                  </div>

                  <!-- 选中标识 -->
                  <div v-if="isPluginSelected(plugin.id)" class="shrink-0">
                    <icon-check-circle-fill :size="20" class="text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div
              v-if="Object.keys(pluginsByProvider).length === 0"
              class="flex flex-col items-center justify-center py-20 text-gray-400"
            >
              <icon-empty :size="64" class="mb-3" />
              <span class="text-sm">暂无插件</span>
            </div>
          </div>
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
