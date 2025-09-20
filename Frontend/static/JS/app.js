// async function fetchNutritionData(ingredient){
//     const app_id="23dc4d59";
//     const app_key="78b5134354914931a5b6b22a03a79452";
//     // let baseurl="https://api.edamam.com/api/nutrition-data";
//     let baseurl="https://api.spoonacular.com/recipes/analyze";
    
//     const url = `${baseurl}?app_id=${app_id}&app_key=${app_key}&nutrition-type=logging&ingr=${encodeURIComponent(ingredient)}`;
//     try {
//         const config={
//             headers: {
//                 "accept": "application/json"
//               }
//         };
//         const response=await axios.get(url,config);
//         console.log(response);
//     } catch (error) {
//         console.log("No Data Found");
//         console.error(error);
//     }
// }


// fetchNutritionData("rice 50gram");

// REGISTRATION FORM VALIDATIONS
// Email validation pattern (basic email format)
const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

 // Password validation (length and strength check)
const passwordPattern= /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}":;'?/>.<,])(?=.{8,})/;

let password=null;
let passwordError=null;
let confirmPassword =null;
let confirmPasswordError=null;


let age =null; 
let ageError =null; 
const registrationForm=document.getElementById("registrationForm"); 

if (registrationForm){
    //Get the values of passwords after entering 
    password = document.getElementById('password');
    passwordError = document.getElementById('passwordError');
    confirmPassword = document.getElementById('confirm_password');
    confirmPasswordError = document.getElementById('confirmPasswordError');

    // Get the value of age input
    age = document.getElementById("age");
     ageError = document.getElementById("ageError"); 

     const weight = document.getElementById("weight");
     const weightError = document.getElementById("weightError");


    registrationForm.addEventListener("submit", function(event) {
        //For the field Full Name
        let name=document.getElementById("name").value.trim();
        let nameError=document.getElementById("nameError");
    
        const namePattern=/^(?=.*[A-Za-z])[A-Za-z\s]{2,50}$/; //ensures only charater a-z and A-z or spaces are included , also only spaces are not allowed 
    
    
        nameError.textContent=""; //always clear previous errors.
    
        if (!namePattern.test(name)) { //The .test() method performs a search for a match   between the provided regular expression and the string. I
            nameError.textContent = "Invalid name. Must contain at least one letter and only letters and spaces (2-50 characters).";
            event.preventDefault();  // Stop form submission
          }
    
    
          //Email Validations 
    
          let email = document.getElementById('email').value.trim();
          let emailError = document.getElementById('emailError');
          
          // Clear previous error message
            emailError.textContent = "";
          
          
      
          // Check if email is valid
          if (email === "") {
              emailError.textContent = "Email is required.";
              event.preventDefault();  // Stop form submission
          } else if (!emailPattern.test(email)) {
              emailError.textContent = "Please enter a valid email address.";
              event.preventDefault();  // Stop form submission
          }
    
        //Password field validations 
       
        
        // Clear previous error messages
        passwordError.textContent = "";
        confirmPasswordError.textContent = "";
        
        const passwordVal=password.value.trim();
        if (passwordVal === "") {
            passwordError.textContent = "Password is required.";
            event.preventDefault();  // Prevent form submission
        } else if (!passwordPattern.test(passwordVal)) {
            passwordError.textContent = "Password must be at least 8 characters long, contain at least one letter, one number, and one special character.";
            event.preventDefault();  // Prevent form submission
        }
        
        // Confirm password validation
        const confirmPassVal=confirmPassword.value.trim();
        if (confirmPassVal === "") {
            confirmPasswordError.textContent = "Please confirm your password.";
            event.preventDefault();  // Prevent form submission
        } else if (passwordVal !== confirmPassVal) {
            confirmPasswordError.textContent = "Passwords do not match.";
            event.preventDefault();  // Prevent form submission
        }
    
    
        // Age validation 
         
         
          // Clear any previous error messages
          ageError.textContent = "";
         
          // Age validation (between 10 and 100)
          const ageValue=age.value.trim();
          if ( ageValue=== "") {
             ageError.textContent = "Age is required.";
             event.preventDefault();  // Stop form submission
          } else if (ageValue < 10 || ageValue > 100) {
             ageError.textContent = "Age must be between 10 and 100.";
             event.preventDefault();  // Stop form submission
          }
          //Weight Validations
          
          const weightValue=weight.value.trim();
          weightError.textContent = "";
          
      
          if (weightValue === "") {
              weightError.textContent = "Weight is required.";
              event.preventDefault();
          } else if (isNaN(weightValue) || weightValue < 20 || weightValue > 200) {
              weightError.textContent = "Weight must be a number between 20 and 200 kg.";
              event.preventDefault();
          }

        
       
    
        
    });

    
// Check confirm password match in real-time when the user exits the confirm password field

    confirmPassword.addEventListener('blur', function() {

    //The blur event occurs when the field loses focus, i.e., when the user clicks out of the field after typing.
    
    
    // Clear any previous error messages
    confirmPasswordError.textContent = "";
   let passwordValBlur=password.value.trim();
   let confirmPassValBlur=confirmPassword.value.trim();
    // Check if passwords match
    if (passwordValBlur !== confirmPassValBlur && confirmPassValBlur !== "") {
        confirmPasswordError.textContent = "Passwords do not match.";
    }
});

// Optionally, validate the age when the user exits the age input field (on blur)
age.addEventListener("blur", function() {
    let ageValue = age.value.trim();
   
    
    // Clear any previous error messages
    ageError.textContent = "";
    
    // Check if age is within the valid range
    if (ageValue < 10 || ageValue > 100) {
        ageError.textContent = "Age must be between 10 and 100.";
    }
});

}




//Login Validations
const loginform=document.getElementById("signin-form");
if(loginform){
    let emailInput = document.getElementById("emailInput");
    let emailInputError = document.getElementById("emailInputError");
    let passwordInput = document.getElementById("passwordInput");
    let passwordInputError = document.getElementById("passwordInputError");
    loginform.addEventListener("submit", function(event) {
        // Validate email/username
        const emailInputVal =emailInput.value.trim();
         // Create this <span> in HTML if needed
    
        
        emailInputError.textContent = "";
    
        if (emailInputVal === "") {
            emailInputError.textContent = "Email  is required.";
            event.preventDefault();
        } else if (!emailPattern.test(emailInputVal)) {
            emailInputError.textContent = "Please enter a valid email address.";
            event.preventDefault();
        }
    
        // Validate password
        const passwordInputVal =passwordInput.value.trim();
       
        passwordInputError.textContent = "";
    
        if (passwordInputVal === "") {
            passwordInputError.textContent = "Password is required.";
            event.preventDefault();
        } else {
    
           
            if (!passwordPattern.test(passwordInputVal)) {
                passwordInputError.textContent = "Password must be at least 8 characters long, contain at least one letter, one number, and one special character.";
                event.preventDefault();
            }
        }
    });
}

