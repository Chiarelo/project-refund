const amount = document.getElementById("amount");
const form = document.querySelector("form");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

const list = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p span");
const expenseTotal = document.querySelector("aside header h2");

amount.oninput = () => {
  value = amount.value.replace(/\D/g, "");

  value = Number(value) / 100;
  amount.value = formatCurrencyBrl(value);
};

formatCurrencyBrl = (value) => {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  console.log("chegou aqui");
  return value;
};

form.onsubmit = (event) => {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_At: new Date(),
  };

  expenseAdd(newExpense);
  console.log(newExpense);
};

expenseAdd = (newExpense) => {
  try {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    //logica do img
    const iconCategory = document.createElement("img");
    iconCategory.setAttribute("src", `./img/${newExpense.category_id}.svg`);
    iconCategory.setAttribute("alt", newExpense.category_name);
    console.log(newExpense.category_id);

    // cria a info da despesa
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    // Cria o nome da despesa
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    // Cria a categoria da despesa
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    // Cria o valor da despesa
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    // Cria o icone de delete
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "./img/remove.svg");
    removeIcon.setAttribute("alt", "Remover despesa");

    // adiciona nome e categoria da despesa na div
    expenseInfo.append(expenseName, expenseCategory);

    // adiciona as informaçoes no item
    expenseItem.append(iconCategory, expenseInfo, expenseAmount, removeIcon);

    // Junta as informações da despesa a lista
    list.appendChild(expenseItem);

    console.log(expenseItem, expenseInfo);

    // Atualiza a quantidade de despesas
    updateTotals();

    amount.value = "";
    expense.value = "";
    category.value = "";

    expense.focus();
  } catch (error) {
    console.log("Error creating expense:", error);
    alert("Ocorreu um erro ao criar a despesa. Tente novamente mais tarde.");
  }
};

function updateTotals() {
  try {
    let items = list.children;
    console.log(items.length);
    expensesQuantity.innerHTML = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    let total = 0;
    for (let item = 0; item < items.length; item++) {
      let itemAmount = items[item].querySelector(".expense-amount");

      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      value = parseFloat(value);

      if (isNaN(value)) {
        return alert(
          "Ocorreu um erro ao calcular o total. Tente novamente mais tarde."
        );
      }

      total += Number(value);
    }
    let simbolBRL = document.createElement("small");
    simbolBRL.innerHTML = "R$";

    total = formatCurrencyBrl(total).toUpperCase().replace("R$", "");
    expenseTotal.innerHTML = "";
    expenseTotal.append(simbolBRL, total);
  } catch (error) {
    console.log("Ocorreu um erro ao atualizar os totais:", error);
    alert(
      "Ocorreu um erro ao atualizar os totais. Tente novamente mais tarde."
    );
  }
}

list.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-icon")) {
    event.target.closest(".expense").remove();
    updateTotals();
  }
});
