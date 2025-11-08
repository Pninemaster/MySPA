import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useBudgetStore = defineStore('budget', () => {
  const transactions = ref([])

  // Load from localStorage on start
  const saved = localStorage.getItem('budget-transactions')
  if (saved) {
    transactions.value = JSON.parse(saved).map(t => ({
      ...t,
      date: new Date(t.date) // convert back to Date object
    }))
  }

  // Watch for changes and save to localStorage
  watch(
    transactions,
    (newVal) => {
      // Store date as ISO string
      const toStore = newVal.map(t => ({ ...t, date: t.date.toISOString() }))
      localStorage.setItem('budget-transactions', JSON.stringify(toStore))
    },
    { deep: true }
  )

  const addTransaction = (type, amount, description, date = new Date()) => {
    transactions.value.push({
      id: Date.now(),
      type: type.charAt(0).toUpperCase() + type.slice(1), // capitalize type
      amount,
      description,
      date
    })
  }

  const removeTransaction = (id) => {
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  const totalIncome = computed(() =>
    transactions.value
      .filter(t => t.type.toLowerCase() === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  )

  const totalExpense = computed(() =>
    transactions.value
      .filter(t => t.type.toLowerCase() === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  )

  const balance = computed(() => totalIncome.value - totalExpense.value)

  return {
    transactions,
    addTransaction,
    removeTransaction,
    totalIncome,
    totalExpense,
    balance
  }
})
