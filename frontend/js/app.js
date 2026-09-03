const CATEGORY_API_URL =
    "http://localhost:3000/api/categories";

const TRANSACTION_API_URL =
    "http://localhost:3000/api/transactions";

const DASHBOARD_API_URL =
    "http://localhost:3000/api/dashboard";

let allTransactions = [];

/* ================================
   TRADUZIR TIPO DA CATEGORIA
================================ */

function translateCategoryType(type) {

    if (type === "income") {
        return "Receita";
    }

    if (type === "expense") {
        return "Despesa";
    }

    return type;
}

/* ================================
   DASHBOARD
================================ */

function formatCurrency(value) {

    return Number(value).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

function getCurrentMonth() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    return `${year}-${month}`;
}

async function loadDashboard() {

    const monthInput =
        document.getElementById(
            "dashboardMonth"
        );

    const incomeElement =
        document.getElementById(
            "dashboardIncome"
        );

    const expenseElement =
        document.getElementById(
            "dashboardExpense"
        );

    const balanceElement =
        document.getElementById(
            "dashboardBalance"
        );

    if (
        !monthInput ||
        !incomeElement ||
        !expenseElement ||
        !balanceElement
    ) {
        return;
    }

    const month =
        monthInput.value;

    if (!month) {
        return;
    }

    try {

        const url =
            `${DASHBOARD_API_URL}?month=${month}`;

        const response =
            await fetch(url);

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Erro ao carregar o resumo financeiro."
            );
        }

        incomeElement.textContent =
            formatCurrency(
                data.total_income
            );

        expenseElement.textContent =
            formatCurrency(
                data.total_expense
            );

        balanceElement.textContent =
            formatCurrency(
                data.balance
            );

    } catch (error) {

        console.error(
            "Erro ao carregar Dashboard:",
            error
        );

        incomeElement.textContent =
            "R$ 0,00";

        expenseElement.textContent =
            "R$ 0,00";

        balanceElement.textContent =
            "R$ 0,00";

        alert(error.message);
    }
}

/* ================================
   CATEGORIAS
================================ */

async function loadCategories() {

    const categoriesContainer =
        document.getElementById(
            "categories"
        );

    const transactionCategory =
        document.getElementById(
            "transactionCategory"
        );

    try {

        const response =
            await fetch(
                CATEGORY_API_URL
            );

        if (!response.ok) {

            throw new Error(
                "Erro ao buscar categorias."
            );
        }

        const categories =
            await response.json();

        if (categories.length === 0) {

            categoriesContainer.innerHTML =
                "<p>Nenhuma categoria cadastrada.</p>";

        } else {

            categoriesContainer.innerHTML =
                "";

            categories.forEach(
                (category) => {

                    const categoryElement =
                        document.createElement(
                            "div"
                        );

                    const categoryName =
                        document.createElement(
                            "strong"
                        );

                    categoryName.textContent =
                        category.name;

                    const categoryType =
                        document.createElement(
                            "span"
                        );

                    categoryType.textContent =
                        translateCategoryType(
                            category.type
                        );

                    const editButton =
                        document.createElement(
                            "button"
                        );

                    editButton.textContent =
                        "Editar";

                    editButton.addEventListener(
                        "click",
                        () => {

                            editCategory(
                                category.id,
                                category.name,
                                category.type
                            );
                        }
                    );

                    const deleteButton =
                        document.createElement(
                            "button"
                        );

                    deleteButton.textContent =
                        "Excluir";

                    deleteButton.addEventListener(
                        "click",
                        () => {

                            deleteCategory(
                                category.id,
                                category.name
                            );
                        }
                    );

                    categoryElement.appendChild(
                        categoryName
                    );

                    categoryElement.appendChild(
                        categoryType
                    );

                    categoryElement.appendChild(
                        editButton
                    );

                    categoryElement.appendChild(
                        deleteButton
                    );

                    categoriesContainer.appendChild(
                        categoryElement
                    );
                }
            );
        }

        transactionCategory.innerHTML = `
            <option value="">
                Selecione a categoria
            </option>
        `;

        categories.forEach(
            (category) => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    category.id;

                option.textContent =
                    `${category.name} - ${translateCategoryType(category.type)}`;

                option.dataset.type =
                    category.type;

                transactionCategory.appendChild(
                    option
                );
            }
        );

    } catch (error) {

        console.error(error);

        categoriesContainer.innerHTML = `
            <p>
                Não foi possível carregar as categorias.
            </p>
        `;
    }
}

/* ================================
   CADASTRAR CATEGORIA
================================ */

async function createCategory(event) {

    event.preventDefault();

    const nameInput =
        document.getElementById(
            "categoryName"
        );

    const typeInput =
        document.getElementById(
            "categoryType"
        );

    const name =
        nameInput.value.trim();

    const type =
        typeInput.value;

    try {

        const response =
            await fetch(
                CATEGORY_API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        type
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Erro ao cadastrar categoria."
            );
        }

        alert(
            "Categoria cadastrada com sucesso!"
        );

        nameInput.value = "";

        typeInput.value = "";

        await loadCategories();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}

/* ================================
   EDITAR CATEGORIA
================================ */

async function editCategory(
    id,
    currentName,
    currentType
) {

    const newName =
        prompt(
            "Digite o novo nome da categoria:",
            currentName
        );

    if (newName === null) {
        return;
    }

    const name =
        newName.trim();

    if (name === "") {

        alert(
            "O nome da categoria é obrigatório."
        );

        return;
    }

    const newType =
        prompt(
            "Digite o novo tipo: income ou expense",
            currentType
        );

    if (newType === null) {
        return;
    }

    const type =
        newType.trim();

    if (
        !["income", "expense"].includes(type)
    ) {

        alert(
            "O tipo deve ser 'income' ou 'expense'."
        );

        return;
    }

    try {

        const response =
            await fetch(
                `${CATEGORY_API_URL}/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        type
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Erro ao atualizar categoria."
            );
        }

        alert(
            "Categoria atualizada com sucesso!"
        );

        resetTransactionSearch();

        await loadCategories();

        await loadTransactions();

        await loadDashboard();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}

/* ================================
   EXCLUIR CATEGORIA
================================ */

async function deleteCategory(
    id,
    name
) {

    const confirmation =
        confirm(
            `Tem certeza que deseja excluir a categoria "${name}"?`
        );

    if (!confirmation) {
        return;
    }

    try {

        const response =
            await fetch(
                `${CATEGORY_API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Erro ao excluir categoria."
            );
        }

        alert(
            "Categoria excluída com sucesso!"
        );

        resetTransactionSearch();

        await loadCategories();

        await loadTransactions();

        await loadDashboard();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}

/* ================================
   CADASTRAR TRANSAÇÃO
================================ */

async function createTransaction(event) {

    event.preventDefault();

    const typeInput =
        document.getElementById(
            "transactionType"
        );

    const categoryInput =
        document.getElementById(
            "transactionCategory"
        );

    const descriptionInput =
        document.getElementById(
            "transactionDescription"
        );

    const amountInput =
        document.getElementById(
            "transactionAmount"
        );

    const dateInput =
        document.getElementById(
            "transactionDate"
        );

    const notesInput =
        document.getElementById(
            "transactionNotes"
        );

    const type =
        typeInput.value;

    const categoryId =
        Number(
            categoryInput.value
        );

    const description =
        descriptionInput.value.trim();

    const amount =
        Number(
            amountInput.value
        );

    const transactionDate =
        dateInput.value;

    const notes =
        notesInput.value.trim();

    if (!type) {

        alert(
            "Selecione o tipo da transação."
        );

        return;
    }

    if (!categoryId) {

        alert(
            "Selecione uma categoria."
        );

        return;
    }

    if (!description) {

        alert(
            "Informe a descrição."
        );

        return;
    }

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Informe um valor maior que zero."
        );

        return;
    }

    if (!transactionDate) {

        alert(
            "Informe a data da transação."
        );

        return;
    }

    const selectedCategory =
        categoryInput.options[
            categoryInput.selectedIndex
        ];

    const categoryType =
        selectedCategory.dataset.type;

    if (categoryType !== type) {

        alert(
            "O tipo da transação deve ser igual ao tipo da categoria."
        );

        return;
    }

    try {

        const response =
            await fetch(
                TRANSACTION_API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        userId: 1,
                        categoryId,
                        description,
                        amount,
                        type,
                        transactionDate,
                        notes
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Erro ao cadastrar transação."
            );
        }

        alert(
            "Transação cadastrada com sucesso!"
        );

        typeInput.value = "";

        categoryInput.value = "";

        descriptionInput.value = "";

        amountInput.value = "";

        dateInput.value = "";

        notesInput.value = "";

        resetTransactionSearch();

        await loadTransactions();

        await loadDashboard();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}

/* ================================
   EDITAR TRANSAÇÃO
================================ */

async function editTransaction(
    transaction
) {

    const newDescription =
        prompt(
            "Descrição da transação:",
            transaction.description
        );

    if (newDescription === null) {
        return;
    }

    const description =
        newDescription.trim();

    if (!description) {

        alert(
            "A descrição é obrigatória."
        );

        return;
    }

    const newAmount =
        prompt(
            "Valor da transação:",
            transaction.amount
        );

    if (newAmount === null) {
        return;
    }

    const amount =
        Number(
            newAmount.replace(",", ".")
        );

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "O valor deve ser maior que zero."
        );

        return;
    }

    const newDate =
        prompt(
            "Data da transação (YYYY-MM-DD):",
            transaction.transaction_date
        );

    if (newDate === null) {
        return;
    }

    const transactionDate =
        newDate.trim();

    if (!transactionDate) {

        alert(
            "A data da transação é obrigatória."
        );

        return;
    }

    const newNotes =
        prompt(
            "Observação:",
            transaction.notes || ""
        );

    if (newNotes === null) {
        return;
    }

    const notes =
        newNotes.trim();

    try {

        const response =
            await fetch(
                `${TRANSACTION_API_URL}/${transaction.id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        categoryId:
                            transaction.category_id,

                        description,

                        amount,

                        type:
                            transaction.type,

                        transactionDate,

                        notes
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Erro ao atualizar transação."
            );
        }

        alert(
            "Transação atualizada com sucesso!"
        );

        resetTransactionSearch();

        await loadTransactions();

        await loadDashboard();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}

/* ================================
   EXCLUIR TRANSAÇÃO
================================ */

async function deleteTransaction(
    id,
    description
) {

    const confirmation =
        confirm(
            `Tem certeza que deseja excluir a transação "${description}"?`
        );

    if (!confirmation) {
        return;
    }

    try {

        const response =
            await fetch(
                `${TRANSACTION_API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Erro ao excluir transação."
            );
        }

        alert(
            "Transação excluída com sucesso!"
        );

        resetTransactionSearch();

        await loadTransactions();

        await loadDashboard();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}

/* ================================
   RENDERIZAR TRANSAÇÕES
================================ */

function renderTransactions(
    transactions
) {

    const transactionsContainer =
        document.getElementById(
            "transactions"
        );

    if (!transactionsContainer) {
        return;
    }

    transactionsContainer.innerHTML =
        "";

    if (transactions.length === 0) {

        transactionsContainer.innerHTML = `
            <p>
                Nenhuma transação encontrada.
            </p>
        `;

        return;
    }

    transactions.forEach(
        (transaction) => {

            const transactionElement =
                document.createElement(
                    "div"
                );

            const description =
                document.createElement(
                    "strong"
                );

            description.textContent =
                transaction.description;

            const amount =
                document.createElement(
                    "strong"
                );

            amount.textContent =
                formatCurrency(
                    transaction.amount
                );

            const editButton =
                document.createElement(
                    "button"
                );

            editButton.textContent =
                "Editar";

            editButton.addEventListener(
                "click",
                () => {

                    editTransaction(
                        transaction
                    );
                }
            );

            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.textContent =
                "Excluir";

            deleteButton.addEventListener(
                "click",
                () => {

                    deleteTransaction(
                        transaction.id,
                        transaction.description
                    );
                }
            );

            transactionElement.appendChild(
                description
            );

            transactionElement.appendChild(
                amount
            );

            transactionElement.appendChild(
                editButton
            );

            transactionElement.appendChild(
                deleteButton
            );

            transactionsContainer.appendChild(
                transactionElement
            );
        }
    );
}

/* ================================
   LISTAR TRANSAÇÕES
================================ */

async function loadTransactions() {

    try {

        const response =
            await fetch(
                TRANSACTION_API_URL
            );

        if (!response.ok) {

            throw new Error(
                "Erro ao buscar transações."
            );
        }

        const transactions =
            await response.json();

        allTransactions =
            transactions;

        renderTransactions(
            allTransactions
        );

    } catch (error) {

        console.error(error);

        const transactionsContainer =
            document.getElementById(
                "transactions"
            );

        if (transactionsContainer) {

            transactionsContainer.innerHTML = `
                <p>
                    Não foi possível carregar as transações.
                </p>
            `;
        }
    }
}

/* ================================
   PESQUISA DE TRANSAÇÕES
================================ */

function searchTransactions(
    keyword
) {

    const normalizedKeyword =
        String(keyword || "")
            .toLowerCase();

    if (!normalizedKeyword) {

        renderTransactions(
            allTransactions
        );

        return;
    }

    const filteredTransactions =
        allTransactions.filter(
            (transaction) => {

                const description =
                    String(
                        transaction.description || ""
                    ).toLowerCase();

                return description.includes(
                    normalizedKeyword
                );
            }
        );

    renderTransactions(
        filteredTransactions
    );
}

/* ================================
   LIMPAR PESQUISA
================================ */

function resetTransactionSearch() {

    const transactionSearch =
        document.getElementById(
            "transactionSearchInput"
        );

    if (transactionSearch) {

        transactionSearch.value = "";
    }

    renderTransactions(
        allTransactions
    );
}

/* ================================
   INICIALIZAÇÃO
================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* ----------------------------
           FORMULÁRIO DE CATEGORIA
        ----------------------------- */

        const categoryForm =
            document.getElementById(
                "categoryForm"
            );

        if (categoryForm) {

            categoryForm.addEventListener(
                "submit",
                createCategory
            );
        }

        /* ----------------------------
           FORMULÁRIO DE TRANSAÇÃO
        ----------------------------- */

        const transactionForm =
            document.getElementById(
                "transactionForm"
            );

        if (transactionForm) {

            transactionForm.addEventListener(
                "submit",
                createTransaction
            );
        }

        /* ----------------------------
           DASHBOARD
        ----------------------------- */

        const dashboardMonth =
            document.getElementById(
                "dashboardMonth"
            );

        if (dashboardMonth) {

            dashboardMonth.value =
                getCurrentMonth();

            dashboardMonth.addEventListener(
                "change",
                loadDashboard
            );
        }

        /* ----------------------------
           PESQUISA
        ----------------------------- */

        const transactionSearch =
            document.getElementById(
                "transactionSearchInput"
            );

        const searchButton =
            document.getElementById(
                "searchTransactionsButton"
            );

        const clearSearchButton =
            document.getElementById(
                "clearTransactionSearchButton"
            );

        if (transactionSearch) {

            transactionSearch.addEventListener(
                "input",
                (event) => {

                    searchTransactions(
                        event.target.value
                    );
                }
            );
        }

        if (searchButton) {

            searchButton.addEventListener(
                "click",
                () => {

                    searchTransactions(
                        transactionSearch
                            ? transactionSearch.value
                            : ""
                    );
                }
            );
        }

        if (clearSearchButton) {

            clearSearchButton.addEventListener(
                "click",
                () => {

                    resetTransactionSearch();
                }
            );
        }

        /* ----------------------------
           CARREGAMENTO INICIAL
        ----------------------------- */

        loadCategories();

        loadTransactions();

        loadDashboard();
    }
);