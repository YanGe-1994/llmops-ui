<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { debug } from '@/services/test.ts'
import PluginModal from './components/PluginModal.vue'
import KnowledgeModal from './components/KnowledgeModal.vue'
import CapabilityItem from './components/CapabilityItem.vue'
import type { SelectedPlugin } from './components/PluginList.vue'
import PluginList from './components/PluginList.vue'
import type { SelectedKnowledge } from './components/KnowledgeList.vue'
import KnowledgeList from './components/KnowledgeList.vue'

// ==================== 数据定义 ====================

// 应用基本信息
const appInfo = reactive({
  name: '聊天机器人',
  team: '个人空间',
  status: '草稿',
  lastSaved: '23:18:15',
})

// 当前选中的标签页
const activeTab = ref('edit')

// 模型选择
const selectedModel = ref('GPT-4o')
const modelOptions = ['GPT-4o', 'GPT-3.5', 'Claude-3', 'Claude-2']

// 人设与回复逻辑
const personality = ref(`# 角色
你是一个智能聊天机器人，能够与用户进行各种话题的交流，包括但不限于生活、工作、学习、娱乐等。

## 技能
### 技能 1: 日常交流
1. 能够分享日常生活经验，给予积极的回应和适当的建议。
2. 对于用户的心情表达，提供安慰和鼓励。

### 技能 2: 知识解答
1. 当用户提出问题，运用知识库和搜索工具提供准确、详细的答案。
2. 对于复杂问题，分步骤进行讲解。

### 技能 3: 娱乐互动
1. 能与用户玩文字游戏，如猜谜语、成语接龙等。
2. 推荐有趣的娱乐活动和节目。

## 限制:
- 应该友好积极、友善、文明，不得包含不当言论。
- 所输出的内容必须深刻照顾到定义的角色和行为，不能偏离既定的架构。
- 对于不确定的问题，应明确告知用户并尽力提供帮助信息以及建议。`)

// 应用能力配置项
interface CapabilityItem {
  id: string
  title: string
  description?: string
  expanded: boolean
  enabled?: boolean
  hasAdd?: boolean
  content?: any
}

const capabilities = ref<CapabilityItem[]>([
  {
    id: 'plugins',
    title: '扩展插件',
    expanded: false,
    hasAdd: true,
  },
  {
    id: 'workflow',
    title: '工作流组件',
    description:
      '工作流支持通过可视化的方式，对插件、大语言模型、代码块等进行串联，从而实现复杂的业务流程编排，例如旅行规划、报告分析。',
    expanded: true,
    hasAdd: true,
  },
  {
    id: 'knowledge',
    title: '知识库',
    description: '引用文本类型的知识库，实现知识问答，应用最多支持关联 5 个知识库。',
    expanded: true,
    hasAdd: true,
  },
  {
    id: 'memory',
    title: '长期记忆',
    description: '给结果关于话的内容，并用于更好的应用内的消息。',
    expanded: true,
    enabled: true,
  },
  {
    id: 'opening',
    title: '对话开场白',
    expanded: true,
    hasAdd: true,
    content: {
      text: '',
      questions: [''],
    },
  },
  {
    id: 'suggestions',
    title: '用户问题建议',
    description: '在应用回复后，自动推荐对话的3条用户问题建议。',
    expanded: true,
    enabled: true,
  },
  {
    id: 'voiceInput',
    title: '语音输入',
    description: '启用后，您可以使用语音输入。',
    expanded: true,
    enabled: true,
  },
  {
    id: 'voiceOutput',
    title: '语音输出',
    description: '在 Bot 回复后，自动根据回话内容提供3条用户问题建议',
    expanded: true,
    enabled: false,
  },
  {
    id: 'contentReview',
    title: '内容审查',
    description: '对用户输入以及大语言模型输出进行内容审查',
    expanded: true,
    enabled: false,
  },
])

// 聊天消息
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  avatar?: string
  name?: string
  tokens?: number
  time?: number
}

const messages = ref<Message[]>([])

// 建议问题
const suggestedQuestions = ref([
  'LLM 大语言模型有什么应用场景？',
  '有哪些主流的LLM模型？',
  'LLM与Agent之间的关系是什么？',
])

// 用户输入
const userInput = ref('')

// loading状态
const isLoading = ref(false)

// 消息容器ref
const messagesContainer = ref<HTMLElement | null>(null)

// 已选插件列表
const selectedPlugins = ref<SelectedPlugin[]>([])

// 插件弹窗显示状态
const pluginModalVisible = ref(false)

// 已选知识库列表
const selectedKnowledges = ref<SelectedKnowledge[]>([])

// 知识库弹窗显示状态
const knowledgeModalVisible = ref(false)

// 知识库数据映射（用于根据ID获取完整信息）
const knowledgeMap: Record<string, SelectedKnowledge> = {
  langchain: { id: 'langchain', name: 'LangChain翻译文档', icon: '📚' },
  'llmops-api': { id: 'llmops-api', name: '睿课LLMOps项目API文档', icon: '📘' },
  'llmops-demo': { id: 'llmops-demo', name: 'LLMOps项目提示词文档', icon: '📄' },
  'llmops-source': { id: 'llmops-source', name: '睿课LLMOps项目前端源码', icon: '💻' },
  ecommerce: { id: 'ecommerce', name: '合成电商数据合集', icon: '🛒' },
}

// ==================== 方法定义 ====================

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 切换能力项展开状态
const toggleCapability = (id: string) => {
  const item = capabilities.value.find((c) => c.id === id)
  if (item) {
    item.expanded = !item.expanded
  }
}

// 切换能力项启用状态
const toggleEnabled = (id: string) => {
  const item = capabilities.value.find((c) => c.id === id)
  if (item && item.enabled !== undefined) {
    item.enabled = !item.enabled
  }
}

// 发送消息
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  // 添加用户消息
  messages.value.push({
    id: Date.now().toString(),
    role: 'user',
    content: userInput.value,
    avatar: '👤',
    name: '焚影',
  })

  // 清空输入
  const question = userInput.value
  userInput.value = ''

  // 滚动到底部
  scrollToBottom()

  // 设置loading状态
  isLoading.value = true

  // 记录开始时间
  const startTime = Date.now()

  try {
    const { data } = await debug({ query: question })
    let { content } = data
    content = JSON.parse(content)

    // 计算实际耗时（秒）
    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(1)

    // 获取返回内容
    const responseContent = `${content.talk}`

    // AI 回复
    messages.value.push({
      id: Date.now().toString(),
      role: 'assistant',
      content: responseContent,
      avatar: '🤖',
      name: 'ChatGPT聊天机器人',
      tokens: responseContent.length, // 使用字符串长度作为token数
      time: parseFloat(duration), // 使用实际耗时
    })

    // 滚动到底部
    scrollToBottom()
  } catch (error) {
    console.error('发送消息失败:', error)
    Message.error('发送消息失败，请重试')
  } finally {
    // 关闭loading状态
    isLoading.value = false
  }
}

// 点击建议问题
const clickSuggestion = (question: string) => {
  userInput.value = question
  sendMessage()
}

// 添加开场白问题
const addOpeningQuestion = () => {
  const opening = capabilities.value.find((c) => c.id === 'opening')
  if (opening?.content?.questions) {
    opening.content.questions.push('')
  }
}

// 删除开场白问题
const removeOpeningQuestion = (index: number) => {
  const opening = capabilities.value.find((c) => c.id === 'opening')
  if (opening?.content?.questions) {
    opening.content.questions.splice(index, 1)
  }
}

// 复制消息
const copyMessage = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    Message.success('复制成功')
  } catch (error) {
    console.error('复制失败:', error)
    Message.error('复制失败，请重试')
  }
}

// 删除消息
const deleteMessage = (id: string) => {
  const index = messages.value.findIndex((msg) => msg.id === id)
  if (index !== -1) {
    messages.value.splice(index, 1)
  }
}

// 清空所有消息
const clearAllMessages = () => {
  messages.value = []
}

// 上传图片
const uploadImage = () => {
  // 创建文件选择器
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      // 这里可以处理图片上传逻辑
      console.log('选择的图片:', file)
      Message.info('图片上传功能开发中')
    }
  }
  input.click()
}

// 打开插件弹窗
const openPluginModal = () => {
  pluginModalVisible.value = true
}

// 选择插件
const handleSelectPlugin = (plugin: any) => {
  // 检查是否已添加
  const exists = selectedPlugins.value.find((p) => p.id === plugin.id)
  if (exists) {
    Message.warning('该插件已添加')
    return
  }

  // 添加插件
  selectedPlugins.value.push({
    id: plugin.id,
    name: plugin.name,
    description: plugin.description,
    icon: plugin.icon,
  })
  Message.success('插件添加成功')
}

// 移除插件
const handleRemovePlugin = (id: string) => {
  const index = selectedPlugins.value.findIndex((p) => p.id === id)
  if (index !== -1) {
    selectedPlugins.value.splice(index, 1)
    Message.success('插件已移除')
  }
}

// 插件设置
const handlePluginSettings = (id: string) => {
  console.log('插件设置:', id)
  Message.info('插件设置功能开发中')
}

// 打开知识库弹窗
const openKnowledgeModal = () => {
  knowledgeModalVisible.value = true
}

// 确认选择知识库
const handleConfirmKnowledges = (knowledgeIds: string[]) => {
  // 清空当前选择
  selectedKnowledges.value = []

  // 根据ID获取完整信息并添加
  knowledgeIds.forEach((id) => {
    const knowledge = knowledgeMap[id]
    if (knowledge) {
      selectedKnowledges.value.push(knowledge)
    }
  })

  Message.success(`已添加 ${knowledgeIds.length} 个知识库`)
}

// 移除知识库
const handleRemoveKnowledge = (id: string) => {
  const index = selectedKnowledges.value.findIndex((k) => k.id === id)
  if (index !== -1) {
    selectedKnowledges.value.splice(index, 1)
    Message.success('知识库已移除')
  }
}

// 知识库设置
const handleKnowledgeSettings = (id: string) => {
  console.log('知识库设置:', id)
  Message.info('知识库设置功能开发中')
}
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- ==================== 顶部导航栏 ==================== -->
    <header
      class="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0"
    >
      <!-- 左侧 -->
      <div class="flex items-center gap-3">
        <a-button type="text" class="p-1">
          <icon-left :size="20" />
        </a-button>
        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <icon-robot class="text-blue-600" :size="18" />
        </div>
        <div class="flex items-center gap-2">
          <span class="font-medium text-sm">{{ appInfo.name }}</span>
          <icon-edit :size="14" class="text-gray-400 cursor-pointer" />
        </div>
        <div class="flex items-center gap-1 text-xs text-gray-500">
          <icon-user :size="12" />
          <span>{{ appInfo.team }}</span>
        </div>
        <a-tag size="small" color="gray">{{ appInfo.status }}</a-tag>
        <div class="flex items-center gap-1 text-xs text-gray-400">
          <icon-clock-circle :size="12" />
          <span>已自动保存 {{ appInfo.lastSaved }}</span>
        </div>
      </div>

      <!-- 中间标签 -->
      <div class="flex items-center gap-6">
        <a-link
          :class="{ 'text-blue-600 font-medium': activeTab === 'edit' }"
          @click="activeTab = 'edit'"
        >
          编排
        </a-link>
        <a-link
          :class="{ 'text-blue-600 font-medium': activeTab === 'publish' }"
          @click="activeTab = 'publish'"
        >
          发布配置
        </a-link>
        <a-link
          :class="{ 'text-blue-600 font-medium': activeTab === 'stats' }"
          @click="activeTab = 'stats'"
        >
          统计分析
        </a-link>
      </div>

      <!-- 右侧 -->
      <div class="flex items-center gap-3">
        <a-button type="text">
          <icon-history :size="18" />
        </a-button>
        <a-button type="primary">更新发布</a-button>
      </div>
    </header>

    <!-- ==================== 主内容区域 ==================== -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧：应用编排 -->
      <div class="flex-1 flex flex-col border-r border-gray-200">
        <!-- 应用编排头部 -->
        <div class="p-4 border-b border-gray-100 flex items-center gap-3">
          <h3 class="text-sm font-medium">应用编排</h3>
          <a-select v-model="selectedModel" class="max-w-max">
            <a-option v-for="model in modelOptions" :key="model" :value="model">
              <div class="flex items-center gap-2">
                <icon-robot :size="14" />
                <span>{{ model }}</span>
              </div>
            </a-option>
          </a-select>
        </div>

        <!-- 应用编排内容区域 -->
        <div class="flex-1 flex overflow-hidden">
          <!-- 人设与回复逻辑 -->
          <div class="w-96 border-r border-gray-200 flex flex-col overflow-hidden">
            <div class="flex-1 overflow-y-auto p-4">
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm font-medium">人设与回复逻辑</h4>
                <a-button type="text" size="small">
                  <icon-sync :size="14" class="mr-1" />
                  优化
                </a-button>
              </div>
              <a-textarea
                v-model="personality"
                :auto-size="{ minRows: 20, maxRows: 30 }"
                placeholder="请输入人设与回复逻辑"
                class="font-mono text-xs"
              />
            </div>
          </div>

          <!-- 应用能力 -->
          <div class="flex-1 bg-gray-50 overflow-y-auto p-6">
            <div class="max-w-3xl mx-auto">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-medium">应用能力</h3>
              </div>

              <div class="space-y-3">
                <!-- 扩展插件 -->
                <CapabilityItem
                  :capability="capabilities.find((c) => c.id === 'plugins')!"
                  @toggle="toggleCapability('plugins')"
                  @toggle-enabled="toggleEnabled('plugins')"
                  @add="openPluginModal"
                >
                  <p
                    v-if="capabilities.find((c) => c.id === 'plugins')?.description"
                    class="text-xs text-gray-500 mb-3"
                  >
                    {{ capabilities.find((c) => c.id === 'plugins')?.description }}
                  </p>
                  <PluginList
                    :plugins="selectedPlugins"
                    @remove="handleRemovePlugin"
                    @settings="handlePluginSettings"
                  />
                </CapabilityItem>

                <!-- 知识库 -->
                <CapabilityItem
                  :capability="capabilities.find((c) => c.id === 'knowledge')!"
                  @toggle="toggleCapability('knowledge')"
                  @add="openKnowledgeModal"
                >
                  <p
                    v-if="capabilities.find((c) => c.id === 'knowledge')?.description"
                    class="text-xs text-gray-500 mb-3"
                  >
                    {{ capabilities.find((c) => c.id === 'knowledge')?.description }}
                  </p>
                  <KnowledgeList
                    :knowledges="selectedKnowledges"
                    @remove="handleRemoveKnowledge"
                    @settings="handleKnowledgeSettings"
                  />
                </CapabilityItem>

                <!-- 其他能力项 -->
                <CapabilityItem
                  v-for="capability in capabilities.filter(
                    (c) => c.id !== 'plugins' && c.id !== 'knowledge' && c.id !== 'opening',
                  )"
                  :key="capability.id"
                  :capability="capability"
                  @toggle="toggleCapability(capability.id)"
                  @toggle-enabled="toggleEnabled(capability.id)"
                  @add="capability.hasAdd ? () => {} : undefined"
                >
                  <p v-if="capability.description" class="text-xs text-gray-500 mb-3">
                    {{ capability.description }}
                  </p>
                </CapabilityItem>

                <!-- 对话开场白 -->
                <CapabilityItem
                  :capability="capabilities.find((c) => c.id === 'opening')!"
                  @toggle="toggleCapability('opening')"
                  @add="addOpeningQuestion"
                >
                  <div class="space-y-4">
                    <div>
                      <div class="flex items-center gap-1 mb-2">
                        <span class="text-xs text-gray-600">开场白文案</span>
                        <icon-question-circle :size="12" class="text-gray-400" />
                      </div>
                      <a-input
                        v-model="capabilities.find((c) => c.id === 'opening')!.content.text"
                        placeholder="在此处填写 AI 应用的开场白"
                        size="small"
                      />
                    </div>

                    <div>
                      <div class="flex items-center gap-1 mb-2">
                        <span class="text-xs text-gray-600">开场白预设问题</span>
                        <icon-question-circle :size="12" class="text-gray-400" />
                      </div>
                      <div class="space-y-2">
                        <div
                          v-for="(question, index) in capabilities.find((c) => c.id === 'opening')!
                            .content.questions"
                          :key="index"
                          class="flex items-center gap-2"
                        >
                          <a-input
                            v-model="
                              capabilities.find((c) => c.id === 'opening')!.content.questions[
                                index as number
                              ]
                            "
                            placeholder="输入开场白引导问题"
                            size="small"
                          />
                          <a-button
                            type="text"
                            size="small"
                            @click="removeOpeningQuestion(index as number)"
                          >
                            <icon-minus-circle :size="16" class="text-gray-400" />
                          </a-button>
                        </div>
                        <a-button type="dashed" size="small" long @click="addOpeningQuestion">
                          <icon-plus :size="14" class="mr-1" />
                          添加问题
                        </a-button>
                      </div>
                    </div>
                  </div>
                </CapabilityItem>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：预览与调试 -->
      <div class="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div class="h-14 px-4 flex items-center justify-between border-b border-gray-100">
          <h3 class="text-sm font-medium">预览与调试</h3>
          <a-link class="text-xs">
            <icon-storage :size="12" class="mr-1" />
            长期记忆
          </a-link>
        </div>

        <!-- 聊天消息区域 -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
          <!-- 空状态 -->
          <div
            v-if="messages.length === 0 && !isLoading"
            class="h-full flex flex-col items-center justify-center"
          >
            <div class="w-24 h-24 mb-4 flex items-center justify-center">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23f0f0f0'/%3E%3Ctext x='50' y='65' font-size='50' text-anchor='middle'%3E🤖%3C/text%3E%3C/svg%3E"
                alt="ChatGPT"
                class="w-full h-full"
              />
            </div>
            <h3 class="text-lg font-medium text-gray-800">ChatGPT聊天机器人</h3>
          </div>

          <!-- 消息列表 -->
          <div
            v-for="message in messages"
            :key="message.id"
            :class="['flex gap-3', message.role === 'user' ? 'flex-row' : 'flex-row']"
          >
            <!-- 头像 -->
            <div
              class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-lg"
            >
              {{ message.avatar }}
            </div>

            <!-- 消息内容 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-medium text-gray-700">{{ message.name }}</span>
              </div>
              <div
                :class="[
                  'text-sm rounded-lg px-3 py-2 inline-block max-w-full',
                  message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ message.content }}
              </div>
              <div class="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <span v-if="message.time">{{ message.time }}s</span>
                <span v-if="message.tokens">{{ message.tokens }} Tokens</span>
                <div class="flex gap-2">
                  <icon-copy
                    :size="12"
                    class="cursor-pointer hover:text-gray-600"
                    @click="copyMessage(message.content)"
                  />
                  <icon-delete
                    :size="12"
                    class="cursor-pointer hover:text-gray-600"
                    @click="deleteMessage(message.id)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Loading状态 -->
          <div v-if="isLoading" class="flex gap-3">
            <div
              class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-lg"
            >
              🤖
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-medium text-gray-700">ChatGPT聊天机器人</span>
              </div>
              <div class="text-sm rounded-lg px-3 py-2 inline-block bg-gray-100 text-gray-800">
                <div class="flex items-center gap-2">
                  <icon-loading class="loading-icon" />
                  <span>正在思考中...</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 建议问题 -->
          <div v-if="suggestedQuestions.length && messages.length > 0" class="space-y-2 pt-2">
            <div
              v-for="(question, index) in suggestedQuestions"
              :key="index"
              class="text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 rounded px-3 py-2 cursor-pointer transition-colors"
              @click="clickSuggestion(question)"
            >
              {{ question }}
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="p-4 border-t border-gray-100">
          <div class="text-xs text-gray-400 text-center mb-3">
            内容由AI生成，无法保障真实准确，仅供参考。
          </div>
          <div class="flex items-end gap-2">
            <!-- 左侧清空按钮 -->
            <a-button
              type="text"
              size="small"
              class="shrink-0"
              :disabled="messages.length === 0"
              @click="clearAllMessages"
            >
              <icon-delete :size="18" />
            </a-button>

            <!-- 输入框 -->
            <a-textarea
              v-model="userInput"
              placeholder="请输入消息..."
              :auto-size="{ minRows: 1, maxRows: 4 }"
              class="flex-1"
              @keydown.enter.prevent="sendMessage"
            />

            <!-- 右侧按钮组 -->
            <div class="flex gap-1 shrink-0">
              <a-button type="text" size="small" @click="uploadImage">
                <icon-plus-circle :size="18" />
              </a-button>
              <a-button type="primary" size="small" :disabled="isLoading" @click="sendMessage">
                <icon-send :size="16" />
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 插件选择弹窗 -->
    <PluginModal
      v-model:visible="pluginModalVisible"
      :selected-plugins="selectedPlugins.map((p) => p.id)"
      @select="handleSelectPlugin"
    />

    <!-- 知识库选择弹窗 -->
    <KnowledgeModal
      v-model:visible="knowledgeModalVisible"
      :selected-knowledges="selectedKnowledges.map((k) => k.id)"
      @confirm="handleConfirmKnowledges"
    />
  </div>
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

/* 文本域样式优化 */
:deep(.arco-textarea) {
  font-size: 13px;
}

/* 开关样式 */
:deep(.arco-switch-small) {
  min-width: 44px;
}

/* Loading图标旋转动画 */
.loading-icon {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
