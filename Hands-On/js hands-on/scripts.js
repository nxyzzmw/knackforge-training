// Even or Odd
function evenodd() {
    document.getElementById("even-odd").addEventListener("click", function (e) {
        e.preventDefault();
        const ans1 = document.getElementById("evenodd").value;
        const re1 = document.getElementById("res1");

        if (ans1 === "") {
            res1.innerText = "Enter a number";
            return;
        }

        if (ans1 % 2 === 0) {
            res1.innerText = "even"
        }
        else {
            res1.innerText = "odd"
        }
        document.getElementById("evenodd").value = "";
    })
}; evenodd();

// Largest of three numbers
function largest() {
    const numbers = [];
    const input = document.getElementById("large");
    const res2 = document.getElementById("res2");

    document.getElementById("save").addEventListener("click", function (e) {
        e.preventDefault();

        if (input.value === "") {
            res2.innerText = "Enter a number";
            return;
        }

        numbers.push(input.value);
        input.value = "";

        if (numbers.length > 3) {
            document.getElementById("save").disabled = true;
            res2.innerText = "You can enter only 3 numbers, Now click check"
            return;
        }
    });

    document.getElementById("largest").addEventListener("submit", function (e) {
        e.preventDefault();

        if (numbers.length < 3) {
            res2.innerText = "Enter exactly 3 numbers";
            return;
        }

        const largestNum = Math.max(...numbers);
        res2.innerText = largestNum;
        document.getElementById("large").value = "";
    });
}
largest();

// Factorial
function fact() {
    document.getElementById("factorial").addEventListener("submit", function (e) {
        e.preventDefault();
        const ans3 = document.getElementById("fact").value;
        const res3 = document.getElementById("res3");

        if (ans3 === "" || ans3 < 0) {
            res3.innerText = "Enter a valid number";
            return;
        }

        let result = 1;
        for (let i = 2; i <= ans3; i++) {
            result *= i;
        }
        res3.innerText = result;
        document.getElementById("fact").value = "";
    });
}
fact();

// Countdown
function count() {
    let count;
    document.getElementById("countdo").addEventListener("submit", function (e) {
        e.preventDefault();
        let ans4 = document.getElementById("countdown").value;
        const res4 = document.getElementById("res4");

        if (ans4 === "" || ans4 <= 0) {
            res4.innerText = "Enter a valid number";
            return;
        }

        clearInterval(count);
        res4.innerText = ans4;

        count = setInterval(() => {
            ans4--;
            res4.innerText = ans4;

            if (ans4 <= 0) {
                clearInterval(count);
            }
        }, 1000);

        document.getElementById("countdown").value = "";
    });
}
count();

// Reverse a string
function reverse(){
    document.getElementById("string-reverse").addEventListener("submit",function(e){
        e.preventDefault();
        const ans5=document.getElementById("stringrev").value;
        const res5=document.getElementById("res5");

        if (ans5 === "") {
            res5.innerText = "Enter a string";
            return;
        }

        let result="";
        for(let i=ans5.length-1;i>=0;i--){
            result+=ans5[i];
        }
        res5.innerText=result;
        document.getElementById("stringrev").value = "";
    });
}
reverse();

// Multiplication table
function mul(){
    document.getElementById("multiplication").addEventListener("submit",function(e){
        e.preventDefault();
        const ans6= document.getElementById("multable").value;
        const res6=document.getElementById("res6");

        if (ans6 === "") {
            res6.innerText = "Enter a number";
            return;
        }

        let result="";
        for(let i =1;i<=12;i++){
            result+= `${ans6} × ${i} = ${ans6 * i}\n`;
        }
        res6.innerText=result;
        document.getElementById("multable").value = "";
    });
}
mul();

// Prime number check
function prime(){
    document.getElementById("prime").addEventListener("submit",function(e){
        e.preventDefault();
        const ans7=document.getElementById("primenum").value;
        const res7=document.getElementById("res7");

        if (ans7 === "" || ans7 < 2) {
            res7.innerText = "Not a prime number";
            return;
        }

        for (let i = 2; i <= Math.sqrt(ans7); i++) {
            if (ans7 % i === 0) {
                res7.innerText = ans7 + " is not a prime number";
                document.getElementById("primenum").value = "";
                return;
            }
        }
        res7.innerText = ans7 + " is a prime number";
        document.getElementById("primenum").value = "";
    });
}
prime();

// Form Validation
function formValidation() {
  const form = document.getElementById("form-validation");

  function showError(input, message) {
    const error = input.nextElementSibling;
    error.innerText = message;
  }

  function clearError(input) {
    const error = input.nextElementSibling;
    error.innerText = "";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;

    const firstname = document.getElementById("firstname");
    const secondname = document.getElementById("secondname");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const gender = document.getElementById("gender");
    const dob = document.getElementById("dob");
    const city = document.getElementById("city");
    const state = document.getElementById("state");
    const address = document.getElementById("address");
    const terms = document.getElementById("terms");

    // First Name
    if (!/^[A-Za-z]+$/.test(firstname.value.trim())) {
      showError(firstname, "First name must contain letters only");
      isValid = false;
    } else clearError(firstname);

    // Last Name
    if (!/^[A-Za-z]+$/.test(secondname.value.trim())) {
      showError(secondname, "Last name must contain letters only");
      isValid = false;
    } else clearError(secondname);

    // Username
    if (username.value.trim().length < 4) {
      showError(username, "Username must be at least 4 characters");
      isValid = false;
    } else clearError(username);

    // Password
    if (password.value.length < 6) {
      showError(password, "Password must be at least 6 characters");
      isValid = false;
    } else clearError(password);

    // Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError(email, "Enter valid email (example@mail.com)");
      isValid = false;
    } else clearError(email);

    // Phone
    if (!/^\d{10}$/.test(phone.value.trim())) {
      showError(phone, "Phone must be exactly 10 digits");
      isValid = false;
    } else clearError(phone);

    // Gender
    if (gender.value === "Select Gender") {
      showError(gender, "Please select gender");
      isValid = false;
    } else clearError(gender);

    // DOB
    if (!dob.value) {
      showError(dob, "Please select date of birth");
      isValid = false;
    } else clearError(dob);

    // City
    if (!city.value.trim()) {
      showError(city, "City is required");
      isValid = false;
    } else clearError(city);

    // State
    if (!state.value.trim()) {
      showError(state, "State is required");
      isValid = false;
    } else clearError(state);

    // Address
    if (!address.value.trim()) {
      showError(address, "Address is required");
      isValid = false;
    } else clearError(address);

    // Terms
    if (!terms.checked) {
      showError(terms, "You must agree to terms");
      isValid = false;
    } else clearError(terms);

    if (isValid) {
      alert("Form submitted successfully!");
      form.reset();
      document.querySelectorAll(".text-danger").forEach(e => e.innerText = "");
    }
  });
}

formValidation();
