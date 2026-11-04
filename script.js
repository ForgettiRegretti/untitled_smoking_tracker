
let count = 0;
let max = 15;
const buttonFluppe = document.getElementById("fluppenCounter");
const labelFluppe = document.getElementById("countLabel");

buttonFluppe.addEventListener("click", function () {
    count += 1;
    labelFluppe.textContent = count;
});