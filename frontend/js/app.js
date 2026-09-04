const AUTH_API_URL =
    "http://localhost:3000/api/auth";

const CATEGORY_API_URL =
    "http://localhost:3000/api/categories";

const TRANSACTION_API_URL =
    "http://localhost:3000/api/transactions";

const DASHBOARD_API_URL =
    "http://localhost:3000/api/dashboard";

const TOKEN_STORAGE_KEY =
    "financecontrol_token";

let allTransactions = [];

let allCategories = [];


/* ================================
   AUTENTICAÇÃO
================================ */

function getToken() {

    return localStorage.getItem(
        TOKEN_STORAGE_KEY
    );
}


function saveToken(token) {

    localStorage.setItem(
        TOKEN_STORAGE_KEY,
        token
    );
}


function removeToken() {

    localStorage.removeItem(
        TOKEN_STORAGE_KEY
    );
}


function showLoginScreen() {

    const loginScreen =
        document.getElementById(
            "loginScreen"
        );

    const appContent =
        document.getElementById(
            "appContent"
        );

    if (loginScreen) {
        loginScreen.classList.remove("hidden");
    }

    if (appContent) {
        appContent.classList.add("hidden");
    }
}


function showAppContent() {

    const loginScreen =
        document.getElementById(
            "loginScreen"
        );

    const appContent =
        document.getElementById(
            "appContent"
        );

    if (loginScreen) {
        loginScreen.classList.add("hidden");
    }

    if (appContent) {
        appContent.classList.remove("hidden");
    }
}


function handleUnauthorized() {

    removeToken();

    showLoginScreen();

    const loginMessage =
        document.getElementById(
            "loginMessage"
        );

    if (loginMessage) {

        loginMessage.textContent =
            "Sua sessão expirou. Faça login novamente.";

        loginMessage.style.color =
            "red";
    }
}


async function authenticatedFetch(
    url,
    options = {}
) {

    const token =
        getToken();

    const headers = {
        ...(options.headers || {})
    };

    if (token) {

        headers.Authorization =
            `Bearer ${token}`;
    }

    const response =
        await fetch(
            url,
            {
                ...options,
                headers
            }
        );

    if (response.status === 401) {

        handleUnauthorized();

        throw new Error(
            "Sua sessão expirou. Faça login novamente."
        );
    }

    return response;
}


/* ================================
   LOGIN
================================ */

async function login(event) {

    event.preventDefault();

    const emailInput =
        document.getElementById(
            "loginEmail"
        );

    const passwordInput =
        document.getElementById(
            "loginPassword"
        );

    const loginMessage =
        document.getElementById(
            "loginMessage"
        );

    if (
        !emailInput ||
        !passwordInput
    ) {
        return;
    }

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    if (!email) {

        if (loginMessage) {

            loginMessage.textContent =
                "Informe o e-mail.";

            loginMessage.style.color =
                "red";
        }

        return;
    }

    if (!password) {

        if (loginMessage) {

            loginMessage.textContent =
                "Informe a senha.";

            loginMessage.style.color =
                "red";
        }

        return;
    }

    if (loginMessage) {

        loginMessage.textContent =
            "Entrando...";

        loginMessage.style.color =
            "";
    }

    try {

        const response =
            await fetch(
                `${AUTH_API_URL}/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Não foi possível realizar o login."
            );
        }

        if (!data.token) {

            throw new Error(
                "O servidor não retornou um token de autenticação."
            );
        }

        saveToken(
            data.token
        );

        if (loginMessage) {

            loginMessage.textContent =
                "";
        }

        emailInput.value = "";

        passwordInput.value = "";

        showAppContent();

        await initializeAuthenticatedApp();

    } catch (error) {

        console.error(
            "Erro no login:",
            error
        );

        if (loginMessage) {

            loginMessage.textContent =
                error.message;

            loginMessage.style.color =
                "red";
        }
    }
}


function logout() {

    removeToken();

    allTransactions = [];

    allCategories = [];

    showLoginScreen();

    const loginEmail =
        document.getElementById(
            "loginEmail"
        );

    const loginPassword =
        document.getElementById(
            "loginPassword"
        );

    const loginMessage =
        document.getElementById(
            "loginMessage"
        );

    if (loginEmail) {
        loginEmail.value = "";
    }

    if (loginPassword) {
        loginPassword.value = "";
    }

    if (loginMessage) {
        loginMessage.textContent = "";
    }

    closeCategoriesPanel();
}


/* ================================
   VALIDAR SESSÃO
================================ */

async function validateSession() {

    const token =
        getToken();

    if (!token) {

        showLoginScreen();

        return false;
    }

    try {

        const response =
            await authenticatedFetch(
                `${AUTH_API_URL}/me`
            );

        if (!response.ok) {

            throw new Error(
                "Sessão inválida."
            );
        }

        return true;

    } catch (error) {

        console.error(
            "Erro ao validar sessão:",
            error
        );

        removeToken();

        showLoginScreen();

        return false;
    }
}


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
            await authenticatedFetch(
                url
            );

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

        if (
            error.message.includes(
                "sessão"
            )
        ) {
            return;
        }

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
   CATEGORIAS - RENDERIZAR
================================ */

function renderCategories(
    categories
) {

    const categoriesContainer =
        document.getElementById(
            "categories"
        );

    if (!categoriesContainer) {
        return;
    }

    if (categories.length === 0) {

        categoriesContainer.innerHTML =
            "<p>Nenhuma categoria encontrada.</p>";

        return;
    }

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


/* ================================
   CATEGORIAS - CARREGAR
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

    if (
        !categoriesContainer ||
        !transactionCategory
    ) {
        return;
    }

    try {

        const response =
            await authenticatedFetch(
                CATEGORY_API_URL
            );

        const categories =
            await response.json();

        if (!response.ok) {

            throw new Error(
                categories.error ||
                "Erro ao buscar categorias."
            );
        }

        allCategories =
            categories;

        resetCategorySearch();

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

        console.error(
            "Erro ao carregar categorias:",
            error
        );

        if (
            error.message.includes(
                "sessão"
            )
        ) {
            return;
        }

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

    if (
        !nameInput ||
        !typeInput
    ) {
        return;
    }

    const name =
        nameInput.value.trim();

    const type =
        typeInput.value;

    if (!name) {

        alert(
            "O nome da categoria é obrigatório."
        );

        return;
    }

    if (
        !["income", "expense"].includes(type)
    ) {

        alert(
            "Selecione um tipo válido."
        );

        return;
    }

    try {

        const response =
            await authenticatedFetch(
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

        console.error(
            "Erro ao cadastrar categoria:",
            error
        );

        if (
            error.message.includes(
                "sessão"
            )
        ) {
            return;
        }

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
            await authenticatedFetch(
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

        console.error(
            "Erro ao atualizar categoria:",
            error
        );

        if (
            error.message.includes(
                "sessão"
            )
        ) {
            return;
        }

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
            await authenticatedFetch(
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

        console.error(
            "Erro ao excluir categoria:",
            error
        );

        if (
            error.message.includes(
                "sessão"
            )
        ) {
            return;
        }

        alert(error.message);
    }
}


/* ================================
   PESQUISA DE CATEGORIAS
================================ */

function searchCategories(
    keyword
) {

    const normalizedKeyword =
        String(keyword || "")
            .toLowerCase();

    if (!normalizedKeyword) {

        renderCategories(
            allCategories
        );

        return;
    }

    const filteredCategories =
        allCategories.filter(
            (category) => {

                const name =
                    String(
                        category.name || ""
                    ).toLowerCase();

                return name.includes(
                    normalizedKeyword
                );
            }
        );

    renderCategories(
        filteredCategories
    );
}


function resetCategorySearch() {

    const categorySearchInput =
        document.getElementById(
            "categorySearchInput"
        );

    if (categorySearchInput) {

        categorySearchInput.value = "";
    }

    renderCategories(
        allCategories
    );
}


/* ================================
   PAINEL DE CATEGORIAS (MODAL)
================================ */

function openCategoriesPanel() {

    const categoriesPanelOverlay =
        document.getElementById(
            "categoriesPanelOverlay"
        );

    const categorySearchInput =
        document.getElementById(
            "categorySearchInput"
        );

    if (categoriesPanelOverlay) {

        categoriesPanelOverlay.classList.remove(
            "hidden"
        );
    }

    resetCategorySearch();

    if (categorySearchInput) {

        categorySearchInput.focus();
    }
}


function closeCategoriesPanel() {

    const categoriesPanelOverlay =
        document.getElementById(
            "categoriesPanelOverlay"
        );

    if (categoriesPanelOverlay) {

        categoriesPanelOverlay.classList.add(
            "hidden"
        );
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

    if (
        !typeInput ||
        !categoryInput ||
        !descriptionInput ||
        !amountInput ||
        !dateInput ||
        !notesInput
    ) {
        return;
    }

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
            await authenticatedFetch(
                TRANSACTION_API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
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

        console.error(
            "Erro ao cadastrar transação:",
            error
        );

        if (
            error.message.includes(
                "sessão"
            )
        ) {
            return;
        }

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
            await authenticatedFetch(
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

        console.error(
            "Erro ao atualizar transação:",
            error
        );

        if (
            error.message.includes(
                "sessão"
            )
        ) {
            return;
        }

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
            await authenticatedFetch(
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

        console.error(
            "Erro ao excluir transação:",
            error
        );

        if (
            error.message.includes(
                "sessão"
            )
        ) {
            return;
        }

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
            await authenticatedFetch(
                TRANSACTION_API_URL
            );

        const transactions =
            await response.json();

        if (!response.ok) {

            throw new Error(
                transactions.error ||
                "Erro ao buscar transações."
            );
        }

        allTransactions =
            transactions;

        renderTransactions(
            allTransactions
        );

    } catch (error) {

        console.error(
            "Erro ao carregar transações:",
            error
        );

        if (
            error.message.includes(
                "sessão"
            )
        ) {
            return;
        }

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
   INICIALIZAR SISTEMA AUTENTICADO
================================ */

async function initializeAuthenticatedApp() {

    const dashboardMonth =
        document.getElementById(
            "dashboardMonth"
        );

    if (dashboardMonth) {

        if (!dashboardMonth.value) {

            dashboardMonth.value =
                getCurrentMonth();
        }
    }

    await loadCategories();

    await loadTransactions();

    await loadDashboard();
}


/* ================================
   INICIALIZAÇÃO
================================ */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /* ----------------------------
           FORMULÁRIO DE LOGIN
        ----------------------------- */

        const loginForm =
            document.getElementById(
                "loginForm"
            );

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                login
            );
        }


        /* ----------------------------
           BOTÃO SAIR
        ----------------------------- */

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logout
            );
        }


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
           PAINEL DE CATEGORIAS
        ----------------------------- */

        const openCategoriesPanelButton =
            document.getElementById(
                "openCategoriesPanelButton"
            );

        const closeCategoriesPanelButton =
            document.getElementById(
                "closeCategoriesPanelButton"
            );

        const categoriesPanelOverlay =
            document.getElementById(
                "categoriesPanelOverlay"
            );

        const categorySearchInput =
            document.getElementById(
                "categorySearchInput"
            );

        if (openCategoriesPanelButton) {

            openCategoriesPanelButton.addEventListener(
                "click",
                openCategoriesPanel
            );
        }

        if (closeCategoriesPanelButton) {

            closeCategoriesPanelButton.addEventListener(
                "click",
                closeCategoriesPanel
            );
        }

        if (categoriesPanelOverlay) {

            categoriesPanelOverlay.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target ===
                        categoriesPanelOverlay
                    ) {

                        closeCategoriesPanel();
                    }
                }
            );
        }

        if (categorySearchInput) {

            categorySearchInput.addEventListener(
                "input",
                (event) => {

                    searchCategories(
                        event.target.value
                    );
                }
            );
        }

        document.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Escape") {

                    closeCategoriesPanel();
                }
            }
        );


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
           PESQUISA DE TRANSAÇÕES
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
           VERIFICAR SESSÃO
        ----------------------------- */

        const authenticated =
            await validateSession();

        if (authenticated) {

            showAppContent();

            await initializeAuthenticatedApp();

        } else {

            showLoginScreen();
        }
    }
);