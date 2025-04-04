document.addEventListener("DOMContentLoaded", () => {
  setupMenuToggle();
  setupRecipeListMenu();
  loadRecipesOnHomepage();
  loadRecipeDetails();
  handleSearchPage();
});

// Toggles mobile side menu
function setupMenuToggle() {
  const menuToggle = document.getElementById("menu-toggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      document.getElementById("side-menu").classList.toggle("-translate-x-full");
    });
  }
}

// Sets up recipe list menu functionality
function setupRecipeListMenu() {
  const sideMenu = document.getElementById("side-menu");
  const recipeListMenu = document.getElementById("recipe-list-menu");
  const recipesButton = document.getElementById("recipes-button");
  const backButton = document.getElementById("back-button");
  const recipeList = document.getElementById("recipe-list");

  if (recipesButton && backButton) {
    recipesButton.addEventListener("click", async () => {
      sideMenu.classList.add("-translate-x-full");
      recipeListMenu.classList.remove("-translate-x-full");

      try {
        const recipes = await fetchRecipes();
        recipeList.innerHTML = "";
        recipes.forEach((recipe) => {
          const li = document.createElement("li");
          li.innerHTML = `<a href="recipe.html?id=${encodeURIComponent(recipe.title)}">${recipe.title}</a>`;
          recipeList.appendChild(li);
        });
      } catch (error) {
        console.error("Error loading recipes:", error);
      }
    });

    backButton.addEventListener("click", () => {
      recipeListMenu.classList.add("-translate-x-full");
      sideMenu.classList.remove("-translate-x-full");
    });
  }
}

// Fetches recipes from JSON file
async function fetchRecipes() {
  try {
    const response = await fetch("recipes.json");
    return await response.json();
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

// Loads recipes dynamically on the homepage
async function loadRecipesOnHomepage() {
  const recipesContainer = document.getElementById("recipes");
  if (!recipesContainer) return;

  try {
    const recipes = await fetchRecipes();
    recipes.forEach((recipe) => {
      const recipeCard = document.createElement("div");
      recipeCard.classList.add("bg-white", "p-4", "rounded-lg", "shadow-lg", "cursor-pointer");
      recipeCard.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}" class="w-full h-48 object-cover rounded-t-lg">
        <h3 class="font-bold mt-2">${recipe.title}</h3>
        <p class="text-sm">${recipe.description}</p>
        <div class="flex items-center space-x-2 mt-2">
          <span class="text-yellow-500">&#9733; ${recipe.rating}</span>
        </div>
      `;
      recipeCard.addEventListener("click", () => {
        window.location.href = `recipe.html?id=${encodeURIComponent(recipe.title)}`;
      });
      recipesContainer.appendChild(recipeCard);
    });
  } catch (error) {
    console.error("Error loading recipes on homepage:", error);
  }
}

// Loads details for a specific recipe on recipe.html
async function loadRecipeDetails() {
  const params = new URLSearchParams(window.location.search);
  const recipeTitle = params.get("id");
  if (!recipeTitle) return;

  try {
    const recipes = await fetchRecipes();
    const recipe = recipes.find((r) => r.title === recipeTitle);

    if (recipe) {
      document.getElementById("recipe-title").textContent = recipe.title;
      document.getElementById("recipe-image").src = recipe.image;
      document.getElementById("recipe-description").textContent = recipe.description;
      document.getElementById("total-time").textContent = recipe.total_time;
      document.getElementById("yield").textContent = recipe.yield;

      populateList("ingredient-list", recipe.ingredients, formatIngredient);
      populateList("instruction-list", recipe.instructions);
    } else {
      document.getElementById("recipe-detail").innerHTML = `<p class="text-red-500">Recipe not found.</p>`;
    }
  } catch (error) {
    console.error("Error loading recipe details:", error);
  }
}

// Formats ingredient text properly
function formatIngredient(ingredient) {
  const { quantity, unit, name, preparation } = ingredient;
  let result = `${quantity ? quantity + " " : ""}${unit ? unit + " " : ""}${name}`;
  return preparation ? `${result}, ${preparation}` : result;
}

// Populates a list (ingredients or instructions)
function populateList(elementId, items, formatFn = (x) => x) {
  const list = document.getElementById(elementId);
  if (!list) return;
  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = formatFn(item);
    list.appendChild(li);
  });
}

document.getElementById("search").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
      const query = event.target.value.trim();
      if (query) {
          // Navigate to search results page with query parameter
          window.location.href = `search.html?q=${encodeURIComponent(query)}`;
      }
  }
});

// Handles search page functionality
function handleSearchPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q");

  if (query) {
    document.getElementById("search-query").textContent = query; // Show search term

    fetchRecipes().then((recipes) => {
      const filteredRecipes = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(query.toLowerCase())
      );
      displaySearchResults(filteredRecipes);
    });
  }
}

// Displays filtered recipes on the search page
function displaySearchResults(filteredRecipes) {
  const resultsContainer = document.getElementById("search-results");
  if (!resultsContainer) return;

  resultsContainer.innerHTML = ""; // Clear previous results

  if (filteredRecipes.length === 0) {
    resultsContainer.innerHTML = "<p>No recipes found.</p>";
  } else {
    filteredRecipes.forEach((recipe) => {
      const recipeCard = document.createElement("div");
      recipeCard.classList.add("bg-white", "p-4", "rounded-lg", "shadow-lg", "cursor-pointer");

      recipeCard.innerHTML = `
        <img src="/${recipe.image}" alt="${recipe.title}" class="w-full h-48 object-cover rounded-t-lg">
        <h3 class="font-bold mt-2">${recipe.title}</h3>
        <p class="text-sm">${recipe.description}</p>
        <div class="flex items-center space-x-2 mt-2">
          <span class="text-yellow-500">&#9733; ${recipe.rating}</span>
        </div>
      `;

      recipeCard.addEventListener("click", () => {
        window.location.href = `recipe.html?id=${encodeURIComponent(recipe.title)}`;
      });

      resultsContainer.appendChild(recipeCard);
    });
  }
}
