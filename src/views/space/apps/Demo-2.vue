<script setup lang="ts">
// ==================== 依赖导入 ====================
import { ref } from 'vue'
// VueFlow 核心组件 - 用于创建可视化流程图
import { VueFlow } from '@vue-flow/core'
// 背景网格组件 - 为画布添加网格背景
import { Background } from '@vue-flow/background'
// 控制面板组件 - 提供缩放、居中等控制按钮
import { Controls } from '@vue-flow/controls'

// ==================== 样式导入 ====================
// VueFlow 核心样式
import '@vue-flow/core/dist/style.css'
// VueFlow 默认主题样式
import '@vue-flow/core/dist/theme-default.css'
// 控制面板样式
import '@vue-flow/controls/dist/style.css'

// ==================== 节点数据定义 ====================
/**
 * 工作流节点列表
 * 每个节点包含：
 * - id: 唯一标识符
 * - type: 节点类型（start/llm/knowledge/tool/end）
 * - position: 节点在画布上的位置坐标
 * - data: 节点的业务数据（标签、输入输出等）
 */
const nodes = ref([
  // -------------------- 开始节点 --------------------
  // 工作流的入口节点，定义用户输入参数
  {
    id: 'start',
    type: 'start',
    position: { x: 50, y: 280 },
    data: {
      label: '开始',
      // 输入参数定义：查询语句和位置信息
      inputs: [
        { name: 'query', type: 'String' },      // 用户查询语句
        { name: 'location', type: 'String' },   // 位置信息
      ],
    },
  },

  // -------------------- 大模型节点 1 --------------------
  // 第一个大语言模型节点，用于处理用户输入
  {
    id: 'llm-1',
    type: 'llm',
    position: { x: 280, y: 150 },
    data: {
      label: '大模型',
      // 输入参数：引用开始节点的输出
      inputs: [
        { name: 'query', type: 'String', value: '开始/查询语句' },
        { name: 'location', type: 'String', value: '开始/位置' },
      ],
      // 输出参数：模型生成的字符串结果
      outputs: [{ name: 'output_str', type: 'String' }],
    },
  },

  // -------------------- 知识库检索节点 --------------------
  // 用于从知识库中检索相关文档
  {
    id: 'knowledge',
    type: 'knowledge',
    position: { x: 280, y: 380 },
    data: {
      label: '知识库检索',
      // 输入：用户查询语句
      inputs: [{ name: 'query', type: 'String', value: '开始/查询语句' }],
      // 关联的知识库列表
      datasets: ['慕课LLMOps知识库', '电商产品知识库'],
      // 输出：合并后的检索文档
      outputs: [{ name: 'combine_documents', type: 'String' }],
    },
  },

  // -------------------- 工具节点 --------------------
  // 调用外部工具（高德天气API）获取天气信息
  {
    id: 'tool',
    type: 'tool',
    position: { x: 560, y: 120 },
    data: {
      label: '高德工具/GetCurrentWeather',
      // 输入：从大模型节点获取的位置信息
      inputs: [{ name: 'location', type: 'String', value: '大语言模型/output_str' }],
      // 输出：天气查询结果
      outputs: [{ name: 'result', type: 'String' }],
    },
  },

  // -------------------- 大模型节点 2 --------------------
  // 第二个大语言模型节点，结合知识库检索结果生成最终回答
  {
    id: 'llm-2',
    type: 'llm',
    position: { x: 560, y: 380 },
    data: {
      label: '大模型',
      // 输入：整合多个来源的数据
      inputs: [
        { name: 'query', type: 'String', value: '开始/query' },
        { name: 'location', type: 'String', value: '开始/location' },
        { name: 'context', type: 'String', value: '知识库检索/context' },
      ],
      // 提示词模板：指导模型如何处理输入并生成输出
      prompt:
        '你是一个强大的Agent智能体，请根据用户传递的内容以及生成知识库检索query报告，用户的提问是: {{query}}',
      // 输出：模型生成的回答
      outputs: [{ name: 'output_str', type: 'String' }],
    },
  },

  // -------------------- 结束节点 --------------------
  // 工作流的出口节点，汇总所有输出结果
  {
    id: 'end',
    type: 'end',
    position: { x: 850, y: 220 },
    data: {
      label: '结束',
      // 最终输出：汇总各节点的关键数据
      outputs: [
        { name: 'query', type: 'String', value: '开始/query' },
        { name: 'location', type: 'String', value: '开始/location' },
        { name: 'context', type: 'String', value: '知识库检索/context' },
      ],
    },
  },
])
// ==================== 边（连接线）数据定义 ====================
/**
 * 节点之间的连接关系
 * 每条边包含：
 * - id: 唯一标识符
 * - source: 起始节点ID
 * - target: 目标节点ID
 * - animated: 是否显示流动动画
 * - style: 边的样式（颜色等）
 */
const edges = ref([
  // 开始节点 -> 大模型节点1（上方分支）
  { id: 'e-start-llm1', source: 'start', target: 'llm-1', animated: true, style: { stroke: '#3b82f6' } },
  // 开始节点 -> 知识库节点（下方分支）
  { id: 'e-start-knowledge', source: 'start', target: 'knowledge', animated: true, style: { stroke: '#3b82f6' } },
  // 大模型节点1 -> 工具节点
  { id: 'e-llm1-tool', source: 'llm-1', target: 'tool', animated: true, style: { stroke: '#3b82f6' } },
  // 知识库节点 -> 大模型节点2
  { id: 'e-knowledge-llm2', source: 'knowledge', target: 'llm-2', animated: true, style: { stroke: '#3b82f6' } },
  // 工具节点 -> 结束节点
  { id: 'e-tool-end', source: 'tool', target: 'end', animated: true, style: { stroke: '#3b82f6' } },
  // 大模型节点2 -> 结束节点
  { id: 'e-llm2-end', source: 'llm-2', target: 'end', animated: true, style: { stroke: '#3b82f6' } },
])

// ==================== 画布状态 ====================
// 当前缩放级别（百分比）
const zoomLevel = ref(50)
</script>

<template>
  <!-- 主容器：全屏高度，垂直布局，灰色背景 -->
  <div class="h-screen flex flex-col bg-gray-50">

    <!-- ==================== 顶部导航栏 ==================== -->
    <header class="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0">
      <!-- 左侧：返回按钮、应用图标、标题信息 -->
      <div class="flex items-center gap-3">
        <!-- 返回按钮 -->
        <a-button type="text" class="p-1">
          <icon-left :size="20" />
        </a-button>
        <!-- 应用图标 -->
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <icon-apps class="text-white" :size="18" />
        </div>
        <!-- 标题和描述 -->
        <div class="flex flex-col">
          <span class="font-medium text-sm">工作流组件</span>
          <span class="text-xs text-gray-400">这里是工作流组件的描述信息...</span>
        </div>
        <!-- 状态标签 -->
        <a-tag size="small" color="gray">草稿</a-tag>
        <!-- 自动保存时间 -->
        <span class="text-gray-400 text-xs">已自动保存 23:18:15</span>
      </div>

      <!-- 右侧：操作按钮 -->
      <div class="flex items-center gap-3">
        <a-link class="text-gray-500 text-sm">取消发布</a-link>
        <a-button type="primary">更新发布</a-button>
      </div>
    </header>

    <!-- ==================== 工作流画布区域 ==================== -->
    <div class="flex-1 relative">
      <!--
        VueFlow 核心组件
        - v-model:nodes: 双向绑定节点数据
        - v-model:edges: 双向绑定边数据
        - default-viewport: 默认视口设置（缩放和偏移）
        - min-zoom/max-zoom: 缩放范围限制
        - fit-view-on-init: 初始化时自动适应视图
      -->
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        :default-viewport="{ zoom: 0.8, x: 100, y: 50 }"
        :min-zoom="0.2"
        :max-zoom="2"
        class="vue-flow-wrapper"
        fit-view-on-init
      >
        <!-- 背景网格：灰色网格线，间距20px -->
        <Background pattern-color="#e5e7eb" :gap="20" />
        <!-- 控制面板（已通过CSS隐藏） -->
        <Controls />

        <!-- ==================== 开始节点模板 ==================== -->
        <!-- 自定义开始节点的渲染样式 -->
        <template #node-start="{ data }">
          <div class="bg-white rounded-lg border-2 border-blue-500 shadow-sm min-w-45">
            <!-- 节点头部：图标和标签 -->
            <div class="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
              <div class="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <icon-play-arrow class="text-white" :size="14" />
              </div>
              <span class="font-medium text-sm">{{ data.label }}</span>
            </div>
            <!-- 节点内容：输入参数列表 -->
            <div class="p-3">
              <div class="text-xs text-gray-500 mb-2">输入</div>
              <div class="space-y-2">
                <!-- 遍历显示所有输入参数 -->
                <div v-for="input in data.inputs" :key="input.name" class="flex items-center gap-2">
                  <span class="text-xs text-gray-700">{{ input.name }}</span>
                  <a-tag size="small" color="blue">{{ input.type }}</a-tag>
                </div>
              </div>
            </div>
            <!-- 添加下游节点按钮 -->
            <a-button type="text" size="mini" class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white rounded-full w-5 h-5 p-0">
              <icon-plus :size="12" />
            </a-button>
          </div>
        </template>

        <!-- ==================== 大模型节点模板 ==================== -->
        <!-- 自定义大语言模型节点的渲染样式 -->
        <template #node-llm="{ data }">
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm min-w-55">
            <!-- 节点头部：紫色图标表示AI模型 -->
            <div class="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
              <div class="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                <icon-robot class="text-white" :size="14" />
              </div>
              <span class="font-medium text-sm">{{ data.label }}</span>
              <a-button type="text" size="mini" class="ml-auto p-0"><icon-plus :size="14" /></a-button>
            </div>
            <div class="p-3 space-y-3">
              <!-- 输入参数区域 -->
              <div>
                <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>输入</span>
                  <span class="text-gray-400">引用值</span>
                </div>
                <div class="space-y-1.5">
                  <!-- 遍历显示输入参数及其引用值 -->
                  <div v-for="input in data.inputs" :key="input.name" class="flex items-center justify-between text-xs">
                    <div class="flex items-center gap-1">
                      <span class="text-gray-700">{{ input.name }}</span>
                      <span class="text-red-500">*</span>  <!-- 必填标记 -->
                      <a-tag size="small" color="blue">{{ input.type }}</a-tag>
                    </div>
                    <span class="text-gray-400">{{ input.value }}</span>
                  </div>
                </div>
              </div>
              <!-- 提示词区域（可选） -->
              <div v-if="data.prompt">
                <div class="flex items-center text-xs text-gray-500 mb-1">
                  <span>提示词</span>
                  <a-button type="text" size="mini" class="ml-auto text-red-500 p-0"><icon-minus :size="12" /></a-button>
                </div>
                <!-- 提示词内容，最多显示3行 -->
                <div class="text-xs text-gray-600 bg-gray-50 p-2 rounded line-clamp-3">
                  {{ data.prompt }}
                </div>
              </div>
              <!-- 输出参数区域 -->
              <div>
                <div class="flex items-center text-xs text-gray-500 mb-1">
                  <span>输出</span>
                </div>
                <div v-for="output in data.outputs" :key="output.name" class="flex items-center gap-1 text-xs">
                  <span class="text-gray-700">{{ output.name }}</span>
                  <a-tag size="small" color="blue">{{ output.type }}</a-tag>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ==================== 知识库节点模板 ==================== -->
        <!-- 自定义知识库检索节点的渲染样式 -->
        <template #node-knowledge="{ data }">
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm min-w-55">
            <!-- 节点头部：青色图标表示存储/知识库 -->
            <div class="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
              <div class="w-6 h-6 bg-cyan-600 rounded flex items-center justify-center">
                <icon-storage class="text-white" :size="14" />
              </div>
              <span class="font-medium text-sm">{{ data.label }}</span>
            </div>
            <div class="p-3 space-y-3">
              <!-- 输入参数区域 -->
              <div>
                <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>输入</span>
                  <span class="text-gray-400">引用值</span>
                </div>
                <div v-for="input in data.inputs" :key="input.name" class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-1">
                    <span class="text-gray-700">{{ input.name }}</span>
                    <span class="text-red-500">*</span>
                    <a-tag size="small" color="blue">{{ input.type }}</a-tag>
                  </div>
                  <span class="text-gray-400">{{ input.value }}</span>
                </div>
              </div>
              <!-- 关联知识库列表 -->
              <div>
                <div class="flex items-center text-xs text-gray-500 mb-2">
                  <span>关联知识库</span>
                  <a-button type="text" size="mini" class="ml-auto p-0!"><icon-plus :size="12" /></a-button>
                </div>
                <div class="space-y-1.5">
                  <!-- 遍历显示已关联的知识库 -->
                  <div v-for="ds in data.datasets" :key="ds" class="flex items-center gap-2 text-xs bg-gray-50 px-2 py-1.5 rounded">
                    <icon-file class="text-blue-500" :size="14" />
                    <span>{{ ds }}</span>
                  </div>
                </div>
              </div>
              <!-- 输出参数区域 -->
              <div>
                <div class="flex items-center text-xs text-gray-500 mb-1">
                  <span>输出</span>
                </div>
                <div v-for="output in data.outputs" :key="output.name" class="flex items-center gap-1 text-xs">
                  <span class="text-gray-700">{{ output.name }}</span>
                  <a-tag size="small" color="blue">{{ output.type }}</a-tag>
                </div>
              </div>
            </div>
            <!-- 添加下游节点按钮 -->
            <a-button type="text" size="mini" class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-500! text-white! rounded-full w-5! h-5! p-0!">
              <icon-plus :size="12" />
            </a-button>
          </div>
        </template>

        <!-- ==================== 工具节点模板 ==================== -->
        <!-- 自定义外部工具调用节点的渲染样式 -->
        <template #node-tool="{ data }">
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm min-w-65">
            <!-- 节点头部：橙色图标表示工具 -->
            <div class="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
              <div class="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                <icon-tool class="text-white" :size="14" />
              </div>
              <span class="font-medium text-sm">{{ data.label }}</span>
              <a-button type="text" size="mini" class="ml-auto p-0!"><icon-plus :size="14" /></a-button>
            </div>
            <div class="p-3 space-y-3">
              <!-- 输入参数区域 -->
              <div>
                <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>输入</span>
                  <span class="text-gray-400">引用值</span>
                </div>
                <div v-for="input in data.inputs" :key="input.name" class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-1">
                    <span class="text-gray-700">{{ input.name }}</span>
                    <span class="text-red-500">*</span>
                    <a-tag size="small" color="blue">{{ input.type }}</a-tag>
                  </div>
                  <span class="text-gray-400">{{ input.value }}</span>
                </div>
              </div>
              <!-- 输出参数区域 -->
              <div>
                <div class="flex items-center text-xs text-gray-500 mb-1">
                  <span>输出</span>
                  <a-button type="text" size="mini" class="ml-auto text-red-500! p-0!"><icon-minus :size="12" /></a-button>
                </div>
                <div v-for="output in data.outputs" :key="output.name" class="flex items-center gap-1 text-xs">
                  <span class="text-gray-700">{{ output.name }}</span>
                  <a-tag size="small" color="blue">{{ output.type }}</a-tag>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ==================== 结束节点模板 ==================== -->
        <!-- 自定义结束节点的渲染样式 -->
        <template #node-end="{ data }">
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm min-w-50">
            <!-- 节点头部：紫色图标表示完成 -->
            <div class="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
              <div class="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                <icon-check class="text-white" :size="14" />
              </div>
              <span class="font-medium text-sm">{{ data.label }}</span>
            </div>
            <!-- 输出汇总区域 -->
            <div class="p-3">
              <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>输出</span>
                <span class="text-gray-400">引用值</span>
              </div>
              <div class="space-y-1.5">
                <!-- 遍历显示所有最终输出 -->
                <div v-for="output in data.outputs" :key="output.name" class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-1">
                    <span class="text-gray-700">{{ output.name }}</span>
                    <span class="text-red-500">*</span>
                    <a-tag size="small" color="blue">{{ output.type }}</a-tag>
                  </div>
                  <span class="text-gray-400">{{ output.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </VueFlow>

      <!-- ==================== 底部工具栏 ==================== -->
      <!-- 悬浮在画布底部的操作工具栏 -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white rounded-xl shadow-lg px-4 py-2 border border-gray-200">
        <!-- 节点按钮：用于添加新节点 -->
        <a-button type="primary" size="small">
          <icon-save class="mr-1" />节点
        </a-button>
        <!-- 布局按钮 -->
        <a-button type="text" size="small">
          <icon-apps />
        </a-button>
        <!-- 缩放级别显示 -->
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span>{{ zoomLevel }}%</span>
          <icon-down :size="14" />
        </div>
        <!-- 调试按钮：运行工作流进行测试 -->
        <a-button type="outline" size="small" status="success">
          <icon-play-arrow class="mr-1" />调试
        </a-button>
      </div>
    </div>
  </div>
</template>

<!-- ==================== 组件样式 ==================== -->
<style scoped>
/* VueFlow 容器样式：撑满父容器 */
.vue-flow-wrapper {
  width: 100%;
  height: 100%;
}

/* 深度选择器：自定义 VueFlow 节点样式 */
:deep() {
  padding: 0;
  border-radius: 8px;
  border: none;
}

/* 深度选择器：自定义连接线宽度 */
:deep() {
  stroke-width: 2;
}

/* 深度选择器：隐藏默认控制面板（使用自定义底部工具栏） */
:deep() {
  display: none;
}
</style>
