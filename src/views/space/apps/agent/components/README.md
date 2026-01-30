# Agent 应用组件说明

## 组件结构

### 1. PluginModal.vue - 插件选择弹窗
插件添加和管理的弹窗组件，包含两个标签页：
- **添加插件**：创建自定义插件
- **内置插件**：选择系统内置插件

**Props:**
- `visible`: boolean - 控制弹窗显示/隐藏

**Events:**
- `update:visible`: 更新弹窗显示状态
- `select`: 选择插件时触发，返回插件对象

**使用示例:**
```vue
<PluginModal
  v-model:visible="pluginModalVisible"
  @select="handleSelectPlugin"
/>
```

### 2. CapabilityItem.vue - 能力配置项组件
可展开/折叠的能力配置项，支持开关和添加按钮。

**Props:**
- `capability`: CapabilityItemData - 能力项数据

**Events:**
- `toggle`: 切换展开/折叠状态
- `toggle-enabled`: 切换启用/禁用状态
- `add`: 点击添加按钮

**使用示例:**
```vue
<CapabilityItem
  :capability="capability"
  @toggle="toggleCapability(capability.id)"
  @toggle-enabled="toggleEnabled(capability.id)"
  @add="openPluginModal"
>
  <!-- 自定义内容 -->
</CapabilityItem>
```

### 3. PluginList.vue - 已选插件列表组件
显示已添加的插件列表，支持设置和删除操作。

**Props:**
- `plugins`: SelectedPlugin[] - 已选插件列表

**Events:**
- `remove`: 移除插件
- `settings`: 插件设置

**使用示例:**
```vue
<PluginList
  :plugins="selectedPlugins"
  @remove="handleRemovePlugin"
  @settings="handlePluginSettings"
/>
```

## 功能说明

### 插件管理
1. 点击"扩展插件"右侧的"+"按钮打开插件选择弹窗
2. 在弹窗中可以：
   - 创建自定义插件
   - 浏览和搜索内置插件
   - 按分类筛选插件
3. 选择插件后自动添加到已选列表
4. 可以对已添加的插件进行设置或删除

### 组件拆分优势
- **代码复用**：各组件可独立使用
- **易于维护**：每个组件职责单一
- **性能优化**：按需加载和渲染
- **类型安全**：完整的 TypeScript 类型定义

## 文件结构
```
src/views/space/apps/
├── agent.vue                    # 主页面
└── components/
    ├── PluginModal.vue         # 插件选择弹窗
    ├── CapabilityItem.vue      # 能力配置项
    └── PluginList.vue          # 已选插件列表
```
