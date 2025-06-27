// Populate the area dropdown when the page loads
window.addEventListener("DOMContentLoaded", function () {
  const areaSelect = document.getElementById("area-select");
  areaSelect.innerHTML = '<option value="">Select Area</option>';

  fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    .then((response) => response.json())
    .then((data) => {
      if (data.meals) {
        data.meals.forEach((areaObj) => {
          const option = document.createElement("option");
          option.value = areaObj.strArea;
          option.textContent = areaObj.strArea;
          areaSelect.appendChild(option);
        });
      }
    });
});

// When the user selects an area, fetch and display meals for that area
document.getElementById("area-select").addEventListener("change", function () {
  const area = this.value;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  if (!area) return;

  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
      area
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.meals) {
        data.meals.forEach((meal) => {
          const mealDiv = document.createElement("div");
          mealDiv.className = "meal";

          const title = document.createElement("h3");
          title.textContent = meal.strMeal;

          const img = document.createElement("img");
          img.src = meal.strMealThumb;
          img.alt = meal.strMeal;

          mealDiv.appendChild(title);
          mealDiv.appendChild(img);
          resultsDiv.appendChild(mealDiv);

          // Add a click event to fetch and log detailed info about the recipe
          mealDiv.addEventListener("click", async function () {
            // Fetch detailed info using the meal ID
            try {
              const response = await fetch(
                `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
              );
              const detailData = await response.json();
              // Get the first meal object from the response
              const mealDetails = detailData.meals[0];

              // Build a list of ingredients
              let ingredientsList = "<ul>";
              for (let i = 1; i <= 20; i++) {
                const ingredient = mealDetails[`strIngredient${i}`];
                const measure = mealDetails[`strMeasure${i}`];
                if (ingredient && ingredient.trim() !== "") {
                  ingredientsList += `<li>${ingredient} - ${measure}</li>`;
                }
              }
              ingredientsList += "</ul>";

              // Set the modal body to show the ingredients
              const modalBody = document.querySelector(
                "#infoModal .modal-body"
              );
              modalBody.innerHTML = `<strong>Ingredients:</strong> ${ingredientsList}`;

              // Show the modal using Bootstrap's jQuery method
              $("#infoModal").modal("show");
            } catch (error) {
              console.error("Error fetching recipe details:", error);
            }
          });
        });
      } else {
        resultsDiv.textContent = "No meals found for this area.";
      }
    });
});
