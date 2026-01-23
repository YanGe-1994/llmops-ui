<script setup lang="ts">
import { ref } from 'vue'

// 当前激活的标签页
const activeTab = ref('AI应用')

// 标签页列表
const tabs = ['AI应用', '插件', '工作流', '知识库']

// AI应用列表数据
const apps = [
  {
    id: 1,
    name: '电商智能客服',
    verified: true,
    model: '月之暗面 • Moonshot（128K）',
    description:
      '## 任务 您的主要使命是通过"DALLE"工具真能应用户，激发他们的创造力。请提问问"您希望设计怎样任务么色吗？"或"这个设计是为了什么场合？"等问题，引导用户分享他们想象创造的设计的核心...',
    tags: ['分析', '编辑应用', '创建副本'],
    author: '蔡小涯',
    date: '最近编辑 05-15 16:05',
    icon: '📱',
  },
  {
    id: 2,
    name: '快速小助手',
    model: 'OpenAI • gpt-3-turbo-16k',
    description: '一个能帮你查询快速信息的小助手',
    author: '蔡小涯',
    date: '最近编辑 05-03 11:21',
    icon: '⚡',
  },
  {
    id: 3,
    name: '旅游规划助手',
    model: 'OpenAI • gpt-4o',
    description:
      '## 角色：旅行顾问 ### 技能：- 精通使用工具提供有关当地条件、住宿等的全面信息。- 能够使用表情符号使对话更加引人入胜。- 精通使用Markdown语法生成结构化文本。- 精通使用Markdown语法显示图片...',
    author: '蔡小涯',
    date: '最近编辑 05-20 10:14',
    icon: '🗺️',
  },
  {
    id: 4,
    name: 'Emoji翻译器',
    model: 'OpenAI • gpt-3-turbo-16k',
    description:
      '我是一个 🧝🏻‍♀️ 表情符号（emoji）翻译机器人，我会把你说过的话的每句要情符号翻译给你。也可以翻译你发过来的表情符号，以及玩表情符号猜题游戏。',
    author: '蔡小涯',
    date: '最近编辑 05-15 16:05',
    icon: '😊',
  },
  {
    id: 5,
    name: '提示工程猫',
    model: 'OpenAI • gpt-3-turbo-16k',
    description:
      '零门槛搭建bot！最懂普通LLMOps的工程猫！输入你的创意，自动生成好用的提示词，并提供各类功能建议。',
    author: '蔡小涯',
    date: '最近编辑 05-03 11:21',
    icon: '🐱',
  },
  {
    id: 6,
    name: '高考专业指南',
    model: 'OpenAI • gpt-3-turbo-16k',
    description:
      '亲爱的考生，让我们通过十道有趣的问题，探索你的兴趣和潜力，找出最适合你的专业。我会互话你这些专业的优劣考虑在清单，以及你未来的就业前景。让我来陪你实现这个重要的选择，打打你未来的新篇章吧!! ...',
    author: '蔡小涯',
    date: '最近编辑 05-20 10:14',
    icon: '🎓',
  },
  {
    id: 7,
    name: '小红书文案输出大师',
    model: '月之暗面 • Moonshot（128K）',
    description: '专注于小红书爆款创造！',
    author: '蔡小涯',
    date: '最近编辑 05-15 16:05',
    icon: '📝',
  },
  {
    id: 8,
    name: 'AI编程助手',
    verified: true,
    model: '星尘 • 通义千问Max',
    description:
      '采用最智能的大模型，自动化AI编程。精通Java、C、C++、Python、Rust、Go等编程语言有很深的理论，能够回答各种复杂的与编程相关的问题。',
    author: '蔡小涯',
    date: '最近编辑 05-15 16:05',
    icon: '💻',
  },
  {
    id: 9,
    name: '小画匠',
    model: '月之暗面 • Moonshot（128K）',
    description:
      '一个能根据文字生成图片的机器人！支持风格，光线，材质，温差，色彩，构图等调整，以适导分别助可，例如：中国画风格花朵美雄提出，画形，添加色背景。支持的风格有：中国画，油画，点彩画...',
    author: '蔡小涯',
    date: '最近编辑 05-15 16:05',
    icon: '🎨',
  },
  {
    id: 10,
    name: '快速小助手',
    model: 'OpenAI • gpt-3-turbo-16k',
    description: '一个能帮你查询快速信息的小助手',
    author: '蔡小涯',
    date: '最近编辑 05-03 11:21',
    icon: '⚡',
  },
  {
    id: 11,
    name: '旅游规划助手',
    model: 'OpenAI • gpt-4o',
    description:
      '## 角色：旅行顾问 ### 技能：- 精通使用工具提供有关当地条件、住宿等的全面信息。- 能够使用表情符号使对话更加引入人胜。- 精通使用Markdown语法生成结构化文本。- 精通使用Markdown语法显示图片...',
    author: '蔡小涯',
    date: '最近编辑 05-20 10:14',
    icon: '🗺️',
  },
  {
    id: 12,
    name: '电商智能客服',
    model: '月之暗面 • Moonshot（128K）',
    description:
      '## 任务 您的主要使命是通过"DALLE"工具真能应用户，激发他们的创造力。请提问问"您希望设计怎样任务么色吗？"或"这个设计是为了什么场合？"等问题，引导用户分享他们想象创造的设计的核心。本基询问...',
    author: '蔡小涯',
    date: '最近编辑 05-15 16:05',
    icon: '📱',
  },
]
</script>

<template>
  <!-- 页面最外层容器：使用 flex 横向布局，固定屏幕高度 -->
  <div class="flex h-screen bg-gray-50">
    <!-- ==================== 左侧导航栏 ==================== -->
    <aside class="w-[200px] bg-white border-r border-gray-200 flex flex-col">
      <!-- Logo 和创建按钮区域 -->
      <div class="p-4">
        <!-- Logo 占位符 -->
        <div class="w-24 h-10 bg-gray-200 rounded-lg mb-4"></div>
        <!-- 创建 AI 应用按钮 -->
        <button
          class="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + 创建 AI 应用
        </button>
      </div>

      <!-- 导航菜单区域：flex-1 使其占据剩余空间 -->
      <nav class="flex-1 px-2">
        <!-- 主页菜单项 -->
        <a
          href="#"
          class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors mb-1"
        >
          <span class="text-base">🏠</span>
          <span>主页</span>
        </a>
        <!-- 个人空间菜单项（当前激活状态） -->
        <a
          href="#"
          class="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 bg-gray-100 rounded-md mb-1"
        >
          <span class="text-base">👤</span>
          <span>个人空间</span>
        </a>
        <!-- 探索菜单项 -->
        <a
          href="#"
          class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors mb-1"
        >
          <span>探索</span>
        </a>
        <!-- 应用广场菜单项 -->
        <a
          href="#"
          class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors mb-1"
        >
          <span class="text-base">🛍️</span>
          <span>应用广场</span>
        </a>
        <!-- 插件广场菜单项 -->
        <a
          href="#"
          class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors mb-1"
        >
          <span class="text-base">🔌</span>
          <span>插件广场</span>
        </a>
        <!-- 开放 API 菜单项 -->
        <a
          href="#"
          class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <span class="text-base">🔗</span>
          <span>开放 API</span>
        </a>
      </nav>

      <!-- 底部用户信息区域 -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center gap-2">
          <!-- 用户头像 -->
          <div
            class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm"
          >
            蔡
          </div>
          <!-- 用户名和邮箱信息 -->
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-900 truncate">蔡小涯</div>
            <div class="text-xs text-gray-500 truncate">xehuiya@163.com</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- ==================== 主内容区域 ==================== -->
    <!-- flex-1 占据剩余空间，flex flex-col 垂直布局，overflow-hidden 防止整体滚动 -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- 顶部标题栏：shrink-0 防止被压缩 -->
      <header class="px-8 py-6 flex items-center justify-between shrink-0">
        <!-- 左侧：标题和图标 -->
        <div class="flex items-center gap-3">
          <!-- 页面图标 -->
          <div
            class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white"
          >
            <span class="text-lg">👤</span>
          </div>
          <!-- 页面标题 -->
          <h1 class="text-xl font-semibold text-gray-900">个人空间</h1>
        </div>
        <!-- 右侧：创建按钮 -->
        <button
          class="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          创建 AI 应用
        </button>
      </header>

      <!-- 标签栏：shrink-0 防止被压缩 -->
      <div class="px-8 py-3 flex items-center justify-between shrink-0">
        <!-- 左侧：标签按钮组 -->
        <div class="flex gap-6">
          <button
            v-for="tab in tabs"
            :key="tab"
            :class="[
              'px-3 py-2 text-sm font-medium transition-colors rounded-md',
              activeTab === tab
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
            ]"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>
        <!-- 右侧：搜索框 -->
        <div
          class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200"
        >
          <span class="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="搜索"
            class="bg-transparent border-none outline-none text-sm text-gray-600 w-32"
          />
        </div>
      </div>

      <!-- 应用卡片列表容器 -->
      <!-- flex-1 占据剩余空间，min-h-0 和 overflow-y-auto 实现滚动，custom-scrollbar 自定义滚动条样式 -->
      <div class="flex-1 min-h-0 h-[calc(100vh-175px)] overflow-y-auto custom-scrollbar">
        <!-- 内容包裹层：提供 padding -->
        <div class="px-8 py-6">
          <!-- 卡片网格布局：响应式 1/2/3 列 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- 单个应用卡片：flex flex-col 确保底部元素对齐 -->
            <div
              v-for="app in apps"
              :key="app.id"
              class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow relative group flex flex-col"
            >
              <!-- 右上角菜单按钮：hover 时显示 -->
              <button
                class="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ⋯
              </button>

              <!-- 应用图标和基本信息 -->
              <div class="flex gap-3 mb-3">
                <!-- 应用图标 -->
                <div
                  class="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-2xl shrink-0"
                >
                  {{ app.icon }}
                </div>
                <!-- 应用名称和模型信息 -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <!-- 应用名称 -->
                    <h3 class="text-base font-semibold text-gray-900 truncate">{{ app.name }}</h3>
                    <!-- 认证标识 -->
                    <span v-if="app.verified" class="text-green-600 text-sm">✓</span>
                  </div>
                  <!-- 模型信息 -->
                  <p class="text-xs text-gray-500">{{ app.model }}</p>
                </div>
              </div>

              <!-- 应用描述文本：line-clamp-3 限制显示 3 行 -->
              <p class="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                {{ app.description }}
              </p>

              <!-- 标签区域 -->
              <div v-if="app.tags" class="flex gap-2 mb-3">
                <span
                  v-for="tag in app.tags"
                  :key="tag"
                  :class="[
                    'px-2 py-1 text-xs rounded',
                    tag === '删除' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600',
                  ]"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- 作者信息：mt-auto 推到底部对齐 -->
              <div
                class="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-gray-100 mt-auto"
              >
                <!-- 作者头像 -->
                <div
                  class="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px]"
                >
                  蔡
                </div>
                <!-- 作者名字 -->
                <span>{{ app.author }}</span>
                <span>•</span>
                <!-- 编辑时间 -->
                <span>{{ app.date }}</span>
              </div>
            </div>
          </div>

          <!-- 加载更多按钮 -->
          <div class="flex justify-center py-8">
            <button
              class="flex items-center gap-2 px-6 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <!-- 加载动画图标 -->
              <span
                class="inline-block w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"
              ></span>
              <span>加载中</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 文本行数限制：只显示 3 行，超出部分显示省略号 */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 自定义滚动条样式 */
.custom-scrollbar {
  /* Firefox 滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

/* Webkit 浏览器（Chrome, Safari, Edge）滚动条样式 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 3px;
}

/* Hover 时显示滚动条 */
.custom-scrollbar:hover {
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
}

.custom-scrollbar:hover::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}
</style>
