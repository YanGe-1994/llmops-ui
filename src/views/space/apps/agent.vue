<script setup lang="ts">
import { reactive, ref } from 'vue'
import { debug } from '@/services/test.ts'

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

const messages = ref<Message[]>([
  {
    id: '1',
    role: 'user',
    content: '你好，你谁？',
    avatar: '👤',
    name: '喜小漫',
  },
  {
    id: '2',
    role: 'assistant',
    content: '你好呀，我是ChatGPT，很高兴和您交流！',
    avatar: '🤖',
    name: 'ChatGPT聊天机器人',
    tokens: 72,
    time: 1.7,
  },
  {
    id: '3',
    role: 'user',
    content: '能详细讲解下FLLM是什么吗？',
    avatar: '👤',
    name: '喜小漫',
  },
  {
    id: '4',
    role: 'assistant',
    content:
      'LLM 即 Large Language Model，大语言模型，是一种基于深度学习的自然语言处理模型，具有很强的语言理解和生成能力，能够处理各式各样的自然语言任务，例如文本生成、问答、翻译、摘要等。它通过在大量的文本数据上进行训练，学习语言的模式、结构和语义知识。',
    avatar: '🤖',
    name: 'ChatGPT聊天机器人',
    tokens: 1085,
    time: 1.7,
  },
])

// 建议问题
const suggestedQuestions = ref([
  'LLM 大语言模型有什么应用场景？',
  '有哪些主流的LLM模型？',
  'LLM与Agent之间的关系是什么？',
])

// 用户输入
const userInput = ref('')

// ==================== 方法定义 ====================

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
  if (!userInput.value.trim()) return

  // 添加用户消息
  messages.value.push({
    id: Date.now().toString(),
    role: 'user',
    content: userInput.value,
    avatar: '👤',
    name: '喜小漫',
  })

  // 清空输入
  const question = userInput.value
  userInput.value = ''
  const { data } = await debug({ query: question })
  let { content } = data
  content = JSON.parse(content)
  // 模拟 AI 回复
  messages.value.push({
    id: Date.now().toString(),
    role: 'assistant',
    content: `${content.talk}`,
    avatar: '🤖',
    name: 'ChatGPT聊天机器人',
    tokens: Math.floor(Math.random() * 500) + 50,
    time: Math.random() * 2 + 0.5,
  })
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
      <div class="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div class="p-4 border-b border-gray-100">
          <h3 class="text-sm font-medium mb-3">应用编排</h3>
          <a-select v-model="selectedModel" class="w-full">
            <a-option v-for="model in modelOptions" :key="model" :value="model">
              <div class="flex items-center gap-2">
                <icon-robot :size="14" />
                <span>{{ model }}</span>
              </div>
            </a-option>
          </a-select>
        </div>

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

      <!-- 中间：应用能力 -->
      <div class="flex-1 bg-gray-50 overflow-y-auto p-6">
        <div class="max-w-3xl mx-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-medium">应用能力</h3>
          </div>

          <div class="space-y-3">
            <div
              v-for="capability in capabilities"
              :key="capability.id"
              class="bg-white rounded-lg border border-gray-200"
            >
              <!-- 能力项头部 -->
              <div
                class="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
                @click="toggleCapability(capability.id)"
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
                    v-if="capability.enabled !== undefined"
                    :model-value="capability.enabled"
                    size="small"
                    @click.stop
                    @change="toggleEnabled(capability.id)"
                  >
                    <template #checked>开启</template>
                    <template #unchecked>关闭</template>
                  </a-switch>
                  <a-button v-if="capability.hasAdd" type="text" size="small" @click.stop>
                    <icon-plus :size="14" />
                  </a-button>
                </div>
              </div>

              <!-- 能力项内容 -->
              <div v-if="capability.expanded" class="px-4 pb-4 pt-2 border-t border-gray-100">
                <!-- 描述文字 -->
                <p v-if="capability.description" class="text-xs text-gray-500 mb-3">
                  {{ capability.description }}
                </p>

                <!-- 对话开场白特殊内容 -->
                <div v-if="capability.id === 'opening'" class="space-y-4">
                  <div>
                    <div class="flex items-center gap-1 mb-2">
                      <span class="text-xs text-gray-600">开场白文案</span>
                      <icon-question-circle :size="12" class="text-gray-400" />
                    </div>
                    <a-input
                      v-model="capability.content.text"
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
                        v-for="(question, index) in capability.content.questions"
                        :key="index"
                        class="flex items-center gap-2"
                      >
                        <a-input
                          v-model="capability.content.questions[index]"
                          placeholder="输入开场白引导问题"
                          size="small"
                        />
                        <a-button type="text" size="small" @click="removeOpeningQuestion(index)">
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
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
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
              <div v-if="message.tokens" class="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <span>{{ message.time }}s</span>
                <span>{{ message.tokens }} Tokens</span>
                <div class="flex gap-2">
                  <icon-copy :size="12" class="cursor-pointer hover:text-gray-600" />
                  <icon-delete :size="12" class="cursor-pointer hover:text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          <!-- 建议问题 -->
          <div v-if="suggestedQuestions.length" class="space-y-2 pt-2">
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
          <div class="text-xs text-gray-400 text-center mb-2">
            内容由AI生成，无法保障真实准确，仅供参考。
          </div>
          <div class="flex items-end gap-2">
            <a-textarea
              v-model="userInput"
              placeholder="请输入消息..."
              :auto-size="{ minRows: 1, maxRows: 4 }"
              class="flex-1"
              @keydown.enter.prevent="sendMessage"
            />
            <div class="flex gap-1">
              <a-button type="text" size="small">
                <icon-plus-circle :size="18" />
              </a-button>
              <a-button type="primary" size="small" @click="sendMessage">
                <icon-send :size="16" />
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
</style>
