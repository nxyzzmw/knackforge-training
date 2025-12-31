// dynamic cards
let services = [];

// Card data
const cardsData = [
  { title: "Web Development", image: "images/no1.png" },
  { title: "App Development", image: "images/no2.png" },
  { title: "UI/UX Design", image: "images/no3.png" },
  { title: "IT Consulting", image: "images/no1.png" },
  { title: "Cybersecurity", image: "images/no2.png" },
  { title: "Data Analytics & Business Intelligence", image: "images/no3.png" },
  { title: "Software Testing & Quality Assurance (QA)", image: "images/no3.png" },
  { title: "Devops", image: "images/no3.png" },
  { title: "IT Support & Manage", image: "images/no3.png" },
  { title: "Front End", image: "images/no3.png" },
  { title: "Marketing", image: "images/no3.png" },
  { title: "Finance", image: "images/no3.png" }
];

// Function to render cards dynamically
function renderCards() {
  const container = document.getElementById("cardsContainer");
  if (!container) {
    console.error("cardsContainer not found");
    return;
  }
  
  container.innerHTML = "";

  cardsData.forEach(card => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "col-12 col-md-6 col-lg-4 mt-5";
    cardDiv.innerHTML = `
      <div class="card h-100">
        <img src="${card.image}" class="card-img-top" alt="${card.title}" />
        <div class="card-body">
          <h5 class="card-title">${card.title}</h5>
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            View More
          </button>
        </div>
      </div>
    `;
    container.append(cardDiv);
  });
}

// Load data when page loads 
window.onload = function () {
    //table data load in service form
  const savedData = localStorage.getItem("services");
  if (savedData) {
    services = JSON.parse(savedData); // JSON → JS
    const result = document.getElementById("result");
    if (result) {
      renderTable();
    }
  }
  
  // Render cards when page loads
  renderCards();
};

//service form script
// Store new entry
function store() {
  const name = document.getElementById("name").value;
  const category = document.getElementById("serviceSelect").value;
  const description = document.getElementById("description").value;

  if (!name || !category || !description) {
    alert("Please fill all fields");
    return;
  }

  // Add data to array
  services.push({ name, category, description });

  // Save to localStorage
  localStorage.setItem("services", JSON.stringify(services));

  // Update table
  renderTable();

  // Clear inputs
  document.getElementById("name").value = "";
  document.getElementById("description").value = "";
  document.getElementById("serviceSelect").selectedIndex = 0;
}

// Render table from JSON
function renderTable() {
  const result = document.getElementById("result");
  result.innerHTML = "";

  services.forEach((service, index) => {
    result.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${service.name}</td>
        <td>${service.category}</td>
        <td>${service.description}</td>
      </tr>
    `;
  });
}

