# MMAPEAK - CUDA Matrix Multiply Performance Benchmark

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
```

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
