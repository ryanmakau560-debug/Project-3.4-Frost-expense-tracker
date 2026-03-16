class Expense {
  constructor(description, amount, category) {
    this.id = Date.now().toString(); // simple unique id
    this.description = description;
    this.amount = parseFloat(amount);
    this.category = category;
  }
}

class ExpenseTracker {
  constructor() {
    this.expenses = this.loadFromStorage();
  }

  loadFromStorage() {
    const data = localStorage.getItem('expenses');
    return data ? JSON.parse(data) : [];
  }

  saveToStorage() {
    localStorage.setItem('expenses', JSON.stringify(this.expenses));
  }

  addExpense(description, amount, category) {
    if (!description || !amount || amount <= 0 || !category) {
      alert('Please fill all fields correctly.');
      return false;
    }

    const expense = new Expense(description, amount, category);
    this.expenses = [...this.expenses, expense]; // spread operator
    this.saveToStorage();
    return true;
  }

  removeExpense(id) {
    this.expenses = this.expenses.filter(exp => exp.id !== id);
    this.saveToStorage();
  }

  getFilteredExpenses(filterCategory) {
    return filterCategory
      ? this.expenses.filter(exp => exp.category === filterCategory)
      : [...this.expenses]; // spread to avoid mutating original
  }

  getTotal() {
    return this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }
}

// ────────────────────────────────────────────────

const tracker = new ExpenseTracker();

const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const addBtn = document.getElementById('addBtn');
const filterSelect = document.getElementById('filter');
const expenseList = document.getElementById('expenseList');
const totalDisplay = document.getElementById('totalAmount');
const emptyMessage = document.getElementById('empty');

function renderExpenses(filter = '') {
  const filtered = tracker.getFilteredExpenses(filter);

  expenseList.innerHTML = '';

  if (filtered.length === 0) {
    emptyMessage.style.display = 'block';
  } else {
    emptyMessage.style.display = 'none';

    filtered.forEach(exp => {
      const row = document.createElement('tr');

      // Destructuring example
      const { description, amount, category, id } = exp;

      row.innerHTML = `
        <td>${description}</td>
        <td>$${amount.toFixed(2)}</td>
        <td>${category}</td>
        <td><button class="delete-btn" data-id="${id}">Delete</button></td>
      `;

      expenseList.appendChild(row);
    });
  }

  // Update total (using reduce)
  totalDisplay.textContent = `$${tracker.getTotal().toFixed(2)}`;
}

// Event Listeners
addBtn.addEventListener('click', () => {
  const added = tracker.addExpense(
    descriptionInput.value.trim(),
    amountInput.value,
    categorySelect.value
  );

  if (added) {
    descriptionInput.value = '';
    amountInput.value = '';
    categorySelect.value = '';
    renderExpenses(filterSelect.value);
  }
});

expenseList.addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.dataset.id;
    tracker.removeExpense(id);
    renderExpenses(filterSelect.value);
  }
});

filterSelect.addEventListener('change', () => {
  renderExpenses(filterSelect.value);
});

// Initial render
renderExpenses();