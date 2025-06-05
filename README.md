# MMAPEAK - CUDA Matrix Multiply Performance Benchmark


# MMAPEAK 性能可视化面板

这是一个基于 Vue 3 + Vite + AntV 的 CUDA 矩阵乘法性能测试结果可视化应用程序。

![性能对比图表](./performance-chart.png)

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

## RTX 5090 vs RTX 5090 D 性能差异分析

### 4位精度操作性能对比

在4位精度矩阵乘法操作中，两款显卡表现出显著的性能差异：

| 操作类型 | RTX 5090 D | RTX 5090 | 性能差异 | 提升比例 |
|---------|------------|----------|----------|---------|
| MXF4×MXF4→F32 | 859.6 TFLOPS | 1,462.4 TFLOPS | +602.8 TFLOPS | **+70.1%** |
| NVF4×NVF4→F32 | 859.4 TFLOPS | 1,463.6 TFLOPS | +604.2 TFLOPS | **+70.3%** |

**4位精度关键发现**：
- RTX 5090 在4位精度操作中表现出**约70%的性能优势**
- 两款显卡都能达到极高的计算密度，但RTX 5090明显更优
- 4位精度是AI推理和量化模型的关键精度格式

### 8位精度操作性能对比

在8位精度矩阵乘法操作中，性能差异同样明显：

| 操作类型 | RTX 5090 D | RTX 5090 | 性能差异 | 提升比例 |
|---------|------------|----------|----------|---------|
| MXF8×MXF8→F32 | 426.5 TFLOPS | 731.5 TFLOPS | +305.0 TFLOPS | **+71.5%** |
| F8×F8→F16 | 427.6 TFLOPS | 732.3 TFLOPS | +304.7 TFLOPS | **+71.3%** |
| INT8×INT8→INT32 | 428.6 TFLOPS | 740.9 TFLOPS | +312.3 TFLOPS | **+72.9%** |

**8位精度关键发现**：
- RTX 5090 在8位精度操作中表现出**约71-73%的性能优势**
- 性能提升幅度与4位精度基本一致，说明硬件架构优化是全面性的
- 8位精度在训练和推理中都有重要应用

### 技术分析总结

**硬件架构差异**：
1. **计算单元优化**：RTX 5090 相比 RTX 5090 D 在低精度计算单元上有显著优化
2. **内存带宽**：虽然两者全局内存相同(31.8 GiB)，但RTX 5090的内存子系统性能更优
3. **多处理器效率**：相同的170个多处理器，但RTX 5090的调度和执行效率更高

**应用场景影响**：
1. **AI训练**：在混合精度训练中，RTX 5090能提供70%以上的速度优势
2. **推理加速**：量化模型部署时，RTX 5090的优势更加明显
3. **成本效益**：RTX 5090在单位时间内能处理更多数据，提高整体吞吐量

**优化建议**：
- 对于大规模AI工作负载，优先选择RTX 5090
- RTX 5090 D适合预算有限但仍需要高性能计算的场景
- 在4位和8位精度为主的应用中，两者性能差异最为显著

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

MIT License



MMAPEAK is a CUDA-based benchmarking tool designed to measure the peak performance of matrix multiplication operations across various data types and tensor core configurations on NVIDIA GPUs.

## Overview

This tool measures the throughput of NVIDIA's Tensor Core dense operations using different precision formats:
- 4-bit integer (Int4)
- 4-bit floating point (FP4)
- 4-bit floating point with group scale (MXFP4 G32, NVFP4 G16)
- 6-bit floating point (FP6)
- 6-bit floating point with group scale (MXFP6 G32)
- 8-bit integer (INT8)
- 8-bit floating point (FP8)
- 8-bit floating point with group scale (MXFP8 G32)
- 16-bit floating point (FP16, BF16)
- 32-bit floating point (TF32)

## Building

### Using CMake

```bash
mkdir build && cd build
cmake ..
make
```a 

#### Note

Please use CUDA Toolkit version 12.8.1 (or later) instead of 12.8.0 to ensure compatibility with the Blackwell architecture.

`wgmma` is not currently utilized, results in suboptimal FP8 performance on Hopper devices.

## Usage

```bash
./mmapeak [options]
```

### Options

- `-t <seconds>`: Set target time for benchmarks in seconds (default: 3.0)
- `-h, --help`: Show help message

## Example Output

```
----------------------------------------
Device 0: NVIDIA H100 NVL
  Compute capability: 9.0
  Total global memory: 93.1 GiB
  Multiprocessor count: 132
Running benchmarks with target time: 3.0 seconds
mma_s4s4s32_8_8_32
run: 2998.6 ms 28.1 T(fl)ops
mma_mxf4mxf4f32_16_8_64
not supported
mma_nvf4nvf4f32_16_8_64
not supported
mma_f4f4f16_16_8_32
not supported
mma_f4f4f32_16_8_32
not supported
mma_f6f6f16_16_8_32
not supported
mma_f6f6f32_16_8_32
not supported
mma_mxf6mxf6f32_16_8_32
not supported
mma_mxf8mxf8f32_16_8_32
not supported
mma_f8f8f16_16_8_32
run: 3000.3 ms 1431.8 T(fl)ops
mma_f8f8f32_16_8_32
run: 2999.1 ms 1208.5 T(fl)ops
mma_s8s8s32_16_16_16
run: 2998.4 ms 1410.1 T(fl)ops
mma_s8s8s32_32_8_16
run: 2998.0 ms 1409.6 T(fl)ops
mma_f16f16f16_16_16_16
run: 2999.3 ms 992.3 T(fl)ops
mma_f16f16f16_32_8_16
run: 2999.5 ms 981.2 T(fl)ops
mma_f16f16f32_16_16_16
run: 2998.3 ms 978.4 T(fl)ops
mma_f16f16f32_32_8_16
run: 3001.9 ms 976.8 T(fl)ops
mma_bf16bf16f32_16_16_16
run: 2997.8 ms 972.9 T(fl)ops
mma_bf16bf16f32_32_8_16
run: 3000.0 ms 977.0 T(fl)ops
mma_tf32tf32f32_16_16_8
run: 2998.6 ms 380.6 T(fl)ops
```

## Compatibility

Tensor core operations that are not supported on your hardware will display "not supported".

## Architecture Support

- Turing (2080ti, etc.): SM75
- Ampere (A100, A30, etc.): SM80
- Ampere (A40, 3090, etc.): SM86
- Ada Lovelace (L40, 4090, etc.): SM89
- Hopper (H100, H200): SM90
- Blackwell (5090, etc.): SM120a

## License

This project is provided as-is.
