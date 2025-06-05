// 数据类型定义
export interface PerformanceData {
  operation: string
  operationCN: string
  device: string
  timeMs: number
  timeSec: number
  tflops: number
}

export interface DeviceInfo {
  name: string
  computeCapability: string
  memory: string
  multiprocessorCount: number
}

export interface ParseResult {
  performanceData: PerformanceData[]
  devices: DeviceInfo[]
}

// 操作类型中文映射 - 基于实际数据格式
const operationMapping: Record<string, string> = {
  'mma_s4s4s32_8_8_32': '4位有符号整数矩阵乘法 (8x8x32)',
  'mma_mxf4mxf4f32_16_8_64': '4位MX浮点矩阵乘法 (16x8x64)',
  'mma_nvf4nvf4f32_16_8_64': '4位NV浮点矩阵乘法 (16x8x64)',
  'mma_f4f4f16_16_8_32': '4位浮点到FP16矩阵乘法 (16x8x32)',
  'mma_f4f4f32_16_8_32': '4位浮点到FP32矩阵乘法 (16x8x32)',
  'mma_f6f6f16_16_8_32': '6位浮点到FP16矩阵乘法 (16x8x32)',
  'mma_f6f6f32_16_8_32': '6位浮点到FP32矩阵乘法 (16x8x32)',
  'mma_mxf6mxf6f32_16_8_32': '6位MX浮点矩阵乘法 (16x8x32)',
  'mma_mxf8mxf8f32_16_8_32': '8位MX浮点矩阵乘法 (16x8x32)',
  'mma_f8f8f16_16_8_32': '8位浮点到FP16矩阵乘法 (16x8x32)',
  'mma_f8f8f32_16_8_32': '8位浮点到FP32矩阵乘法 (16x8x32)',
  'mma_s8s8s32_16_16_16': '8位有符号整数矩阵乘法 (16x16x16)',
  'mma_s8s8s32_32_8_16': '8位有符号整数矩阵乘法 (32x8x16)',
  'mma_f16f16f16_16_16_16': 'FP16矩阵乘法 (16x16x16)',
  'mma_f16f16f16_32_8_16': 'FP16矩阵乘法 (32x8x16)',
  'mma_f16f16f32_16_16_16': 'FP16到FP32矩阵乘法 (16x16x16)',
  'mma_f16f16f32_32_8_16': 'FP16到FP32矩阵乘法 (32x8x16)',
  'mma_bf16bf16f32_16_16_16': 'BF16到FP32矩阵乘法 (16x16x16)',
  'mma_bf16bf16f32_32_8_16': 'BF16到FP32矩阵乘法 (32x8x16)',
  'mma_tf32tf32f32_16_16_8': 'TF32矩阵乘法 (16x16x8)'
}

// 使用真实数据作为示例
export const sampleData = `
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
mma_nvf4nvf4f32_16_8_64
run: 3013.3 ms 859.4 T(fl)ops
mma_f4f4f16_16_8_32
run: 3043.1 ms 342.5 T(fl)ops
mma_f4f4f32_16_8_32
run: 3002.8 ms 353.7 T(fl)ops
mma_f6f6f16_16_8_32
run: 2972.8 ms 353.5 T(fl)ops
mma_f6f6f32_16_8_32
run: 2946.9 ms 351.6 T(fl)ops
mma_mxf6mxf6f32_16_8_32
run: 2950.9 ms 352.3 T(fl)ops
mma_mxf8mxf8f32_16_8_32
run: 2995.3 ms 426.5 T(fl)ops
mma_f8f8f16_16_8_32
run: 3011.2 ms 427.6 T(fl)ops
mma_f8f8f32_16_8_32
run: 2873.1 ms 352.3 T(fl)ops
mma_s8s8s32_16_16_16
run: 2997.1 ms 428.6 T(fl)ops
mma_s8s8s32_32_8_16
run: 2972.7 ms 429.4 T(fl)ops
mma_f16f16f16_16_16_16
run: 3016.9 ms 427.9 T(fl)ops
mma_f16f16f16_32_8_16
run: 2993.2 ms 426.9 T(fl)ops
mma_f16f16f32_16_16_16
run: 2997.0 ms 337.0 T(fl)ops
mma_f16f16f32_32_8_16
run: 2865.6 ms 331.6 T(fl)ops
mma_bf16bf16f32_16_16_16
run: 3032.4 ms 340.5 T(fl)ops
mma_bf16bf16f32_32_8_16
run: 3034.0 ms 347.5 T(fl)ops
mma_tf32tf32f32_16_16_8
run: 3000.9 ms 85.5 T(fl)ops
----------------------------------------
Device 1: NVIDIA GeForce RTX 5090
  Compute capability: 12.0
  Total global memory: 31.8 GiB
  Multiprocessor count: 170
Running benchmarks with target time: 3.0 seconds
mma_s4s4s32_8_8_32
run: 3004.6 ms 79.5 T(fl)ops
mma_mxf4mxf4f32_16_8_64
run: 2975.2 ms 1462.4 T(fl)ops
mma_nvf4nvf4f32_16_8_64
run: 2996.1 ms 1463.6 T(fl)ops
mma_f4f4f16_16_8_32
run: 3000.2 ms 369.9 T(fl)ops
mma_f4f4f32_16_8_32
run: 2998.6 ms 369.9 T(fl)ops
mma_f6f6f16_16_8_32
run: 3000.2 ms 369.9 T(fl)ops
mma_f6f6f32_16_8_32
run: 2997.8 ms 369.9 T(fl)ops
mma_mxf6mxf6f32_16_8_32
run: 2998.7 ms 369.9 T(fl)ops
mma_mxf8mxf8f32_16_8_32
run: 2996.5 ms 731.5 T(fl)ops
mma_f8f8f16_16_8_32
run: 2996.8 ms 732.3 T(fl)ops
mma_f8f8f32_16_8_32
run: 2999.1 ms 369.9 T(fl)ops
mma_s8s8s32_16_16_16
run: 2999.5 ms 740.9 T(fl)ops
mma_s8s8s32_32_8_16
run: 3000.7 ms 740.9 T(fl)ops
mma_f16f16f16_16_16_16
run: 3000.3 ms 740.8 T(fl)ops
mma_f16f16f16_32_8_16
run: 2997.5 ms 740.7 T(fl)ops
mma_f16f16f32_16_16_16
run: 2992.5 ms 369.9 T(fl)ops
mma_f16f16f32_32_8_16
run: 2999.4 ms 369.9 T(fl)ops
mma_bf16bf16f32_16_16_16
run: 2999.9 ms 369.9 T(fl)ops
mma_bf16bf16f32_32_8_16
run: 2998.9 ms 369.9 T(fl)ops
mma_tf32tf32f32_16_16_8
run: 2997.0 ms 93.3 T(fl)ops
`

// 解析设备信息
function parseDevices(data: string): DeviceInfo[] {
  const devices: DeviceInfo[] = []
  const lines = data.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('Device ')) {
      // 解析设备基本信息
      const deviceMatch = line.match(/Device (\d+): (.+)/)
      if (deviceMatch) {
        const [, deviceId, deviceName] = deviceMatch
        
        // 查找设备详细信息
        let computeCapability = ''
        let memory = ''
        let multiprocessorCount = 0
        
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const detailLine = lines[j].trim()
          if (detailLine.includes('Compute capability:')) {
            computeCapability = detailLine.split(':')[1].trim()
          } else if (detailLine.includes('Total global memory:')) {
            memory = detailLine.split(':')[1].trim()
          } else if (detailLine.includes('Multiprocessor count:')) {
            multiprocessorCount = parseInt(detailLine.split(':')[1].trim())
          }
        }
        
        devices.push({
          name: `${deviceName} (设备 ${deviceId})`,
          computeCapability,
          memory,
          multiprocessorCount
        })
      }
    }
  }
  
  return devices
}

// 解析性能数据
function parsePerformance(data: string, devices: DeviceInfo[]): PerformanceData[] {
  const performanceData: PerformanceData[] = []
  const lines = data.split('\n')
  
  let currentDeviceIndex = -1
  let currentDeviceName = ''
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // 检测设备切换
    if (line.startsWith('Device ')) {
      const deviceMatch = line.match(/Device (\d+): (.+)/)
      if (deviceMatch) {
        currentDeviceIndex = parseInt(deviceMatch[1])
        currentDeviceName = devices[currentDeviceIndex]?.name || `设备 ${currentDeviceIndex}`
      }
    }
    
    // 检测操作名称行（不包含"run:"的行，且在设备信息之后）
    if (currentDeviceIndex >= 0 && 
        line.length > 0 && 
        !line.includes('run:') && 
        !line.includes('Device') && 
        !line.includes('Compute') && 
        !line.includes('Total') && 
        !line.includes('Multiprocessor') && 
        !line.includes('Running') && 
        !line.includes('---') &&
        line.match(/^mma_/)) {
      
      const operation = line
      
      // 查找下一行的运行数据
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim()
        const runMatch = nextLine.match(/run:\s+([\d.]+)\s+ms\s+([\d.]+)\s+T\(fl\)ops/)
        
        if (runMatch) {
          const [, timeMs, tflops] = runMatch
          
          performanceData.push({
            operation,
            operationCN: operationMapping[operation] || operation,
            device: currentDeviceName,
            timeMs: parseFloat(timeMs),
            timeSec: parseFloat(timeMs) / 1000,
            tflops: parseFloat(tflops)
          })
        }
      }
    }
  }
  
  return performanceData
}

// 主解析函数
export function parseResultData(data: string): ParseResult {
  const devices = parseDevices(data)
  const performanceData = parsePerformance(data, devices)
  
  return {
    devices,
    performanceData
  }
}

// 导出工具函数
export function formatTime(ms: number): string {
  if (ms < 1000) {
    return `${ms.toFixed(1)} ms`
  }
  return `${(ms / 1000).toFixed(3)} s`
}

export function formatTflops(tflops: number): string {
  if (tflops >= 1000) {
    return `${(tflops / 1000).toFixed(1)}K TFLOPS`
  }
  return `${tflops.toFixed(1)} TFLOPS`
}

export function getPerformanceLevel(tflops: number): 'high' | 'medium' | 'low' {
  if (tflops > 1000) return 'high'
  if (tflops > 500) return 'medium'
  return 'low'
} 