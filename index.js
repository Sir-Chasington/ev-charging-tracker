const chargeHistory = JSON.parse(localStorage.getItem("chargeHistory")) || [];
let totalCost = chargeHistory.reduce((sum, entry) => sum + entry.cost, 0);

// Car Make
function initializeCarMake() {
  const carMake = localStorage.getItem("carMake");
  const carMakeInput = document.getElementById("carMake");
  const carMakeDisplay = document.getElementById("carMakeDisplay");

  if (carMake) {
    carMakeInput.style.display = "none";
    carMakeDisplay.style.display = "inline";
    carMakeDisplay.textContent = carMake;
  } else {
    carMakeInput.style.display = "inline";
    carMakeDisplay.style.display = "none";
  }
}

function saveCarMake() {
  const carMakeInput = document.getElementById("carMake");
  const carMake = carMakeInput.value.trim();

  if (carMake) {
    localStorage.setItem("carMake", carMake);
    initializeCarMake();
  }
}

// Charging History
function renderHistory() {
  const tableBody = document.getElementById("chargeHistory");
  tableBody.innerHTML = ""; // Clear existing table rows

  chargeHistory.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.kWh.toFixed(2)} kWh</td>
      <td>$${entry.cost.toFixed(2)}</td>
      <td class="trash-icon" onclick="deleteEntry(${index})">🗑️</td>
    `;
    tableBody.appendChild(row);
  });

  // Update total cost
  document.getElementById("totalCost").textContent = `$${totalCost.toFixed(2)}`;
}

function deleteEntry(index) {
  // Remove the selected entry from the array
  const removedEntry = chargeHistory.splice(index, 1)[0];

  // Update total cost
  totalCost -= removedEntry.cost;

  // Save updated history to local storage
  localStorage.setItem("chargeHistory", JSON.stringify(chargeHistory));

  // Re-render the table
  renderHistory();
}

function calculateAndAdd() {
  const batteryCapacity = parseFloat(document.getElementById("batteryCapacity").value);
  const electricityCost = parseFloat(document.getElementById("electricityCost").value);
  const currentPercentage = parseFloat(document.getElementById("currentPercentage").value);
  const chargeDate = document.getElementById("chargeDate").value;

  if (!chargeDate) {
    alert("Please select a date of charge.");
    return;
  }

  const kWhNeeded = batteryCapacity * ((100 - currentPercentage) / 100);
  const cost = kWhNeeded * electricityCost;

  const newEntry = { date: chargeDate, kWh: kWhNeeded, cost };
  chargeHistory.push(newEntry);
  localStorage.setItem("chargeHistory", JSON.stringify(chargeHistory));

  totalCost += cost;
  renderHistory();
  document.getElementById("chargingForm").reset();
}

// Initialize car make and render history on page load
initializeCarMake();
renderHistory();
