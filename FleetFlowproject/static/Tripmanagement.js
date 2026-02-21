function openTripModal() {
    document.getElementById("tripModal").style.display = "flex";
}

function closeTripModal() {
    document.getElementById("tripModal").style.display = "none";
}
let editMode = false;
let currentRow = null;

// ===== OPEN NEW TRIP =====
function openTripModal() {
    editMode = false;
    currentRow = null;

    document.querySelector(".modal h2").innerText = "Create New Trip";
    document.querySelector(".confirm-btn").innerText = "Confirm & Dispatch Trip";

    document.getElementById("tripForm").reset();
    document.getElementById("tripModal").style.display = "flex";
}

// ===== CLOSE MODAL =====
function closeTripModal() {
    document.getElementById("tripModal").style.display = "none";
}

// ===== OPEN EDIT MODE =====
function openEditTrip(button) {

    editMode = true;
    currentRow = button.closest("tr");

    document.querySelector(".modal h2").innerText = "Edit Trip";
    document.querySelector(".confirm-btn").innerText = "Save Changes";

    const cells = currentRow.querySelectorAll("td");

    document.querySelector("#tripForm select").value = cells[0].innerText;
    document.querySelector("#tripForm input[placeholder='e.g., John Smith']").value = cells[1].innerText;

    const routeParts = cells[2].innerText.split("→");
    document.querySelector("#tripForm input[placeholder='e.g., 123 Main St, Mumbai']").value = routeParts[0].trim();
    document.querySelector("#tripForm input[placeholder='e.g., 456 Park Ave, Delhi']").value = routeParts[1].trim();

    document.querySelector("#tripForm input[placeholder='e.g., 500']").value = cells[3].innerText.replace(" kg","");
    document.querySelector("#tripForm input[placeholder='e.g., 5000']").value = cells[4].innerText.replace("₹","");

    document.getElementById("tripModal").style.display = "flex";
}

// ===== FORM SUBMIT =====
document.getElementById("tripForm").addEventListener("submit", function(e){
    e.preventDefault();

    const vehicle = document.querySelector("#tripForm select").value;
    const driver = document.querySelector("#tripForm input[placeholder='e.g., John Smith']").value;
    const cargo = document.querySelector("#tripForm input[placeholder='e.g., 500']").value;
    const origin = document.querySelector("#tripForm input[placeholder='e.g., 123 Main St, Mumbai']").value;
    const destination = document.querySelector("#tripForm input[placeholder='e.g., 456 Park Ave, Delhi']").value;
    const fuel = document.querySelector("#tripForm input[placeholder='e.g., 5000']").value;

    if (!vehicle || !driver || !cargo || !origin || !destination) {
        alert("Please fill all required fields!");
        return;
    }

    if (editMode && currentRow) {

        const cells = currentRow.querySelectorAll("td");

        cells[0].innerText = vehicle;
        cells[1].innerText = driver;
        cells[2].innerText = origin + " → " + destination;
        cells[3].innerText = cargo + " kg";
        cells[4].innerText = "₹" + fuel;

    } else {

        const tableBody = document.getElementById("tripTableBody");

        const newRow = tableBody.insertRow();

        newRow.innerHTML = `
            <td>${vehicle}</td>
            <td>${driver}</td>
            <td>${origin} → ${destination}</td>
            <td>${cargo} kg</td>
            <td>₹${fuel}</td>
            <td>
                <select class="status-dropdown">
                    <option>Pending</option>
                    <option>On Trip</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                </select>
            </td>
            <td>
                <button onclick="openEditTrip(this)">Edit</button>
                <button onclick="this.closest('tr').remove()">Delete</button>
            </td>
        `;
    }

    closeTripModal();
});
// 1. Configuration: Define your vehicle capacities here
const VEHICLE_LIMITS = {
    "Truck": 10000,
    "Van": 2000,
    "Bike": 100
};

// 2. Select the specific fields
const vehicleSelect = document.querySelector("#tripForm select");
const weightInput = document.querySelector("#tripForm input[placeholder='e.g., 500']");
const submitBtn = document.querySelector(".confirm-btn");

function validateCargoWeight() {
    const selectedVehicle = vehicleSelect.value;
    const enteredWeight = parseFloat(weightInput.value);
    const limit = VEHICLE_LIMITS[selectedVehicle];

    // Clear previous error states
    weightInput.style.border = "";
    submitBtn.disabled = false;
    submitBtn.style.opacity = "1";
    submitBtn.title = "";

    // Validation Logic
    if (selectedVehicle !== "Choose a vehicle..." && enteredWeight > limit) {
        // Visual Warning
        weightInput.style.border = "2px solid #e74c3c"; // Red border
        
        // Disable Submission
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";
        submitBtn.title = `Weight exceeds ${selectedVehicle} limit of ${limit}kg`;
        
        // Optional: Log to console or show a small hint
        console.warn(`Validation failed: ${enteredWeight}kg exceeds ${limit}kg limit.`);
    }
}

// 3. Attach Event Listeners
weightInput.addEventListener("input", validateCargoWeight);
vehicleSelect.addEventListener("change", validateCargoWeight);
