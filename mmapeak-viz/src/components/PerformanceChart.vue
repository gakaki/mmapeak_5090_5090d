<template>
  <div class="performance-chart">
    <h2>{{ title }}</h2>
    <div class="chart-container">
      <div ref="chartContainer" class="chart"></div>
    </div>
    <div class="chart-info">
      <p v-if="performanceDiff">
        <strong>性能差异:</strong> RTX 5090 比 RTX 5090 D 平均高 {{ performanceDiff }}%
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { Chart } from '@antv/g2'
import type { PerformanceData } from '../data/resultParser'

interface Props {
  data: PerformanceData[]
  title: string
  metric: 'tflops' | 'timeSec'
}

const props = defineProps<Props>()
const chartContainer = ref<HTMLDivElement>()
let chart: Chart | null = null

// 计算性能差异
const performanceDiff = computed(() => {
  if (props.data.length === 0 || props.metric !== 'tflops') return null
  
  const device0Data = props.data.filter(d => d.device.includes('5090 D'))
  const device1Data = props.data.filter(d => d.device.includes('5090') && !d.device.includes('5090 D'))
  
  if (device0Data.length === 0 || device1Data.length === 0) return null
  
  const avg0 = device0Data.reduce((sum, d) => sum + d.tflops, 0) / device0Data.length
  const avg1 = device1Data.reduce((sum, d) => sum + d.tflops, 0) / device1Data.length
  
  return ((avg1 - avg0) / avg0 * 100).toFixed(1)
})

const initChart = () => {
  if (!chartContainer.value) return

  chart = new Chart({
    container: chartContainer.value,
    width: 1200,
    height: 700,
  })

  renderChart()
}

const renderChart = () => {
  if (!chart) return

  chart.clear()

  const chartData = props.data.map(item => ({
    operation: item.operationCN || item.operation,
    value: props.metric === 'tflops' ? item.tflops : item.timeSec,
    device: item.device.replace(' (设备 0)', '').replace(' (设备 1)', ''),
    originalOperation: item.operation,
    tflops: item.tflops,
    timeMs: item.timeMs,
    timeSec: item.timeSec
  }))

  console.log('图表数据长度:', chartData.length)
  console.log('图表数据示例:', chartData.slice(0, 2))

  chart
    .interval()
    .data(chartData)
    .encode('x', 'operation')
    .encode('y', 'value')
    .encode('color', 'device')
    .transform({ type: 'dodgeX' })
    .scale('color', {
      range: ['#ff7043', '#66bb6a']
    })
    .legend('color', { 
      position: 'top'
    })
    .axis('x', { 
      labelTransform: 'rotate(45)',
      labelAutoRotate: false,
      labelFontSize: 10,
      title: false
    })
    .axis('y', { 
      title: props.metric === 'tflops' ? 'TFLOPS' : '时间 (秒)',
      titleFontSize: 14,
      labelFontSize: 12
    })
    .style('stroke', '#fff')
    .style('strokeWidth', 1)
    .tooltip([
      { channel: 'x', name: '操作' },
      { channel: 'color', name: '设备' },
      { channel: 'y', name: props.metric === 'tflops' ? 'TFLOPS' : '时间' }
    ])

  chart.render()

  // 添加调试信息
  setTimeout(() => {
    console.log('图表渲染完成，DOM元素:', chartContainer.value?.innerHTML?.length > 0 ? '已渲染' : '未渲染')
  }, 100)
}

onMounted(() => {
  initChart()
})

watch(() => props.data, () => {
  renderChart()
}, { deep: true })

watch(() => props.metric, () => {
  renderChart()
})
</script>

<style scoped>
.performance-chart {
  margin: 20px 0;
}

.chart-container {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  min-height: 700px;
}

.chart {
  min-width: 1200px;
}

.chart-info {
  margin-top: 15px;
  padding: 15px;
  background: linear-gradient(135deg, #e8f5e8 0%, #fff8e1 100%);
  border-radius: 8px;
  border-left: 4px solid #2ecc71;
}

.chart-info p {
  margin: 0;
  font-size: 14px;
  color: #2c3e50;
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
</style> 