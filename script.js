let count, lsCount, maxFluppe, index, shuffledPhrases;

const buttonFluppe = document.getElementById("fluppenCounter");
const labelFluppe = document.getElementById("countLabel");
const MCBottom = document.getElementById("MCBottom");
const settingsContainer = document.getElementById("settings");
const menu = document.querySelector('.menu');
const settingsIcon = document.getElementById("settingsIcon");
const maxInput = document.getElementById("maxInput");
const labelMax = document.getElementById("maxLabel");
const resetLS = document.getElementById("resetLS");
const navHome = document.getElementById("navHome");
const navSettings = document.getElementById("navSettings");
const navStats = document.getElementById("navStats");
const fluppenBergIMG = document.querySelector(".fluppenBerg");
const phrase = document.getElementById("phrase");
const dangerContainer = document.getElementById("danger");


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
};

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
};

function checkReset() {
    const today = new Date().toDateString();
    if (loadData("lastDate", null) !== today) {
        dangerContainer.classList.add("hidden");
        count = 0;
        labelFluppe.textContent = count;
        lsCount.push({ time: Date.now(), "count": 0 });
        shuffledPhrases = shuffle(meanPhrases);
        saveData("lastDate", today);
        saveData("lsCount", lsCount);
        saveData("shuffledPhrases", shuffledPhrases);   
    }
};

document.addEventListener("visibilitychange", function() {
    if(document.visibilityState === "visible") {
        checkReset();
        getMoving();
    }
});

// Fluppen Button
buttonFluppe.addEventListener("click", function () {
    count += 1;
    labelFluppe.textContent = count;
    lsCount.push({ time: Date.now(), "count": count });
    saveData("lsCount", lsCount);
    getMoving();
    princessTreatment();
    
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
// nothing to see here, just perfectly written and efficient code
// TODO add navStats
function toggleNav () {
    menu.classList.toggle("active");
}

navHome.addEventListener("click", function() {
    MCBottom.classList.toggle("hidden");
    settingsContainer.classList.toggle("hidden");
    toggleNav();
});

navSettings.addEventListener("click", function() {
    MCBottom.classList.toggle("hidden");
    settingsContainer.classList.toggle("hidden");
    toggleNav();
});

// update max fluppen
maxInput.addEventListener("change", function() {
    maxFluppe = Number(maxInput.value);
    labelMax.textContent = maxFluppe;
    saveData("maxFluppe", maxFluppe);
});

// calculate transitionn for animation
function getMoving () {
    let percent = 100 - (count / maxFluppe) * 100;
    if(percent >= 0 && percent <= 100){
    fluppenBergIMG.style.transform = `translateY(${percent}%)`;
    }
};

// neatly displayed on failure
const meanPhrases = [
    "Yeah, why stop here, right?",
    "Is this really your best? Oh, well.",
    "I smell something... ah, yes, failure.",
    "Congratulations. You failed. Again.",
    "Maybe next time. Or maybe not.",
    "That went exactly as I expected: badly.",
    "You really gave it your... average effort.",
    "Don't give up! Oh wait, you already did.",
    "So close! Well, not really, but it sounds nicer.",
    "What a disappointment you are.",
    "Well, that was... something.",
    "I had such high hopes. Silly me.",
    "Interesting strategy. Did you plan to lose?",
    "That's okay. Not everyone can be good at everything.",
    "I'd say try again, but let's be realistic.",
    "Don't worry, failure suits you.",
    "Lung cancer says hello. It's excited to meet you!",
    "What is the goal here? Emphysema?",
    "One day your lungs will fail, just like you did today.",
    "Your lungs are working overtime. You, on the other hand, achieved nothing.",
    "Another pack gone, and so is your money. And health. And your youthful appearance.",
    "But you promised to quit. You promised!",
    "Out of breath? Your budding COPD is showing.",
    "I can't believe you've done that.",
    "Oh my god. Just stop, okay?",
    "Why are you so weak?"
];

// TODO find a different random method, maybe only once a day?
function princessTreatment() {
    if (count > maxFluppe) {
        dangerContainer.classList.remove("hidden");
        phrase.textContent = nextPhrase();
    }
};

function nextPhrase() {
    index = loadData("index", 0);
    shuffledPhrases = loadData("shuffledPhrases", []);
    if (shuffledPhrases.length === 0) {
        shuffledPhrases = shuffle(meanPhrases);};
    const phrase = shuffledPhrases[index];
    index = (index + 1) % shuffledPhrases.length;
    saveData("index", index);
    return phrase;
}

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}




// initial page load

lsCount = loadData("lsCount", []);
count = lsCount.length > 0 ? lsCount[lsCount.length - 1].count : 0;
checkReset();
maxFluppe = loadData("maxFluppe", 0);
settingsIcon.addEventListener("click", toggleNav);
labelFluppe.textContent = count;
labelMax.textContent = maxFluppe;
maxInput.value = maxFluppe;
getMoving();
princessTreatment()