# Chip Register Calculator

芯片寄存器位计算工具 v2.2 — 一款面向嵌入式/硬件工程师的寄存器可视化管理工具，支持多进制数值计算、位分组管理和工程化组织。

## 技术栈

- **Vue 3** — Composition API + `<script setup>` SFC
- **TypeScript** — 完整类型定义
- **Vite 8** — 构建工具
- **Pinia 3** — 全局状态管理
- **Tailwind CSS 4** — 原子化样式，支持暗色模式

## 功能特性

### 位网格可视化 (BitGrid)

- 以 16 列网格展示寄存器位图，直观呈现每个 bit 的置位状态
- **单击**切换单个位的 0/1 状态
- **拖拽**选择连续位范围，一键创建分组
- 支持 8/16/32/64 位及自定义位宽

### 多进制数值显示与编辑

- 同时显示 **HEX（十六进制）**、**DEC（十进制）**、**BIN（二进制）**、**OCT（八进制）**
- 任意进制编辑后自动同步到所有进制和位图
- 支持 **Little Endian** 和 **Big Endian** 字节序切换

### 位分组管理 (Bit Groups)

- 在寄存器中划分功能位域，每个分组独立命名
- 分组以颜色标识，在位网格中高亮显示边界
- 分组值支持 HEX/DEC 直接输入编辑
- **映射规则**：可配置"数值等于"或"位置位"规则，一键点击应用/取消（Toggle 逻辑）
- 分组范围不可重叠，重复选择同一范围会删除该分组

### 工程模式 (Project Mode)

- **Simple 模式**：快速操作单个默认寄存器
- **Project 模式**：层级化管理 `芯片(Chip) → 寄存器(Register)`，适用于多芯片、多寄存器场景
- 项目导航器支持折叠/展开、动态增删芯片和寄存器

### 配置导入/导出

- 导出为 JSON，支持复制到剪贴板或保存为文件
- 支持粘贴 JSON 或上传文件导入，完整恢复工作状态

## 项目结构

```
ChipRegisterCalculator/
├── index.html                  # 入口 HTML
├── vite.config.ts              # Vite 配置 (Vue + Tailwind 插件)
├── package.json                # 依赖管理
├── tsconfig.json               # TypeScript 配置
├── public/
│   └── favicon.svg             # 网站图标
└── src/
    ├── main.ts                 # 应用入口，挂载 Pinia + Vue
    ├── App.vue                 # 根组件，三栏布局
    ├── style.css               # 全局样式 + Tailwind 导入
    ├── stores/
    │   └── register.ts         # Pinia Store：核心状态与业务逻辑
    └── components/
        ├── BitGrid.vue         # 位网格可视化组件
        ├── ValueDisplay.vue    # 多进制值展示与编辑
        ├── GroupList.vue       # 位分组列表管理
        ├── ProjectNavigator.vue # 项目/芯片/寄存器导航
        ├── ConfigManager.vue   # 配置导入导出
        └── Notification.vue    # 全局错误提示
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 使用说明

| 操作 | 方式 |
|------|------|
| 切换位值 | 在位网格中**单击**某个位按钮 |
| 创建分组 | 在位网格中**拖拽**选择连续的位范围 |
| 调整位宽 | 在属性配置面板中选择 8/16/32/64 或输入自定义值 |
| 编辑数值 | 在 HEX/DEC 输入框中直接输入，自动同步 |
| 编辑分组值 | 在分组卡片中输入 HEX/DEC 值 |
| 应用映射 | 点击分组内的配置按钮，切换对应值 |
| 添加芯片/寄存器 | 切换到 Project 模式，通过导航器操作 |
| 导入导出 | 使用底部配置管理面板 |

## 许可证

MIT
