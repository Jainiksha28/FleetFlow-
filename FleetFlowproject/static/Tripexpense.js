const hamburger = document.querySelector(".hamburger");
const sidebar = document.querySelector(".sidebar");

hamburger.addEventListener("click", function () {
    sidebar.classList.toggle("active");
});

let expenses = [];

function openModal(){
    document.getElementById("modal").style.display = "flex";
}

function closeModal(){
    document.getElementById("modal").style.display = "none";
}

function addExpense(){

    const tripId = tripIdInput.value;
    const driver = driverName.value;
    const plate = vehiclePlate.value;
    const type = vehicleType.value;
    const distance = Number(distanceInput.value);
    const fuel = Number(fuelCost.value);
    const other = Number(otherExpense.value);

    if(!tripId || !driver || !plate || !distance){
        alert("Fill all fields");
        return;
    }

    const total = fuel + other;

    expenses.push({tripId, driver, plate, type, distance, fuel, other, total});

    renderTable();
    closeModal();
}

function renderTable(){

    const tbody = document.getElementById("expenseTable");
    tbody.innerHTML = "";

    let filtered = [...expenses];

    // Group
    const group = groupSelect.value;
    if(group !== "all"){
        filtered = filtered.filter(e => e.type === group);
    }

    // Filter
    const filter = filterSelect.value;
    if(filter === "high"){
        filtered = filtered.filter(e => e.total > 5000);
    }
    if(filter === "low"){
        filtered = filtered.filter(e => e.total < 5000);
    }

    // Sort
    const sort = sortSelect.value;
    if(sort === "distance"){
        filtered.sort((a,b) => a.distance - b.distance);
    }
    if(sort === "total"){
        filtered.sort((a,b) => a.total - b.total);
    }

    let fleetTotal = 0;

    filtered.forEach(e => {

        fleetTotal += e.total;

        tbody.innerHTML += `
            <tr>
                <td>${e.tripId}</td>
                <td>${e.driver}</td>
                <td>${e.plate}</td>
                <td>${e.type}</td>
                <td>${e.distance}</td>
                <td>${e.fuel}</td>
                <td>${e.other}</td>
                <td>${e.total}</td>
            </tr>
        `;
    });

    document.getElementById("fleetTotal").innerText = fleetTotal;
}

groupSelect.addEventListener("change", renderTable);
filterSelect.addEventListener("change", renderTable);
sortSelect.addEventListener("change", renderTable);
