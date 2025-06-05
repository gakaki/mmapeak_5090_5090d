<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PerformanceChart from './components/PerformanceChart.vue'
import PerformanceTable from './components/PerformanceTable.vue'
import { parseResultData, sampleData } from './data/resultParser'
import type { PerformanceData, DeviceInfo } from './data/resultParser'

// 响应式数据
const performanceData = ref<PerformanceData[]>([])
const devices = ref<DeviceInfo[]>([])
const currentMetric = ref<'tflops' | 'timeSec'>('tflops')
const fileInput = ref<HTMLInputElement>()

// 计算属性
const chartTitle = computed(() => {
  return currentMetric.value === 'tflops' 
    ? '🔥 矩阵乘法操作性能对比 (TFLOPS)' 
    : '⏱️ 矩阵乘法操作执行时间对比 (秒)'
})

// 加载示例数据
const loadSampleData = () => {
  const result = parseResultData(sampleData)
  performanceData.value = result.performanceData
  devices.value = result.devices
  console.log('加载示例数据:', result)
}

// 加载真实数据文件
const loadRealData = async () => {
  try {
    const response = await fetch('/result.txt')
    const content = await response.text()
    const result = parseResultData(content)
    performanceData.value = result.performanceData
    devices.value = result.devices
    console.log('加载真实数据:', result)
  } catch (error) {
    console.warn('无法加载 result.txt，使用示例数据:', error)
    loadSampleData()
  }
}

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const result = parseResultData(content)
      performanceData.value = result.performanceData
      devices.value = result.devices
      console.log('文件上传数据:', result)
    }
    reader.readAsText(file)
  }
}

// 初始化时尝试加载真实数据
onMounted(() => {
  loadRealData()
})
</script>

<template>
  <div id="app">
    <header class="app-header">
      <h1>🚀 MMAPEAK 性能可视化分析面板</h1>
      <p class="subtitle">CUDA 矩阵乘法性能测试结果可视化 - RTX 5090 vs RTX 5090 D</p>
    </header>

    <main class="main-content">
      <!-- 设备信息 -->
      <section class="device-info" v-if="devices.length > 0">
        <h2>🖥️ 测试设备信息</h2>
        <div class="device-cards">
          <div v-for="(device, index) in devices" :key="index" class="device-card">
            <h3>{{ device.name }}</h3>
            <div class="device-details">
              <div class="detail-item">
                <span class="label">计算能力:</span>
                <span class="value">{{ device.computeCapability }}</span>
              </div>
              <div class="detail-item">
                <span class="label">显存:</span>
                <span class="value">{{ device.memory }}</span>
              </div>
              <div class="detail-item">
                <span class="label">多处理器数量:</span>
                <span class="value">{{ device.multiprocessorCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 控制面板 -->
      <section class="controls">
        <div class="control-group">
          <label>显示指标:</label>
          <div class="radio-group">
            <label class="radio-item">
              <input type="radio" v-model="currentMetric" value="tflops" />
              <span>性能 (TFLOPS)</span>
            </label>
            <label class="radio-item">
              <input type="radio" v-model="currentMetric" value="timeSec" />
              <span>执行时间 (秒)</span>
            </label>
          </div>
        </div>
        
        <div class="control-group">
          <label>数据源:</label>
          <div class="file-upload">
            <input 
              type="file" 
              @change="handleFileUpload" 
              accept=".txt"
              ref="fileInput"
              style="display: none"
            />
            <button @click="fileInput?.click()" class="upload-btn">
              📁 上传结果文件
            </button>
            <button @click="loadSampleData" class="sample-btn">
              📊 使用示例数据
            </button>
            <button @click="loadRealData" class="real-btn">
              🔄 重新加载真实数据
            </button>
          </div>
        </div>
      </section>

      <!-- 图表展示 -->
      <section class="charts" v-if="performanceData.length > 0">
        <PerformanceChart 
          :data="performanceData" 
          :title="chartTitle"
          :metric="currentMetric"
        />
      </section>

      <!-- 数据表格 -->
      <section class="table" v-if="performanceData.length > 0">
        <PerformanceTable :data="performanceData" />
      </section>

      <!-- 空状态 -->
      <section class="empty-state" v-if="performanceData.length === 0">
        <div class="empty-content">
          <h3>📈 暂无数据</h3>
          <p>请上传性能测试结果文件或使用示例数据开始分析</p>
          <button @click="loadSampleData" class="sample-btn large">
            加载示例数据
          </button>
        </div>
      </section>
    </main>

    <footer class="app-footer">
      <p>
        Powered by Vue 3 + Vite + AntV | 
        MMAPEAK Performance Visualization Dashboard
      </p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 1rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.main-content {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
  width: 100%;
}

.device-info {
  margin-bottom: 2rem;
}

.device-info h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
}

.device-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.device-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-left: 5px solid #667eea;
}

.device-card h3 {
  color: #8e44ad;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.device-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-item .label {
  font-weight: 600;
  color: #34495e;
}

.detail-item .value {
  font-weight: 500;
  color: #2c3e50;
  background: #ecf0f1;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.controls {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.control-group label {
  font-weight: 600;
  color: #2c3e50;
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;
}

.radio-item input[type="radio"] {
  margin: 0;
}

.file-upload {
  display: flex;
  gap: 1rem;
}

.upload-btn, .sample-btn, .real-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.upload-btn {
  background: #3498db;
  color: white;
}

.upload-btn:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.sample-btn {
  background: #2ecc71;
  color: white;
}

.sample-btn:hover {
  background: #27ae60;
  transform: translateY(-2px);
}

.real-btn {
  background: #9b59b6;
  color: white;
}

.real-btn:hover {
  background: #8e44ad;
  transform: translateY(-2px);
}

.sample-btn.large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.charts, .table {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.empty-content h3 {
  color: #7f8c8d;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.empty-content p {
  color: #95a5a6;
  margin-bottom: 2rem;
}

.app-footer {
  background: #34495e;
  color: #ecf0f1;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .control-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .radio-group, .file-upload {
    justify-content: center;
  }
}
</style> 