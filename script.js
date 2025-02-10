// script.js
// Dark/Light Mode Toggle
const modeToggle = document.getElementById('modeToggle');
modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    modeToggle.textContent = '☀️ Light Mode';
  } else {
    modeToggle.textContent = '🌙 Dark Mode';
  }
});

// Link slider and input field
const salaryPercentage = document.getElementById('salaryPercentage');
const percentageInput = document.getElementById('percentageInput');

function updateSlider(value) {
  salaryPercentage.value = value;
}

function updateInput(value) {
  percentageInput.value = value;
}

salaryPercentage.addEventListener('input', () => {
  updateInput(salaryPercentage.value);
});

percentageInput.addEventListener('input', () => {
  let value = parseFloat(percentageInput.value);
  if (value < 10) value = 10;
  if (value > 50) value = 50;
  updateSlider(value);
});

// Add new debt entries
document.getElementById('addDebt').addEventListener('click', () => {
  const debtEntries = document.getElementById('debtEntries');
  const newEntry = document.createElement('div');
  newEntry.className = 'debt-entry';
  newEntry.innerHTML = `
    <label>Debt Name:</label>
    <input type="text" class="debt-name" required>
    <label>Balance ($):</label>
    <input type="number" class="debt-balance" required>
    <label>Interest Rate (%):</label>
    <input type="number" class="debt-interest" required>
    <label>Minimum Payment ($):</label>
    <input type="number" class="debt-min-payment" required>
  `;
  debtEntries.appendChild(newEntry);
});

// Calculate repayment plan
document.getElementById('debtForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const salary = parseFloat(document.getElementById('salary').value);
  const percentage = parseFloat(salaryPercentage.value) / 100;
  const strategy = document.getElementById('strategy').value;
  const debtEntries = document.querySelectorAll('.debt-entry');

  let debts = [];
  debtEntries.forEach(entry => {
    const debt = {
      name: entry.querySelector('.debt-name').value,
      balance: parseFloat(entry.querySelector('.debt-balance').value),
      interest: parseFloat(entry.querySelector('.debt-interest').value) / 100,
      minPayment: parseFloat(entry.querySelector('.debt-min-payment').value)
    };
    debts.push(debt);
  });

  const result = calculateRepaymentPlan(debts, salary, percentage, strategy);
  displayResults(result);
});

// Simulate repayment process
function calculateRepaymentPlan(debts, salary, percentage, strategy) {
  let totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const initialDebt = totalDebt; // Store initial debt for display
  let monthlyPayment = salary * percentage;
  let totalInterest = 0;
  let months = 0;

  // Sort debts based on strategy
  if (strategy === 'snowball') {
    debts.sort((a, b) => a.balance - b.balance); // Smallest balance first
  } else if (strategy === 'avalanche') {
    debts.sort((a, b) => b.interest - a.interest); // Highest interest first
  }

  while (totalDebt > 0) {
    let payment = monthlyPayment;
    for (let debt of debts) {
      if (debt.balance > 0) {
        const interest = debt.balance * (debt.interest / 12);
        totalInterest += interest; // Add interest to total interest
        debt.balance += interest;

        const paid = Math.min(debt.balance, Math.max(debt.minPayment, payment));
        debt.balance -= paid;
        payment -= paid;
      }
    }
    totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
    months++;
  }

  return {
    totalDebt: initialDebt.toFixed(2), // Display initial debt, not remaining debt
    monthlyPayment: monthlyPayment.toFixed(2),
    repaymentDuration: months,
    totalInterest: totalInterest.toFixed(2)
  };
}

// Display results
function displayResults(result) {
  document.getElementById('totalDebt').textContent = result.totalDebt;
  document.getElementById('monthlyPayment').textContent = result.monthlyPayment;
  document.getElementById('repaymentDuration').textContent = result.repaymentDuration;
  document.getElementById('totalInterest').textContent = result.totalInterest;
  document.getElementById('results').classList.remove('hidden');
}