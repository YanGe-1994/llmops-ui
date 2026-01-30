<script setup lang="ts">
import { ref } from 'vue'

const modelOptions = [
  { label: 'GPT-4o', value: 'gpt-4o' },
  { label: 'GPT-4', value: 'gpt-4' },
  { label: 'GPT-3.5', value: 'gpt-3.5-turbo' },
]
const selectedModel = ref('gpt-4o')
const roleContent = ref(`# 角色
你是一个智能聊天机器人，能够与用户进行各种话题的交流，包括但不限于生活、工作、学习、娱乐等。

## 技能
### 技能 1: 日常交流
1. 当用户分享日常生活经历时，给予积极的回应和适当的建议。
2. 对于用户的心情表达，提供安慰和鼓励。

### 技能 2: 知识解答
1. 当用户提出问题，运用知识库和搜索工具提供准确、详细的答案。
2. 对于复杂问题，分步骤进行解释。

### 技能 3: 娱乐互动
1. 陪与用户玩文字游戏，如猜谜语、成语接龙等。
2. 推荐有趣的娱乐活动和节目。

## 限制:
- 回答内容应积极、友善、文明，不得包含不当言论。
- 所输出的内容必须按照给定的格式进行组织，不能偏离框架要求。
- 对于不确定的问题，应明确告知用户并尽力提供获取准确信息的途径。`)

const openingMessage = ref('')
const openingQuestion = ref('')
const longMemoryEnabled = ref(true)
const userSuggestionEnabled = ref(true)
const voiceInputEnabled = ref(true)
const voiceOutputEnabled = ref(false)

const chatMessages = ref([
  {
    type: 'user',
    name: '慕小课',
    avatar: '',
    content: '你好，你是?',
  },
  {
    type: 'ai',
    name: 'ChatGPT聊天机器人',
    content: '你好呀，我是ChatGPT，很高兴和您交流！',
    tokens: 72,
    latency: '1.7s',
  },
  {
    type: 'user',
    name: '慕小课',
    avatar: '',
    content: '能详细讲解下LLM是什么吗？',
  },
  {
    type: 'ai',
    name: 'ChatGPT聊天机器人',
    content:
      'LLM 即 Large Language Model，大语言模型，是一种基于深度学习的自然语言处理模型，具有很高的语言理解和生成能力，能够处理各式各样的自然语言任务，例如文本生成、问答、翻译、摘要等。它通过在大量的文本数据上进行训练，学习到语言的模式、结构和语义知识。',
    tokens: 1085,
    latency: '1.7s',
  },
])

const suggestedQuestions = ref([
  'LLM大语言模型有什么应用场景？',
  '有哪些开源的LLM模型？',
  'LLM与Agent之间的关系是什么？',
])

const inputMessage = ref('')
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- 顶部header -->
    <header class="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-3">
        <a-button type="text" class="p-1">
          <icon-left :size="20" />
        </a-button>
        <div class="flex items-center gap-2">
          <span class="font-medium text-base">聊天机器人</span>
          <icon-edit :size="14" class="text-gray-400 cursor-pointer" />
        </div>
        <a-tag size="small" color="arcoblue">个人空间</a-tag>
        <a-tag size="small">草稿</a-tag>
        <span class="text-gray-400 text-sm">自动保存 23:18:15</span>
      </div>
      <div class="flex items-center gap-6">
        <a-link class="text-blue-600 font-medium">编排</a-link>
        <a-link class="text-gray-600">发布配置</a-link>
        <a-link class="text-gray-600">统计分析</a-link>
      </div>
      <div class="flex items-center gap-3">
        <a-avatar :size="32">
          <img alt="" src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp" />
        </a-avatar>
        <a-button type="primary">更新发布</a-button>
      </div>
    </header>

    <!-- 内容区域 -->
    <div class="flex flex-row flex-1 min-h-0">
      <!-- 左侧编排区域 -->
      <div class="w-2/3 bg-gray-50 flex flex-col border-r border-gray-200">
        <header class="flex items-center h-14 border-b border-gray-200 px-6 shrink-0">
          <span class="text-lg font-medium text-gray-800">应用编排</span>
          <div class="ml-4 flex items-center gap-2">
            <icon-robot :size="16" class="text-gray-500" />
            <a-select v-model="selectedModel" :options="modelOptions" size="small" class="w-28" />
          </div>
        </header>

        <div class="flex flex-row flex-1 min-h-0 overflow-hidden">
          <!-- 左侧：人设与回复逻辑 -->
          <div class="flex-1 border-r border-gray-200 p-6 overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
              <span class="font-medium text-gray-800">人设与回复逻辑</span>
              <a-link class="text-gray-500 text-sm">
                <icon-sync class="mr-1" />优化
              </a-link>
            </div>
            <a-textarea
              v-model="roleContent"
              :auto-size="{ minRows: 20, maxRows: 30 }"
              class="bg-white"
            />
          </div>

          <!-- 右侧：应用能力 -->
          <div class="flex-1 p-6 overflow-y-auto">
            <div class="font-medium text-gray-800 mb-4">应用能力</div>

            <!-- 扩展插件 -->
            <a-collapse :default-active-key="['1', '2', '3', '4']" :bordered="false" class="bg-transparent">
              <a-collapse-item header="扩展插件" key="1">
                <template #extra>
                  <a-button type="text" size="mini"><icon-plus /></a-button>
                </template>
                <div class="space-y-3">
                  <div class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <icon-image class="text-white" />
                      </div>
                      <div>
                        <div class="font-medium text-sm">图片理解 / imgUnderstand</div>
                        <div class="text-xs text-gray-400">问答类用户关于图像的问题</div>
                      </div>
                    </div>
                    <a-button type="text" size="mini" status="danger"><icon-delete /></a-button>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <icon-search class="text-white" />
                      </div>
                      <div>
                        <div class="font-medium text-sm">必应搜索 / bingWebSearch</div>
                        <div class="text-xs text-gray-400">必应搜索引擎，当你需要搜索你不知道的信息，比如天气、工资、新闻...</div>
                      </div>
                    </div>
                    <a-button type="text" size="mini" status="danger"><icon-delete /></a-button>
                  </div>
                </div>
              </a-collapse-item>

              <a-collapse-item header="工作流组件" key="2">
                <template #extra>
                  <a-button type="text" size="mini"><icon-plus /></a-button>
                </template>
                <div class="text-gray-400 text-sm">
                  工作流支持通过可视化的方式，对组件、大语言模型、代码块等功能进行组合，实现AI预测、类似分析...
                </div>
              </a-collapse-item>

              <a-collapse-item header="知识库" key="3">
                <template #extra>
                  <a-button type="text" size="mini"><icon-plus /></a-button>
                </template>
                <div class="text-gray-400 text-sm">
                  允许关联多类型的数据集，从知识问答中召回，应用最多支持关联 5 个知识库。
                </div>
              </a-collapse-item>

              <a-collapse-item header="长期记忆" key="4">
                <template #extra>
                  <a-switch v-model="longMemoryEnabled" size="small" />
                </template>
                <div class="text-gray-400 text-sm">
                  长期记忆允许对话内容，用于更好的响应用户的消息。
                </div>
              </a-collapse-item>
            </a-collapse>

            <a-divider class="my-4" />

            <!-- 对话开场白 -->
            <a-collapse :default-active-key="['5', '6', '7', '8']" :bordered="false" class="bg-transparent">
              <a-collapse-item header="对话开场白" key="5">
                <template #extra>
                  <a-button type="text" size="mini"><icon-plus /></a-button>
                </template>
                <div class="space-y-4">
                  <div>
                    <div class="text-sm text-gray-600 mb-2 flex items-center gap-1">
                      开场白文案
                      <icon-question-circle class="text-gray-400" />
                    </div>
                    <a-textarea
                      v-model="openingMessage"
                      placeholder="在此处填写 AI 应用的开场白"
                      :auto-size="{ minRows: 3, maxRows: 5 }"
                    />
                  </div>
                  <div>
                    <div class="text-sm text-gray-600 mb-2 flex items-center gap-1">
                      开场白推荐问题
                      <icon-question-circle class="text-gray-400" />
                    </div>
                    <a-input v-model="openingQuestion" placeholder="输入开场白引导问题">
                      <template #suffix>
                        <icon-face-smile-fill class="text-gray-400" />
                      </template>
                    </a-input>
                  </div>
                </div>
              </a-collapse-item>

              <a-collapse-item header="用户问题建议" key="6">
                <template #extra>
                  <a-select v-model="userSuggestionEnabled" size="mini" class="w-16">
                    <a-option :value="true">开启</a-option>
                    <a-option :value="false">关闭</a-option>
                  </a-select>
                </template>
                <div class="text-gray-400 text-sm">
                  在应用对话后，自动根据对话内容提供 3 条用户推荐建议。
                </div>
              </a-collapse-item>

              <a-collapse-item header="语音输入" key="7">
                <template #extra>
                  <a-select v-model="voiceInputEnabled" size="mini" class="w-16">
                    <a-option :value="true">开启</a-option>
                    <a-option :value="false">关闭</a-option>
                  </a-select>
                </template>
                <div class="text-gray-400 text-sm">
                  启用后，您可以使用语音输入。
                </div>
              </a-collapse-item>

              <a-collapse-item header="语音输出" key="8">
                <template #extra>
                  <a-select v-model="voiceOutputEnabled" size="mini" class="w-16">
                    <a-option :value="true">开启</a-option>
                    <a-option :value="false">关闭</a-option>
                  </a-select>
                </template>
              </a-collapse-item>
            </a-collapse>
          </div>
        </div>
      </div>

      <!-- 右侧预览区域 -->
      <div class="flex flex-col w-1/3 bg-white">
        <header class="flex items-center justify-between h-14 border-b border-gray-200 px-4 shrink-0">
          <span class="text-lg font-medium text-gray-800">预览与调试</span>
          <a-link class="text-gray-500 text-sm">
            <icon-history class="mr-1" />长期记忆
          </a-link>
        </header>

        <!-- 聊天消息区域 - 可滚动 -->
        <div class="flex-1 min-h-0 overflow-y-auto px-4 py-4">
          <template v-for="(msg, index) in chatMessages" :key="index">
            <!-- 用户消息 -->
            <div v-if="msg.type === 'user'" class="flex flex-row gap-3 mb-4">
              <a-avatar :size="32" class="shrink-0 bg-blue-100 text-blue-600">
                {{ msg.name.charAt(0) }}
              </a-avatar>
              <div class="flex flex-col gap-1">
                <div class="font-medium text-sm text-gray-700">{{ msg.name }}</div>
                <div class="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed">
                  {{ msg.content }}
                </div>
              </div>
            </div>

            <!-- AI消息 -->
            <div v-else class="flex flex-row gap-3 mb-4">
              <a-avatar :size="32" class="shrink-0 bg-gray-100">
                <icon-robot />
              </a-avatar>
              <div class="flex flex-col gap-1 flex-1">
                <div class="font-medium text-sm text-gray-700">{{ msg.name }}</div>
                <div class="bg-gray-100 px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed text-gray-800">
                  {{ msg.content }}
                </div>
                <div class="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span>{{ msg.latency }}</span>
                  <span>{{ msg.tokens }} Tokens</span>
                  <div class="flex items-center gap-2 ml-auto">
                    <icon-copy class="cursor-pointer hover:text-gray-600" />
                    <icon-delete class="cursor-pointer hover:text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- 推荐问题 -->
          <div class="flex flex-wrap gap-2 mt-4">
            <a-tag
              v-for="(q, i) in suggestedQuestions"
              :key="i"
              class="bg-gray-50 border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-100 rounded-full px-3 py-1"
            >
              {{ q }}
            </a-tag>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="border-t border-gray-200 p-4 shrink-0">
          <div class="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2">
            <icon-attachment class="text-gray-400 cursor-pointer" />
            <a-input
              v-model="inputMessage"
              placeholder=""
              class="bg-transparent border-none shadow-none flex-1"
            />
            <icon-face-smile-fill class="text-gray-400 cursor-pointer" />
            <a-button type="primary" shape="circle" size="small">
              <icon-send />
            </a-button>
          </div>
          <div class="text-xs text-gray-400 text-center mt-2">
            内容由AI生成，无法确保真实准确，仅供参考。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep() {
  background: transparent;
}
:deep() {
  background: transparent;
  padding-left: 0;
  padding-right: 0;
}
:deep() {
  border-color: #e5e7eb;
}
:deep() {
  border-color: #e5e7eb;
}
</style>
