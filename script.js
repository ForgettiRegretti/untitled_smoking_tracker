

//load and save data in localStorage

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

// Handles the fluppen button click event, counts +1

let count = loadData("count", 0);
const buttonFluppe = document.getElementById("fluppenCounter");
const labelFluppe = document.getElementById("countLabel");

labelFluppe.textContent = count;


buttonFluppe.addEventListener("click", function () {
    count += 1;
    labelFluppe.textContent = count;
    LScount.push({ time: Date.now(), "count": count });
    saveData("count", count);
});


// ClassList thingy to display different pages

const MCBottom = document.getElementById("MCBottom");
const settingsContainer = document.getElementById("settings");
const menu = document.getElementById("menu");

menu.onchange = function() {
    if(menu.value==="main"){
        settingsContainer.classList.add("hidden");
        MCBottom.classList.remove("hidden"); 
    }
    else if(menu.value==="settings"){
        MCBottom.classList.add("hidden");
        settingsContainer.classList.remove("hidden");
    }
}



// update max fluppen

let maxFluppe = loadData("maxFluppe", 0);

const maxInput = document.getElementById("maxInput");
const labelMax = document.getElementById("maxLabel");

labelMax.textContent = maxFluppe;
maxInput.value = maxFluppe;


maxInput.onchange = function() {
    maxFluppe = Number(maxInput.value);
    labelMax.textContent = maxFluppe;
    saveData("maxFluppe", maxFluppe);
}

