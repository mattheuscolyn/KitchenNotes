document.addEventListener("DOMContentLoaded", () => {
    let selectedRecipes = JSON.parse(localStorage.getItem("selectedRecipes")) || [];
    const recipeList = document.getElementById("selected-recipes");
    const groceryList = document.getElementById("grocery-list");

    const ingredientsMap = new Map();

    selectedRecipes.forEach((recipe, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = recipe.title;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove Recipe";
        removeButton.addEventListener("click", () => {
            selectedRecipes.splice(index, 1);
            localStorage.setItem("selectedRecipes", JSON.stringify(selectedRecipes));
            location.reload();
        });

        listItem.appendChild(removeButton);
        recipeList.appendChild(listItem);

        recipe.ingredients.forEach(({ name, quantity }) => {
            const { value, unit } = parseQuantity(quantity);
            const key = name; // Store only the ingredient name as the key
            const fullUnit = unit ? ` ${unit}` : ""; // Ensure unit formatting

            if (ingredientsMap.has(key)) {
                ingredientsMap.set(key, ingredientsMap.get(key) + value);
            } else {
                ingredientsMap.set(key, value);
            }

            // Store unit separately to avoid duplication issues
            if (!ingredientsMap.get(`${key}_unit`)) {
                ingredientsMap.set(`${key}_unit`, fullUnit);
            }
        });
    });

    ingredientsMap.forEach((total, key) => {
        if (!key.includes("_unit")) {
            const unit = ingredientsMap.get(`${key}_unit`) || "";
            const listItem = document.createElement("li");
            listItem.textContent = `${key} - ${formatQuantity(total)}${unit}`;
            groceryList.appendChild(listItem);
        }
    });
});

/**
 * Parses a quantity string like "1/2 cup" or "2 tbsp" into a numerical value and unit.
 */
function parseIngredientQuantity(quantity) {
    quantity = replaceUnicodeFractions(quantity);
    let match = quantity.match(/^(\d+)?(?:\s+(\d+\/\d+))?\s*([a-zA-Z]+)?/);
    
    if (match) {
        let whole = match[1] ? parseInt(match[1]) : 0;
        let fraction = match[2] ? eval(match[2]) : 0; // Convert fraction to decimal
        let unit = match[3] || "";

        let totalQuantity = whole + fraction;
        return { quantity: totalQuantity, unit: unit };
    }
    return null;
}

/**
 * Formats the total quantity into a readable string.
 */
function formatQuantity(value) {
    if (value % 1 === 0) return value; // Whole number
    if (value === 0.5) return "½";
    if (value === 0.25) return "¼";
    if (value === 0.75) return "¾";
    
    return value.toFixed(2); // Default to two decimal places for precision
}
