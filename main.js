//Storing elements into variables

const searchInput = document.getElementById('searchInput')
const searchButton = document.getElementById('searchButton')
const mealList = document.getElementById('mealList')
const modalContainer = document.querySelector('.modal-container')
const mealDetailsContent = document.querySelector('.meal-details-content')
const recipeCloseBtn = document.getElementById('recipeCloseBtn')

// Event Listeners

searchButton.addEventListener('click', async () => {
    performSearch()
})

recipeCloseBtn.addEventListener('click', closeRecipeModal)

mealList.addEventListener('click', async (e) => {
    const card = e.target.closest('.meal-item')
    if(card) {
        const mealId = card.dataset.id
        const meal = await getMealDetails(mealId)
        if(meal) {
            showMealDetailsPopup(meal)
        }
    }
})

searchInput.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        performSearch()
    }
})

//Functions

//Function to retrieve all meals from an ingredient

async function searchMealsByIngredient(ingredient) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        const data = await response.json()
        return data.meals
    } catch(error) {
        console.error('Error fetching data', error)
    }
}

//Function to get more info for individual meal

async function getMealDetails(mealId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        const data = await response.json()
        return data.meals[0]
    } catch(error) {
        console.error('Error fetching data', error)
    }
}

//Function to display meals on the page

function displayMeals(meals) {
    mealList.innerHTML = ''
    if(meals) {
        meals.forEach(meal => {
            const mealItem = document.createElement('div')
            mealItem.classList.add('meal-item')
            mealItem.dataset.id = meal.idMeal
            mealItem.innerHTML = `
                <img src='${meal.strMealThumb}' alt='${meal.strMeal}'>
                <h3>${meal.strMeal}</h3>
            `
            mealList.appendChild(mealItem)
        })
    } else {
        mealList.innerHTML= `<p>No meals found. Try another ingredient</p>`
    }
}

//Function to display info on popup modal
function showMealDetailsPopup(meal) {
    const ingredients = []
    for(let i = 0; i < Object.keys(meal).length; i++) {
        if(meal[`strIngredient${i}`] && meal[`strIngredient${i}`] !== '') {
            ingredients.push(meal[`strIngredient${i}`])
        }
    }
    const ingredientsHTML = ingredients.map(el => `<li>${el}</li>`).join('')
    mealDetailsContent.innerHTML = `
        <h2 class='recipe-title'>${meal.strMeal}</h2>
        <p class='recipe-category'>${meal.strCategory}</p>
        <div class='recipe-ingredients'>
            <h3>Ingredients:</h3>
            <ol>
                ${ingredientsHTML}
            </ol>
        </div>
        <div class='recipe-instruct'>
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class='recipe-img'>
            <img src='${meal.strMealThumb}' alt='${meal.strMeal}'
        </div>
        <div class='recipe-video'>
            <a href='${meal.strYoutube}' target='_blank'>Video Tutorial</a> 
        <div
    `
    modalContainer.style.display = 'block'
}

//Function to close recipe modal

function closeRecipeModal() {
    modalContainer.style.display = 'none'
}

//Function to perform the search

async function performSearch() {
    const ingredient = searchInput.value.trim()
    if(ingredient) {
        const meals = await searchMealsByIngredient(ingredient)
        displayMeals(meals)
    }
}

//Function to make a default search on page load

window.addEventListener('load', () => {
    searchInput.value = 'Chicken'
    performSearch()
})