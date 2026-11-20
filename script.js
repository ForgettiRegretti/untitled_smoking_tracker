//State

let count, dailyLimit, moneyWasted, cigarettePrice, phraseIndex, shuffledPhrases, 
    selectedAnimation, oldPercent, percent, weeklyReduction;

//Navigation
const menu = document.querySelector('.menu');
const navHome = document.getElementById("navHome");
const navSettings = document.getElementById("navSettings");
const navStats = document.getElementById("navStats");
const settingsIcon = document.getElementById("settingsIcon");

//Pages & Container
const mainPage = document.getElementById("mainPage");
const settingsPage = document.getElementById("settingsPage");
const statsPage = document.getElementById("statsPage");
const dangerContainer = document.getElementById("danger");
const moneyWastedContainer = document.getElementById("moneyWastedContainer");
const menuOverlay = document.getElementById("menuOverlay");
const lungAnimation = document.getElementById("animationOne");
const cigaretteAnimation = document.getElementById("animationTwo");

//Counting and displaying value
const ButtonCountCigarette = document.getElementById("fluppenCounter");
const labelCountCigarette = document.getElementById("countLabel");
const inputDailyLimit = document.getElementById("maxInput");
const labelDailyLimit = document.getElementById("maxLabel");
const inputCigarettePrice = document.getElementById("costFluppe");
const buttonFootnote = document.getElementById("footnoteButton");
const labelFootnote = document.getElementById("labelFootnoteButton")
const quote = document.getElementById("quote");
const labelMoneyWasted = document.getElementById("moneyWastedLabel");
const buttonChangeAnimation = document.getElementById("animationButton");
const labelAnimation = document.getElementById("labelAnimationButton");
const inputWeeklyReduction = document.getElementById("fluppenReduction");


//misc
const cigarettePileImage = document.querySelector(".cigarettePileImage");
const ashImage = document.querySelector(".singleFluppeAsh");
const burningImage = document.querySelector(".singleFluppeBurning");
const phraseText = document.getElementById("phrase");
const resetLocalStorage = document.getElementById("resetLS");
const resetHistory = document.getElementById("resetHistory");
const testHistory = document.getElementById("testHistory");
const chartCanvas = document.getElementById("historyChart");
const historyData = loadData("history", []);



// Startup
function init() {
    count = loadData("count", 0)
    dailyLimit = loadData("dailyLimit", 0);
    cigarettePrice = loadData("cigarettePrice", 0);
    selectedAnimation = loadData("selectedAnimation", "lung")
    oldPercent = Number(loadData("oldPercent", -82));
    weeklyReduction = loadData("weeklyReduction", 0);
    labelCountCigarette.textContent = count;
    labelDailyLimit.textContent = dailyLimit;
    labelMoneyWasted.textContent = calculateMoneyWasted();
    inputDailyLimit.value = dailyLimit;
    inputCigarettePrice.value = cigarettePrice;

    resetIfNewDay();
    showAnimation();
    princessTreatment();
}



// Storage helper

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



// Navigation

function toggleMenu () {
    menu.classList.toggle("active");
    menuOverlay.classList.toggle("hidden");
};

menuOverlay.addEventListener("click", function() {
    toggleMenu();
});

navHome.addEventListener("click", function() {
    mainPage.classList.remove("hidden");
    settingsPage.classList.add("hidden");
    statsPage.classList.add("hidden");
    toggleMenu();
});

navSettings.addEventListener("click", function() {
    mainPage.classList.add("hidden");
    settingsPage.classList.remove("hidden");
    statsPage.classList.add("hidden");
    toggleMenu();
});

navStats.addEventListener("click", function() {
    mainPage.classList.add("hidden");
    settingsPage.classList.add("hidden");
    statsPage.classList.remove("hidden");
    toggleMenu();
    if (typeof Chart !== "undefined") {
        const [labels, values] = extractHistoryChart();
        updateChart(labels, values);
    }
});

settingsIcon.addEventListener("click", toggleMenu);



// Counter

// Fluppen Button
ButtonCountCigarette.addEventListener("click", function () {
    count += 1;
    labelCountCigarette.textContent = count;
    labelMoneyWasted.textContent = calculateMoneyWasted();
    saveData("count", count);
    showAnimation();
    princessTreatment(); 
});

// update max fluppen
inputDailyLimit.addEventListener("change", function() {
    dailyLimit = Number(inputDailyLimit.value);
    labelDailyLimit.textContent = dailyLimit;
    saveData("dailyLimit", dailyLimit);
});

inputCigarettePrice.addEventListener("change", function() {
    cigarettePrice = Number(inputCigarettePrice.value);
    saveData("costFluppe", cigarettePrice);
    labelMoneyWasted.textContent = calculateMoneyWasted();
});

inputWeeklyReduction.addEventListener("change", function() {
    weeklyReduction = Number(inputWeeklyReduction.value);
    saveData("fluppenReduction", weeklyReduction);
});

function calculateMoneyWasted() {
    let temp = 0;
    let hCount;
    cigarettePrice = loadData("costFluppe", 0);
    for (let obj of historyData){
        hCount = Number(obj["count"]);
        temp += hCount;   
    }
    moneyWasted = (temp + count) * cigarettePrice;
    moneyWasted = moneyWasted.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
    return moneyWasted
};



// Animation

buttonChangeAnimation.addEventListener("click", function() {
    if (selectedAnimation == "lung") {
        selectedAnimation = "cigarette";
    }
    else selectedAnimation = "lung"
    showAnimation();
    saveData("selectedAnimation", selectedAnimation)
});

function calculatePercent (startpos = 100) {
    let aniCount = Math.min(count, dailyLimit);
    let percent = startpos - (aniCount / dailyLimit) * startpos;
    return percent
}

function updateLungAnimation () {
    percent = calculatePercent()
    cigarettePileImage.style.transform = `translateY(${percent}%)`;
};

function updateCigaretteAnimation () {          //burningImage opacity not working as intended
    percent = -(calculatePercent(82));
    if (percent != oldPercent) {
        burningImage.style.opacity = 1;
        ashImage.style.opacity = 0;
    }
    else if (percent === -82) {
        burningImage.style.opacity = 0;
        ashImage.style.opacity = 0;
    }
    ashImage.style.transform = `translateY(${percent}%)`;
    burningImage.style.transform = `translateY(${percent}%)`;

    oldPercent = percent;
    saveData("oldPercent", oldPercent)
};

burningImage.addEventListener('transitionend', function () {
    burningImage.style.opacity = 0;
    ashImage.style.opacity = 1;
});

function showAnimation() {
    if (selectedAnimation == "cigarette") {
        lungAnimation.classList.add("hidden");
        cigaretteAnimation.classList.remove("hidden");
        labelAnimation.textContent = "cigarette"
        updateCigaretteAnimation()
    }
    else {
        lungAnimation.classList.remove("hidden");
        cigaretteAnimation.classList.add("hidden");
        labelAnimation.textContent = "lung";
        updateLungAnimation()
    }
};



// Phrases

// scolding phrases, neatly displayed on failure
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
    "Out of breath? Your budding COPD is showing.",
    "I can't believe you've done that.",
    "Oh my god. Just stop, okay?",
    "Why are you so weak?",
    ":("
];

function princessTreatment() {
    if (count > dailyLimit) {
        dangerContainer.classList.remove("hidden");
        phraseText.textContent = getNextPhrase();
    }
};

function getNextPhrase() {
    phraseIndex = loadData("index", 0);
    shuffledPhrases = loadData("shuffledPhrases", []);
    if (shuffledPhrases.length === 0) {
        shuffledPhrases = shuffle(meanPhrases);};
    const phrase = shuffledPhrases[phraseIndex];
    phraseIndex = (phraseIndex + 1) % shuffledPhrases.length;
    saveData("index", phraseIndex);
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



// History and Chart

function updateHistory() {
    const historyData = loadData("history", []);
    historyData.push({ "time": loadData("lastDate", new Date().toDateString()), "count": count });
    saveData("history", historyData);
};

function extractHistoryChart() {
    const labelDate = [];
    const countData = [];
    for (let obj of historyData) {
        labelDate.push(obj["time"]);
        countData.push(obj["count"]);
    }
    return [labelDate, countData];
}

//------------------- Chart ----------------
if (typeof Chart !== "undefined") {

    const historyChart = new Chart(chartCanvas, {
    type: "bar",
    data: {
        labels: [],
        datasets: [
                {
                label: "Count per day",
                data: [],
                borderColor: "#999",
                borderWidth: 1,
                borderRadius: 5,
                borderSkipped: false,
                maxBarThickness: 28,
                backgroundColor: "#f5f5f5",
                },
            ],
    },

    options: {
        scales: {
        y: { beginAtZero: true },
        },
    },
    },);

    function updateChart(newLabels, newValues) {
    historyChart.data.labels = newLabels;
    historyChart.data.datasets[0].data = newValues;
    historyChart.update();
    };
};



// Settings and reset

document.addEventListener("visibilitychange", function() {
    if(document.visibilityState === "visible") {
        resetIfNewDay();
        showAnimation();
    }
});

buttonFootnote.addEventListener("click", function() {
    quote.classList.toggle("hidden");
    moneyWastedContainer.classList.toggle("hidden");
    if (quote.classList.contains("hidden")) {
        labelFootnote.textContent = "wasted money";
        labelMoneyWasted.textContent = calculateMoneyWasted();
    }
    else labelFootnote.textContent = "quote";
});

function resetIfNewDay() {
    const today = new Date().toDateString();
    if (loadData("lastDate", null) !== today) {
        dangerContainer.classList.add("hidden");
        updateHistory();
        count = 0;
        phraseIndex = 0;
        oldPercent = -82;
        labelCountCigarette.textContent = count;
        shuffledPhrases = shuffle(meanPhrases);
        saveData("lastDate", today);
        saveData("count", count);
        saveData("phraseIndex", phraseIndex);
        saveData("shuffledPhrases", shuffledPhrases);
        saveData("oldPercent", oldPercent);
        if (today.slice(0,3) === "Mon") {
            dailyLimit -= Number(weeklyReduction);
            labelDailyLimit.textContent = dailyLimit;
            saveData("dailyLimit", dailyLimit);
        }
    }
};

resetLocalStorage.addEventListener("click", function () {
    localStorage.removeItem("count");
    localStorage.removeItem("dailyLimit");
    localStorage.removeItem("maxFluppe");
    localStorage.removeItem("lastDate");
    localStorage.removeItem("phraseIndex");
    localStorage.removeItem("index");
    count = 0;
    labelCountCigarette.textContent = count;
    dailyLimit = 0;
    labelDailyLimit.textContent = dailyLimit;
    }
);

resetHistory.addEventListener("click", function() {
    localStorage.removeItem("history")
});

testHistory.addEventListener("click", function() {
    if (loadData("history").length === 0) {
        localStorage.setItem("history", JSON.stringify([{"time":"Mon Nov 09 2026","count":10}, {"time":"Sun Nov 08 2026","count":14}, {"time":"Sat Nov 07 2026","count":8}])); 
    }
});



// for future feature, where weekly avarage cigarette count is used as dailyLimit NOT TESTED
function getHistoryWeekCount () {
    const todayDay = today.slice(8, 10)
    let weekCount;
    let i = 7;
    if (historyData.length >= 7) {
        let historySlice = historyData.slice(-7)
        for (let obj of historySlice) {
            let hDay = obj[0];
            if (hDay.slice(8,10) == todayDay - 1) {
                let hCount = Number(obj[1]);
                weekCount += hCount;
            }
            else i -= 1;
            todayDay -= 1;
        }
        const averageCount = weekCount / i;
        return averageCount
    }
}



init();