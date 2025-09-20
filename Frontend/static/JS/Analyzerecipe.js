const api_key='2a60e0e9342048258e5f38b358b758fa';
const foodForm=document.getElementById("foodForm");
// Function to render the chart
async function renderNutritionChart(calories, protein, carbs, fat, fiber, sugars, sodium, cholesterol) {
    let nutritionResultDiv= document.querySelector("#nutritionResult");
    nutritionResultDiv.parentElement.classList.remove("d-none");

    const ctx = document.getElementById('NutritionChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.nutritionChart) {
        window.nutritionChart.destroy();
    }

    // Create the chart
    window.nutritionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Calories', 'Protein (g)', 'Carbs (g)', 'Fat (g)', 'Fiber (g)', 'Sugar (g)', 'Sodium (mg)', 'Cholesterol (mg)'],
            datasets: [{
                label: 'Nutritional Values Per Serving',
                data: [calories, protein, carbs, fat, fiber, sugars, sodium, cholesterol],
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Display the card containing the chart
    document.getElementById('nutritionCard').classList.remove('d-none');
}

// Function to fetchFoodId
async function fetchFoodId(food){
    
    console.log("in fetch food id");
    const baseurl="https://api.spoonacular.com/recipes/complexSearch";
    
    let url = `${baseurl}?apiKey=${api_key}&query=${food}&cuisine=Indian`;
   
    try {
        let response = await axios.get(url);
        console.log("complex search=",response);
        let results = response.data.results;

        // If no Indian results found, search globally
        if (results.length === 0) {
            console.log("No Indian cuisine results found. Searching globally...");
            url = `${baseurl}?apiKey=${api_key}&query=${food}`;
            response = await axios.get(url);
            console.log("complex search global=",response);
            results = response.data.results;
           
        }
         // If no results found in both Indian and global search
         if (results.length === 0) {
            console.log("No results found in our database.");
            return null;
        }
           // Split the food query into words for matching
           const searchWords = food.toLowerCase().split(" ");
        // Find the exact match based on the title
        
        const matchedFood = results.find(item => 
            searchWords.every(word => item.title.toLowerCase().includes(word))
        );

        // If exact match found, return its id; otherwise, return the first item's id
        if (matchedFood) {
            console.log("Matched Food ID:", matchedFood.id);
            return matchedFood.id;
        } else{
            console.log("No exact match found. Returning first result ID:", results[0].id);
            return results[0].id;
        } 

    } catch (error) {
        console.error("Error fetching data:", error);
        return null;

    }
}



async function fetchNutritionData(id){
    console.log("in fetch nutrition");
    console.log("id =",id);
    
    if (!id) {
        console.log("Invalid food ID. Cannot fetch nutrition data.");
        return;
    }

    try{
       
        const baseurl= "https://api.spoonacular.com/recipes";
        const url=`${baseurl}/${id}/information/?apiKey=${api_key}&includeNutrition=true`;
        let response=await axios.get(url);
        console.log("recipe api=",response);
        const nutritionData = response.data.nutrition;

        
        console.log("Nutrition Data:", nutritionData);
        // console.log(response);


         // Calculate the nutritional values for one serving
        const servings = response.data.servings || 1; // Default to 1 serving if not specified
        console.log("Servings=",)
        const caloriesPerServing = nutritionData.nutrients.find(n => n.name === "Calories")?.amount / servings || 0;
        const proteinPerServing = nutritionData.nutrients.find(n => n.name === "Protein")?.amount / servings || 0;
        const carbsPerServing = nutritionData.nutrients.find(n => n.name === "Carbohydrates")?.amount / servings || 0;
        const fatPerServing = nutritionData.nutrients.find(n => n.name === "Fat")?.amount / servings || 0;
        const fiberPerServing = nutritionData.nutrients.find(n => n.name === "Fiber")?.amount / servings || 0;
        const sugarsPerServing = nutritionData.nutrients.find(n => n.name === "Sugar")?.amount / servings || 0;
        const sodiumPerServing = nutritionData.nutrients.find(n => n.name === "Sodium")?.amount / servings || 0;
        const cholesterolPerServing = nutritionData.nutrients.find(n => n.name === "Cholesterol")?.amount / servings || 0;

        console.log("Calories per serving:", caloriesPerServing);
        console.log("Protein per serving:", proteinPerServing);
        console.log("Carbs per serving:", carbsPerServing);
        console.log("Fat per serving:", fatPerServing);
        console.log("Fiber per serving:", fiberPerServing);
        console.log("Sugar per serving:", sugarsPerServing);
        console.log("Sodium per serving:", sodiumPerServing);
        console.log("Cholesterol per serving:", cholesterolPerServing);

        // Call the function to render the chart
       await renderNutritionChart(
            caloriesPerServing,
            proteinPerServing,
            carbsPerServing,
            fatPerServing,
            fiberPerServing,
            sugarsPerServing,
            sodiumPerServing,
            cholesterolPerServing
        );


    }catch(error){
        console.error("Error fetching data:", error);
        return null;
    }
}


if(foodForm){
    let userInput=document.getElementById("foodInput");
    foodForm.addEventListener('submit',async function(event){
        event.preventDefault(); //prevents form submission
        let userInputValue=userInput.value.trim()
        console.log("input=",userInputValue);
        if (!userInputValue) {
            console.log("Input is Empty . Enter food name");
            return;
        }

        let matchedFoodId=await fetchFoodId(userInputValue);//get the id of the food matched from user input
        console.log("matched id=",matchedFoodId);
        if (matchedFoodId) {
            await fetchNutritionData(matchedFoodId); // Fetch and display nutrition data
        } else {
            console.log("No matched food found. Please try a different search.");
        }
       
    });
   

   
}

