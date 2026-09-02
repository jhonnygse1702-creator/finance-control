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
            categoriesContainer.innerHTML = "<p>Nenhuma categoria cadastrada.</p>";
            return;
        }

        categoriesContainer.innerHTML = "";

        categories.forEach((category) => {
            const categoryElement = document.createElement("div");

            categoryElement.innerHTML = `
                <strong>${category.name}</strong>
                <span> - ${category.type}</span>
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

loadCategories();