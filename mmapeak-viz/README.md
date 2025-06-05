# MMAPEAK 性能可视化面板

这是一个基于 Vue 3 + Vite + AntV 的 CUDA 矩阵乘法性能测试结果可视化应用程序。

## 功能特性

- 📊 **交互式图表**: 使用 AntV G2 创建美观的柱状图
- 📋 **数据表格**: 详细的性能数据表格展示
- 🔄 **实时切换**: 支持性能(TFLOPS)和执行时间(秒)两种视图
- 📁 **文件上传**: 支持上传自定义的测试结果文件
- 🎨 **响应式设计**: 支持桌面和移动设备
- 🌐 **中文界面**: 完全中文化的用户界面

## 支持的数据格式

支持解析以下操作类型的性能数据：
- **4位精度**: INT4, MXF4, NVF4, FP4
- **6位精度**: FP6, MXF6  
- **8位精度**: FP8, MXF8, INT8
- **16位精度**: FP16, BF16
- **32位精度**: TF32

## 快速开始

### 环境要求

- Node.js 18+
- pnpm

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm run dev
```

应用将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
pnpm run build
```

## 使用方法

1. **加载数据**:
   - 点击"使用示例数据"按钮查看演示
   - 或上传自己的 `.txt` 格式测试结果文件

2. **切换视图**:
   - 选择"性能 (TFLOPS)"查看计算性能对比
   - 选择"执行时间 (秒)"查看时间消耗对比

3. **数据分析**:
   - 查看设备信息了解测试硬件
   - 分析柱状图对比不同精度格式的性能
   - 查看详细表格了解具体数值

## 数据文件格式

支持的输入文件格式示例：

```
----------------------------------------
Device 0: NVIDIA GeForce RTX 5090 D
  Compute capability: 12.0
  Total global memory: 31.8 GiB
  Multiprocessor count: 170
Running benchmarks with target time: 3.0 seconds
mma_s4s4s32_8_8_32
run: 2987.2 ms 75.8 T(fl)ops
mma_mxf4mxf4f32_16_8_64
run: 2974.2 ms 859.6 T(fl)ops
...
```

## 技术栈

- **Vue 3**: 现代前端框架
- **Vite**: 快速构建工具
- **TypeScript**: 类型安全
- **AntV G2**: 专业数据可视化
- **CSS3**: 现代样式设计

## 项目结构

```
src/
├── components/
│   ├── PerformanceChart.vue    # 图表组件
│   └── PerformanceTable.vue    # 表格组件
├── data/
│   └── resultParser.ts         # 数据解析模块
├── App.vue                     # 主应用组件
└── main.ts                     # 应用入口
```

## 性能指标说明

- **TFLOPS**: 每秒万亿次浮点运算，数值越高性能越好
- **执行时间**: 操作完成所需时间，时间越短效率越高
- **不同精度格式**: 对比各种位宽的计算精度和性能平衡

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

MIT License
