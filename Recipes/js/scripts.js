document.addEventListener("DOMContentLoaded", () => {
    fetch("recipes.json")
        .then(response => response.json())
        .then(data => loadRecipes(data))
        .catch(error => console.error("Error loading recipes:", error));

    document.getElementById("view-grocery-list").addEventListener("click", () => {
        window.location.href = "grocery.html";
    });
});

function loadRecipes(recipes) {
    const recipeList = document.getElementById("recipe-list");
    recipes.forEach(recipe => {
        const item = document.createElement("div");
        item.classList.add("recipe-item");
        item.innerHTML = `<h3>${recipe.title}</h3><button onclick='addToGroceryList(${JSON.stringify(recipe)})'>Add to Grocery List</button>`;
        item.addEventListener("click", () => showRecipeDetails(recipe));
        recipeList.appendChild(item);
    });
}

function showRecipeDetails(recipe) {
    const recipeDetails = document.getElementById("recipe-details");
    recipeDetails.innerHTML = `<h2>${recipe.title}</h2>`;

    const ingredientsList = document.createElement("ul");
    recipe.ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        let ingredientText = `${ingredient.quantity} ${ingredient.unit || ""} ${ingredient.name}`;
        
        if (ingredient.preparation) {
            ingredientText += `, ${ingredient.preparation}`;
        }

        li.textContent = ingredientText;
        ingredientsList.appendChild(li);
    });

    const instructionsList = document.createElement("ol");
    recipe.instructions.forEach((step, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${step}`;
        instructionsList.appendChild(li);
    });

    recipeDetails.appendChild(ingredientsList);
    recipeDetails.appendChild(instructionsList);
    recipeDetails.classList.remove("hidden");
}


function addToGroceryList(recipe) {
    let selectedRecipes = JSON.parse(localStorage.getItem("selectedRecipes")) || [];
    selectedRecipes.push(recipe);
    localStorage.setItem("selectedRecipes", JSON.stringify(selectedRecipes));
    document.getElementById("view-grocery-list").classList.remove("hidden");
}
