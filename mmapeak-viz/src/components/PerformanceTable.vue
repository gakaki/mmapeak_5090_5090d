<template>
  <div class="performance-table">
    <h2>性能数据详细表格</h2>
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>操作名称</th>
            <th>中文描述</th>
            <th>设备</th>
            <th>执行时间 (ms)</th>
            <th>执行时间 (秒)</th>
            <th>性能 (TFLOPS)</th>
            <th>性能差异</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in enhancedData" :key="index" 
              :class="[getRowClass(item), { 'highlight-row': item.hasComparison }]"
              @mouseenter="highlightComparison(item.operation)"
              @mouseleave="clearHighlight">
            <td class="operation-name">{{ item.operation }}</td>
            <td class="operation-cn">{{ item.operationCN }}</td>
            <td class="device-name">{{ item.device }}</td>
            <td class="time-ms">{{ item.timeMs.toFixed(1) }}</td>
            <td class="time-sec">{{ item.timeSec.toFixed(3) }}</td>
            <td class="tflops" :class="getTflopsClass(item.tflops)">{{ item.tflops.toFixed(1) }}</td>
            <td class="performance-diff" :class="getDiffClass(item.performanceDiff)">
              <span v-if="item.performanceDiff !== null">
                {{ item.performanceDiff > 0 ? '+' : '' }}{{ item.performanceDiff.toFixed(1) }}%
              </span>
              <span v-else class="no-comparison">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 统计信息 -->
    <div class="statistics">
      <h3>统计信息</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <label>总测试项目：</label>
          <span>{{ data.length }}</span>
        </div>
        <div class="stat-item">
          <label>最高性能：</label>
          <span>{{ maxTflops.toFixed(1) }} TFLOPS</span>
        </div>
        <div class="stat-item">
          <label>平均性能：</label>
          <span>{{ avgTflops.toFixed(1) }} TFLOPS</span>
        </div>
        <div class="stat-item">
          <label>最短时间：</label>
          <span>{{ minTime.toFixed(3) }} 秒</span>
        </div>
        <div class="stat-item">
          <label>可对比操作：</label>
          <span>{{ comparableOperations }} 组</span>
        </div>
        <div class="stat-item">
          <label>平均性能差异：</label>
          <span>{{ averagePerformanceDiff.toFixed(1) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PerformanceData } from '../data/resultParser'

interface Props {
  data: PerformanceData[]
}

const props = defineProps<Props>()
const highlightedOperation = ref<string | null>(null)

// 增强的数据，包含性能对比信息
const enhancedData = computed(() => {
  const operationGroups = new Map<string, PerformanceData[]>()
  
  // 按操作分组
  props.data.forEach(item => {
    if (!operationGroups.has(item.operation)) {
      operationGroups.set(item.operation, [])
    }
    operationGroups.get(item.operation)!.push(item)
  })
  
  return props.data.map(item => {
    const sameOperation = operationGroups.get(item.operation) || []
    let performanceDiff: number | null = null
    let hasComparison = false
    
    if (sameOperation.length === 2) {
      hasComparison = true
      const otherDevice = sameOperation.find(other => other.device !== item.device)
      if (otherDevice) {
        // 计算性能差异（相对于当前设备）
        performanceDiff = ((item.tflops - otherDevice.tflops) / otherDevice.tflops) * 100
      }
    }
    
    return {
      ...item,
      performanceDiff,
      hasComparison,
      isHighlighted: highlightedOperation.value === item.operation
    }
  })
})

// 计算统计数据
const maxTflops = computed(() => {
  if (props.data.length === 0) return 0
  return Math.max(...props.data.map(item => item.tflops))
})

const avgTflops = computed(() => {
  if (props.data.length === 0) return 0
  const sum = props.data.reduce((acc, item) => acc + item.tflops, 0)
  return sum / props.data.length
})

const minTime = computed(() => {
  if (props.data.length === 0) return 0
  return Math.min(...props.data.map(item => item.timeSec))
})

const comparableOperations = computed(() => {
  const operationGroups = new Map<string, number>()
  props.data.forEach(item => {
    operationGroups.set(item.operation, (operationGroups.get(item.operation) || 0) + 1)
  })
  return Array.from(operationGroups.values()).filter(count => count === 2).length
})

const averagePerformanceDiff = computed(() => {
  const validDiffs = enhancedData.value
    .filter(item => item.performanceDiff !== null && item.device.includes('RTX 5090') && !item.device.includes('5090 D'))
    .map(item => item.performanceDiff!)
  
  if (validDiffs.length === 0) return 0
  return validDiffs.reduce((sum, diff) => sum + diff, 0) / validDiffs.length
})

// 根据设备获取行样式
const getRowClass = (item: any) => {
  const baseClass = {
    'device-d': item.device.includes('5090 D'),
    'device-normal': item.device.includes('5090') && !item.device.includes('5090 D'),
    'highlighted': item.isHighlighted
  }
  
  return baseClass
}

// 根据TFLOPS值获取性能等级样式
const getTflopsClass = (tflops: number) => {
  if (tflops > 1000) return 'high-performance'
  if (tflops > 500) return 'medium-performance'
  return 'low-performance'
}

// 根据性能差异获取样式
const getDiffClass = (diff: number | null) => {
  if (diff === null) return ''
  if (diff > 10) return 'positive-large'
  if (diff > 0) return 'positive'
  if (diff < -10) return 'negative-large'
  return 'negative'
}

// 高亮比较
const highlightComparison = (operation: string) => {
  highlightedOperation.value = operation
}

const clearHighlight = () => {
  highlightedOperation.value = null
}
</script>

<style scoped>
.performance-table {
  margin: 20px 0;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.data-table th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #e1e5e9;
  transition: all 0.3s ease;
}

.data-table tr:hover {
  background-color: #f8f9fa;
}

.device-d {
  background-color: #fff3e0;
  border-left: 3px solid #ff9800;
}

.device-normal {
  background-color: #e8f5e8;
  border-left: 3px solid #4caf50;
}

.highlight-row {
  box-shadow: 0 0 0 2px #2196f3;
}

.highlighted {
  background-color: #e3f2fd !important;
  transform: scale(1.01);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

.operation-name {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #2c3e50;
  font-weight: 600;
}

.operation-cn {
  font-weight: 500;
  color: #34495e;
}

.device-name {
  font-weight: 600;
  color: #8e44ad;
}

.time-ms, .time-sec {
  text-align: right;
  font-family: 'Courier New', monospace;
}

.tflops {
  text-align: right;
  font-weight: 700;
  font-family: 'Courier New', monospace;
}

.performance-diff {
  text-align: center;
  font-weight: 700;
  font-family: 'Courier New', monospace;
}

.high-performance {
  color: #27ae60;
  background-color: #d5f4e6;
}

.medium-performance {
  color: #f39c12;
  background-color: #fef9e7;
}

.low-performance {
  color: #e74c3c;
  background-color: #fadbd8;
}

.positive-large {
  color: #27ae60;
  background-color: #d5f4e6;
}

.positive {
  color: #2ecc71;
  background-color: #eafaf1;
}

.negative {
  color: #e67e22;
  background-color: #fdf2e9;
}

.negative-large {
  color: #e74c3c;
  background-color: #fadbd8;
}

.no-comparison {
  color: #95a5a6;
  font-style: italic;
}

.statistics {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.statistics h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.stat-item {
  background: white;
  padding: 12px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-item label {
  font-weight: 600;
  color: #34495e;
}

.stat-item span {
  font-weight: 700;
  color: #8e44ad;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@media (max-width: 768px) {
  .data-table {
    font-size: 12px;
  }
  
  .data-table th,
  .data-table td {
    padding: 8px 4px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style> 