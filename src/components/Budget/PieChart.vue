<template>
  <div style="width: 100%; max-width: 400px; margin: 1rem auto;">
    <canvas ref="chartCanvas" style="width: 100%; height: 300px;"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js'
Chart.register(ArcElement, Tooltip, Legend, PieController)

const props = defineProps({
  income: { type: Number, default: 0 },
  expense: { type: Number, default: 0 }
})

const chartCanvas = ref(null)
let chartInstance = null

const renderChart = () => {
  if (!chartCanvas.value) return
  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(chartCanvas.value, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [
        {
          data: [props.income, props.expense],
          backgroundColor: ['#4CAF50', '#F44336']
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  })
}

onMounted(renderChart)
watch(() => [props.income, props.expense], renderChart, { deep: true })
</script>
