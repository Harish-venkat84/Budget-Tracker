const form = document.querySelector(".add");
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

let transactions =
  localStorage.getItem("transactions") !== null
    ? JSON.parse(localStorage.getItem("transactions"))
    : [];

function generaateTemplate(id, source, time, amount) {
  return `<li data-id="${id}">
            <p>
              <span>${source}</span>
              <span id="time">${time}</span>
            </p>
            <span>₹${Math.abs(amount)}</span>
            <i class="bi bi-trash-fill delete"></i>
          </li>`;
}

function addTransactionsDOM(id, source, amount, time, trans) {
  if (trans === "Income") {
    incomeList.innerHTML += generaateTemplate(id, source, time, amount);
  } else if (trans === "Expense") {
    expenseList.innerHTML += generaateTemplate(id, source, time, amount);
  }
}

function addTransactions(source, trans, amount) {
  const time = new Date();
  const transaction = {
    id: Math.floor(Math.random() * 100000),
    source: source,
    transactions: trans,
    amount: amount,
    time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`,
  };

  transactions.push(transaction);
  // console.log(transactions);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  addTransactionsDOM(transaction.id, source, amount, transaction.time, trans);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (form.source.value.trim() === "" || form.source.value === "") {
    return alert("Please add proper values!");
  }

  addTransactions(
    form.source.value.trim(),
    form.transactions.value,
    Math.abs(Number(form.amount.value))
  );

  form.reset();
  updateStatistics();
});

function getTransactions() {
  transactions.forEach((element) => {
    if (element.transactions === "Income") {
      incomeList.innerHTML += generaateTemplate(
        element.id,
        element.source,
        element.time,
        element.amount
      );
    } else if (element.transactions === "Expense") {
      expenseList.innerHTML += generaateTemplate(
        element.id,
        element.source,
        element.time,
        element.amount
      );
    }
  });
}

getTransactions();

function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => {
    return transaction.id !== Number(id);
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));
}

incomeList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    deleteTransaction(event.target.parentElement.dataset.id);
    updateStatistics();
  }
});

expenseList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    deleteTransaction(event.target.parentElement.dataset.id);
    updateStatistics();
  }
});

function updateStatistics() {
  const updateIncome = transactions
    .filter((transactions) => transactions.transactions === "Income")
    .reduce((total, transactions) => (total += transactions.amount), 0);

  const updateExpense = transactions
    .filter((transactions) => transactions.transactions === "Expense")
    .reduce((total, transactions) => (total += transactions.amount), 0);

  income.textContent = updateIncome;
  expense.textContent = updateExpense;
  balance.textContent = updateIncome - updateExpense;
}

updateStatistics();
