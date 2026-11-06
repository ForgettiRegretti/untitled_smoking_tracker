let count, lsCount, maxFluppe;

const buttonFluppe = document.getElementById("fluppenCounter");
const labelFluppe = document.getElementById("countLabel");
const MCBottom = document.getElementById("MCBottom");
const settingsContainer = document.getElementById("settings");
const menu = document.querySelector('.menu');
const settingsIcon = document.getElementById("settingsIcon");
const maxInput = document.getElementById("maxInput");
const labelMax = document.getElementById("maxLabel");
const resetLS = document.getElementById("resetLS")


// Functions

//Storage helper
function loadData (key, fallback) {
    try {
        const rawData = localStorage.getItem(key)
        return rawData ? JSON.parse(rawData) : fallback
    }
    catch (e) {
        return fallback
    }
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Fluppen Button
buttonFluppe.addEventListener("click", function () {
    count += 1;
    labelFluppe.textContent = count;
    lsCount.push({ time: Date.now(), "count": count });
    saveData("lsCount", lsCount);
});

// reset button
resetLS.addEventListener("click", function () {
    localStorage.removeItem("lsCount");
    localStorage.removeItem("maxFluppe")
    lsCount = [];
    count = 0;
    labelFluppe.textContent = count;
    maxFluppe = 0;
    labelMax.textContent = maxFluppe;

}
);


// ClassList thingy to display different pages
settingsIcon.addEventListener("click", function() {
    menu.classList.toggle("active");
})





// update max fluppen
maxInput.addEventListener("change", function() {
    maxFluppe = Number(maxInput.value);
    labelMax.textContent = maxFluppe;
    saveData("maxFluppe", maxFluppe);
});

// initial page load

lsCount = loadData("lsCount", []);
count = lsCount.length > 0 ? lsCount[lsCount.length - 1].count : 0;
maxFluppe = loadData("maxFluppe", 0);

labelFluppe.textContent = count;
menu.classList.add("hidden");
settingsContainer.classList.add("hidden");
labelMax.textContent = maxFluppe;
maxInput.value = maxFluppe;
