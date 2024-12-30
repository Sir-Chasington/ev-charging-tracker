const chargeHistory = JSON.parse(localStorage.getItem("chargeHistory")) || [];
let totalCost = chargeHistory.reduce((sum, entry) => sum + entry.cost, 0);

// Update old entries missing "percentCharged" data
function updateOldEntries() {
  const batteryCapacity = parseFloat(document.getElementById("batteryCapacity").value) || 100; // Default to 100kWh
  let updated = false;

  chargeHistory.forEach((entry) => {
    if (!entry.percentCharged && entry.kWh !== undefined && batteryCapacity > 0) {
      // Calculate the percent charged and add it to the entry
      entry.percentCharged = ((entry.kWh / batteryCapacity) * 100).toFixed(2);
      updated = true;
    }
  });

  // Update localStorage if changes were made
  if (updated) {
    localStorage.setItem("chargeHistory", JSON.stringify(chargeHistory));
  }
}

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

// Show or hide the "End Percentage" input based on the toggle state
function toggleEndPercentage() {
  const chargeToFull = document.getElementById("chargeToFull").checked;
  const endPercentageContainer = document.getElementById("endPercentageContainer");

  if (chargeToFull) {
    endPercentageContainer.style.display = "none";
  } else {
    endPercentageContainer.style.display = "block";
  }
}

// Charging History
function renderHistory() {
  const tableBody = document.getElementById("chargeHistory");
  tableBody.innerHTML = ""; // Clear existing table rows

  chargeHistory.forEach((entry, index) => {
    const percentCharged =
      entry.percentCharged !== undefined ? `${entry.percentCharged}% charged` : "N/A";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.kWh.toFixed(2)} kWh</td>
      <td>${percentCharged}</td>
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

  const chargeToFull = document.getElementById("chargeToFull").checked;
  let endPercentage = 100; // Default to 100% if toggle is checked

  if (!chargeToFull) {
    endPercentage = parseFloat(document.getElementById("endPercentage").value);
    if (isNaN(endPercentage) || endPercentage <= currentPercentage || endPercentage > 100) {
      alert("Please enter a valid end percentage greater than current percentage and less than or equal to 100.");
      return;
    }
  }

  const percentCharged = endPercentage - currentPercentage;
  const kWhNeeded = batteryCapacity * (percentCharged / 100);
  const cost = kWhNeeded * electricityCost;

  const newEntry = { date: chargeDate, kWh: kWhNeeded, cost, percentCharged };
  chargeHistory.push(newEntry);
  localStorage.setItem("chargeHistory", JSON.stringify(chargeHistory));

  totalCost += cost;
  renderHistory();
  document.getElementById("chargingForm").reset();
  document.getElementById("chargeToFull").checked = true; // Reset toggle
  toggleEndPercentage(); // Reset end percentage input visibility
}

// Initialize car make, update old entries, and render history on page load
initializeCarMake();
updateOldEntries();
renderHistory();
