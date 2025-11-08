<template>
  <div class="budget-view">
    <h2>💰 Budget Tracker</h2>

    <!-- Add transaction card -->
    <div class="card add-transaction">
      <input v-model="desc" placeholder="Description" />
      <input v-model.number="amount" type="number" placeholder="Amount" />
      <select v-model="type">
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <button @click="add">Add</button>
    </div>

    <!-- Balance card with pie chart -->
    <div class="card balance-card">
      <h3>Balance: {{ store.balance }}</h3>
      <div class="totals">
        <div class="income">Income: {{ store.totalIncome }}</div>
        <div class="expense">Expense: {{ store.totalExpense }}</div>
      </div>
      <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>

    <!-- Transactions grid -->
    <div class="transactions">
      <h4>Transactions</h4>
      <div v-if="store.transactions.length === 0" class="empty">
        No transactions yet.
      </div>
      <div class="transaction-grid">
        <div
          v-for="t in store.transactions"
          :key="t.id"
          class="transaction-card"
          :class="t.type"
        >
          <div class="desc">{{ t.description }}</div>
          <div class="amount">{{ t.amount }}</div>
          <div class="type">{{ capitalize(t.type) }}</div>
          <div class="date">{{ formatDate(t.date) }}</div>
          <button @click="store.removeTransaction(t.id)">Remove</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useBudgetStore } from '../stores/budgetStore'
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js'

Chart.register(ArcElement, Tooltip, Legend, PieController)

const store = useBudgetStore()
const desc = ref('')
const amount = ref(0)
const type = ref('income')

// Pie Chart
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
          data: [store.totalIncome, store.totalExpense],
          backgroundColor: ['#27ae60', '#c0392b']
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  })
}

// Render chart on mount and whenever totals change
onMounted(renderChart)
watch(
  () => [store.totalIncome, store.totalExpense],
  renderChart
)

// Format date nicely
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleString()
}

// Capitalize first letter of each word
const capitalizeWords = (str) => {
  return str
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Capitalize single word (for type display)
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

// Add transaction with date + auto-uppercase description
const add = () => {
  if (!desc.value || !amount.value) return

  const formattedDesc = capitalizeWords(desc.value)
  store.addTransaction(type.value, amount.value, formattedDesc, new Date())

  desc.value = ''
  amount.value = 0
}
</script>

<style scoped>
.budget-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* Card style */
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 16px;
  margin-bottom: 20px;
}

/* Add transaction */
.add-transaction {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.add-transaction input, .add-transaction select {
  flex: 1 1 150px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.add-transaction button {
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.add-transaction button:hover {
  background: #2980b9;
}

/* Balance card */
.balance-card {
  text-align: center;
}
.totals {
  display: flex;
  justify-content: space-around;
  margin-top: 8px;
}
.income { color: #27ae60; font-weight: bold; }
.expense { color: #c0392b; font-weight: bold; }
.chart-container {
  width: 100%;
  max-width: 400px;
  height: 300px;
  margin: 20px auto 0 auto;
}

/* Transactions grid */
.transactions h4 { margin-bottom: 8px; }
.transaction-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}
.transaction-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.transaction-card.income { border-left: 4px solid #27ae60; }
.transaction-card.expense { border-left: 4px solid #c0392b; }
.transaction-card .desc { font-weight: bold; margin-bottom: 4px; }
.transaction-card .amount { margin-bottom: 4px; }
.transaction-card .type { font-size: 12px; color: #555; margin-bottom: 4px; }
.transaction-card .date { font-size: 11px; color: #666; margin-bottom: 8px; }
.transaction-card button {
  align-self: flex-end;
  padding: 4px 8px;
  font-size: 12px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.transaction-card button:hover { background: #c0392b; }

/* Empty transactions */
.empty { text-align: center; color: #999; font-style: italic; }
</style>
