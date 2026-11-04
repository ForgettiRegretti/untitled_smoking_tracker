

// Handles the fluppen button click event, counts +1

let count = 0;

const buttonFluppe = document.getElementById("fluppenCounter");
const labelFluppe = document.getElementById("countLabel");

buttonFluppe.addEventListener("click", function () {
    count += 1;
    labelFluppe.textContent = count;
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
let maxFluppe = 0;
const maxInput = document.getElementById("maxInput");
const labelMax = document.getElementById("maxLabel");

labelMax.textContent = maxFluppe;

maxInput.onchange = function() {
    maxFluppe = maxInput.value
    labelMax.textContent = maxFluppe;
}


