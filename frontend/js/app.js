const API_URL = "http://localhost:3000/api/categories";

async function loadCategories() {
    const categoriesContainer = document.getElementById("categories");

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Erro ao buscar categorias.");
        }

        const categories = await response.json();

        if (categories.length === 0) {
            categoriesContainer.innerHTML =
                "<p>Nenhuma categoria cadastrada.</p>";

            return;
        }

        categoriesContainer.innerHTML = "";

        categories.forEach((category) => {
            const categoryElement = document.createElement("div");

            categoryElement.innerHTML = `
                <strong>${category.name}</strong>
                <span> - ${category.type}</span>

                <button onclick="editCategory(${category.id}, '${category.name}', '${category.type}')">
                    Editar
                </button>

                <button onclick="deleteCategory(${category.id}, '${category.name}')">
                    Excluir
                </button>
            `;

            categoriesContainer.appendChild(categoryElement);
        });

    } catch (error) {
        console.error(error);

        categoriesContainer.innerHTML = `
            <p>Não foi possível carregar as categorias.</p>
        `;
    }
}

async function createCategory(event) {
    event.preventDefault();

    const nameInput = document.getElementById("categoryName");
    const typeInput = document.getElementById("categoryType");

    const name = nameInput.value.trim();
    const type = typeInput.value;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                type
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Erro ao cadastrar categoria.");
        }

        alert("Categoria cadastrada com sucesso!");

        nameInput.value = "";
        typeInput.value = "";

        await loadCategories();

    } catch (error) {
        console.error(error);

        alert(error.message);
    }
}

async function editCategory(id, currentName, currentType) {
    const newName = prompt(
        "Digite o novo nome da categoria:",
        currentName
    );

    if (newName === null) {
        return;
    }

    const name = newName.trim();

    if (name === "") {
        alert("O nome da categoria é obrigatório.");
        return;
    }

    const newType = prompt(
        "Digite o novo tipo: income ou expense",
        currentType
    );

    if (newType === null) {
        return;
    }

    const type = newType.trim();

    if (!["income", "expense"].includes(type)) {
        alert("O tipo deve ser 'income' ou 'expense'.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                type
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Erro ao atualizar categoria.");
        }

        alert("Categoria atualizada com sucesso!");

        await loadCategories();

    } catch (error) {
        console.error(error);

        alert(error.message);
    }
}

async function deleteCategory(id, name) {
    const confirmation = confirm(
        `Tem certeza que deseja excluir a categoria "${name}"?`
    );

    if (!confirmation) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Erro ao excluir categoria.");
        }

        alert("Categoria excluída com sucesso!");

        await loadCategories();

    } catch (error) {
        console.error(error);

        alert(error.message);
    }
}

const categoryForm = document.getElementById("categoryForm");

categoryForm.addEventListener("submit", createCategory);

loadCategories();