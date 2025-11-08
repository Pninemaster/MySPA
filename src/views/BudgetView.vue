<template>
  <div>
    <h2>Budget Tracker</h2>

    <div>
      <input v-model="desc" placeholder="Description" />
      <input v-model.number="amount" type="number" placeholder="Amount" />
      <select v-model="type">
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <button @click="add">Add</button>
    </div>

    <h3>Balance: {{ store.balance }}</h3>
    <h4>Income: {{ store.totalIncome }}, Expense: {{ store.totalExpense }}</h4>

    <ul>
      <li v-for="t in store.transactions" :key="t.id">
        {{ t.description }} - {{ t.type }}: {{ t.amount }}
        <button @click="store.removeTransaction(t.id)">Remove</button>
      </li>
    </ul>

    <!-- ✅ Move PieChart inside the main container -->
    <PieChart :income="store.totalIncome" :expense="store.totalExpense" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBudgetStore } from '../stores/budgetStore'
import PieChart from '../components/Budget/PieChart.vue'  // ✅ Make sure this import exists!

const store = useBudgetStore()
const desc = ref('')
const amount = ref(0)
const type = ref('income')

const add = () => {
  if (!desc.value || !amount.value) return
  store.addTransaction(type.value, amount.value, desc.value)
  desc.value = ''
  amount.value = 0
}
</script>

<style>
input, select { margin: 0.5rem; }
</style>
