# Views 目录结构说明

## 目录结构

```
src/views/
├── home/                           # 首页模块
│   └── index.vue                  # 首页
│
├── list/                           # 列表页模块
│   └── index.vue                  # 列表页
│
├── auth/                           # 认证模块
│   └── login/                     # 登录
│       └── index.vue              # 登录页
│
├── space/                          # 工作空间模块
│   └── apps/                      # 应用管理
│       ├── detail/                # 应用详情
│       │   └── index.vue          # 详情页
│       │
│       └── agent/                 # Agent 应用编辑器
│           ├── index.vue          # Agent 编辑器主页面
│           └── components/        # Agent 专属组件
│               ├── PluginModal.vue      # 插件选择弹窗
│               ├── CapabilityItem.vue   # 能力配置项
│               ├── PluginList.vue       # 已选插件列表
│               └── README.md            # 组件说明文档
│
└── _demo/                          # 演示/测试文件
    ├── Demo.vue                   # 演示页面
    ├── Demo-1.vue                 # 演示页面1
    └── Test.vue                   # 测试页面
```

## 设计原则

### 1. 模块化分组
按业务功能将页面分组到不同的模块目录：
- `home` - 首页相关
- `auth` - 认证相关（登录、注册等）
- `space` - 工作空间相关
- `_demo` - 演示和测试文件

### 2. 统一命名规范
- **目录名**：全部使用小写字母，多个单词用连字符连接（kebab-case）
- **文件名**：页面入口统一命名为 `index.vue`，便于识别
- **测试文件**：使用下划线前缀（`_demo`）标识非正式代码

### 3. 组件就近原则
每个页面的专属组件放在同级 `components` 目录下：
```
agent/
├── index.vue          # 页面主文件
└── components/        # 页面专属组件
    ├── PluginModal.vue
    └── ...
```

### 4. 路由映射
路由路径与目录结构保持一致：
```typescript
'/home'                  -> views/home/index.vue
'/auth/login'            -> views/auth/login/index.vue
'/space/apps/agent'      -> views/space/apps/agent/index.vue
'/space/apps/:app_id'    -> views/space/apps/detail/index.vue
```

## 优化效果

### 优化前的问题
- ❌ 命名不统一（About、Login、space 混用大小写）
- ❌ 测试文件混在正式代码中
- ❌ agent.vue 和其组件分离，不便管理
- ❌ 缺少清晰的模块划分

### 优化后的优势
- ✅ 统一的命名规范，易于理解和维护
- ✅ 清晰的模块划分，便于团队协作
- ✅ 测试文件独立隔离，不影响正式代码
- ✅ 组件就近管理，提高开发效率
- ✅ 可扩展性强，易于添加新模块

## 添加新页面

### 示例：添加注册页面

1. 创建目录和文件：
```bash
mkdir -p src/views/auth/register
touch src/views/auth/register/index.vue
```

2. 添加路由配置：
```typescript
{
  path: 'register',
  component: () => import('@/views/auth/register/index.vue'),
}
```

### 示例：添加带组件的页面

1. 创建目录结构：
```bash
mkdir -p src/views/space/apps/workflow/components
touch src/views/space/apps/workflow/index.vue
```

2. 在 components 目录下添加专属组件

3. 在 index.vue 中引入组件：
```vue
<script setup lang="ts">
import MyComponent from './components/MyComponent.vue'
</script>
```

## 注意事项

1. **不要在 views 根目录直接放置 .vue 文件**，应该放在对应的模块目录下
2. **测试和演示文件**统一放在 `_demo` 目录
3. **共享组件**应该放在 `src/components` 目录，而不是 views 下
4. **保持目录层级简洁**，避免过深的嵌套（建议不超过4层）

## 迁移记录

| 原路径 | 新路径 | 说明 |
|--------|--------|------|
| `About/index.vue` | `home/index.vue` | 重命名为更语义化的名称 |
| `List/index.vue` | `list/index.vue` | 统一为小写 |
| `Login/index.vue` | `auth/login/index.vue` | 归类到认证模块 |
| `space/apps/DetailView.vue` | `space/apps/detail/index.vue` | 统一命名规范 |
| `space/apps/agent.vue` | `space/apps/agent/index.vue` | 独立成目录 |
| `space/apps/components/` | `space/apps/agent/components/` | 组件就近管理 |
| `space/apps/Demo*.vue` | `_demo/Demo*.vue` | 隔离测试文件 |
| `space/apps/Test.vue` | `_demo/Test.vue` | 隔离测试文件 |
