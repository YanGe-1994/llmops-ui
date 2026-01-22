<script setup lang="ts"></script>

<template>
  <!-- 最外层容器 -->
  <div class="min-h-screen">
    <!-- 顶部header -->
    <header class="h-[74px] bg-gray-100 border-b border-gray-200 px-4 flex items-center"></header>
    <!-- 内容区域 -->
    <div class="flex flex-row h-[calc(100vh-74px)]">
      <!-- 左侧编排区域-->
      <div class="w-2/3 bg-gray-50 h-full">
        <header
          class="flex items-center h-16 border-b border-b-gray-200 px-7 text-xl text-gray-700"
        >
          应用编排
        </header>
        <div class="flex flex-row h-full">
          <div class="flex-1 border-r border-gray-200 p-6">人设与回复逻辑</div>
          <div class="flex-1 p-6">应用能力</div>
        </div>
      </div>
      <!-- 右侧预览区域 -->
      <div class="flex flex-col w-1/3 bg-white h-full">
        <header
          class="flex items-center h-16 border-b border-b-gray-200 px-4 bg-white text-xl text-gray-700 shadow-sm"
        >
          调试与预览
        </header>
        <!-- 调试对话界面 -->
        <div class="h-full min-h-0 px-6 py-7 overflow-x-hidden overflow-y-scroll">
          <!-- 人类消息 -->
          <div class="flex flex-row gap-2 mb-6">
            <a-avatar class="shrink-0" :size="30">Y</a-avatar>
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-gray-700">焚影</div>
              <div
                class="bg-blue-700 text-white border border-blue-800 px-4 py-3 rounded-2xl leading-5"
              >
                能详细讲解下LLM是什么吗？
              </div>
            </div>
          </div>
          <!-- AI消息 -->
          <div class="flex flex-row gap-2 mb-6">
            <a-avatar class="shrink-0" :size="30">
              <icon-apps />
            </a-avatar>
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-gray-700">聊天机器人</div>
              <div
                class="bg-gray-100 border border-gray-200 px-4 py-3 rounded-2xl leading-5 text-gray-900"
              >
                LLM 即 Large Language
                Model，大语言模型，是一种基于深度学习的自然语言处理模型，具有很高的语言理解和生成能力，能够处理各式各样的自然语言任务，例如文本生成、问答、翻译、摘要等。它通过在大量的文本数据上进行训练，学习到语言的模式、结构和语义知识。
              </div>
            </div>
          </div>
          <!-- AI加载状态 -->
          <div class="flex flex-row gap-2 mb-6">
            <a-avatar class="shrink-0" :size="30">
              <icon-apps />
            </a-avatar>
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-gray-700">聊天机器人</div>
              <div
                class="bg-gray-100 border border-gray-200 px-4 py-3 rounded-2xl leading-5 text-gray-900"
              >
                <icon-loading />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
