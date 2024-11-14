document.addEventListener("DOMContentLoaded", () => {
  const transactionForm = document.getElementById("transaction-form");
  const transactionList = document.getElementById("transaction-list");
  const filterCategory = document.getElementById("filter-category");
  const categoryDropdown = document.getElementById("category"); 

  
  // Retriving transactions from local storage or initialize an empty array
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  // Save transactions to storage
  function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }

  //handle custom category
  categoryDropdown.addEventListener("change", () => {
    if (categoryDropdown.value === "Custom") {
      
      const customCategory = prompt("Enter a custom category:");

      if (customCategory && customCategory.trim() !== "") {
        
        const newOption = document.createElement("option");
        newOption.value = customCategory;
        newOption.innerText = customCategory;

        categoryDropdown.insertBefore(newOption, categoryDropdown.lastElementChild);
        
        categoryDropdown.value = customCategory;
      } else {
      
        categoryDropdown.value = "Salary"; 
      }
    }
  });

  // Display transactions in the list
  function displayTransactions(transactionsToShow) {
    transactionList.innerHTML = ""; 

    transactionsToShow.forEach((transaction) => {
      const transactionItem = document.createElement("div");
      transactionItem.classList.add("transaction-item");

      const transactionDate = document.createElement("span");
      transactionDate.innerText = transaction.date;

      const transactionCategory = document.createElement("span");
      transactionCategory.innerText = transaction.category;

      const transactionAmount = document.createElement("span");
      transactionAmount.innerText = `$${Math.abs(transaction.amount).toFixed(2)}`; // Display as positive
      transactionAmount.classList.add(
        "transaction-amount",
        transaction.type === "income" ? "transaction-income" : "transaction-expense"
      );

      transactionItem.append(transactionDate, transactionCategory, transactionAmount);
      transactionList.appendChild(transactionItem);
    });
  }

  // Handle form submission to add a transaction
  transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const notes = document.getElementById("notes").value;

    if (!amount || !date || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      amount,
      date,
      category,
      notes,
      type: amount > 0 ? "income" : "expense",
    };

    transactions.push(newTransaction);
    saveTransactions();
    transactionForm.reset();
    displayTransactions(transactions);
  });

  // Filter transactions by category
  filterCategory.addEventListener("change", () => {
    const selectedCategory = filterCategory.value;
    const filteredTransactions =
      selectedCategory === "all"
        ? transactions
        : transactions.filter(
            (transaction) =>
              transaction.type === selectedCategory || transaction.category === selectedCategory
          );

    displayTransactions(filteredTransactions);
  });

  // Sort transactions by amount
  window.sortByAmount = function () {
    transactions.sort((a, b) => a.amount - b.amount); // Sort 
    displayTransactions(transactions); 
  };

  // Initial display of transactions
  displayTransactions(transactions);
});
