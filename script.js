let count, history, maxFluppe, index, shuffledPhrases;

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


//Counting and displaying value
const buttonFluppe = document.getElementById("fluppenCounter");
const labelFluppe = document.getElementById("countLabel");
const maxInput = document.getElementById("maxInput");
const labelMax = document.getElementById("maxLabel");

//misc
const fluppenBergIMG = document.querySelector(".fluppenBerg");
const phrase = document.getElementById("phrase");
const resetLS = document.getElementById("resetLS");
const ctx = document.getElementById("testChart");




//EventListener
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
    saveData("count", count);
    getMoving();
    princessTreatment();  
});

function updateHistory() {
    const historyData = loadData("history", []);
    historyData.push({ "time": loadData("lastDate", new Date().toDateString()), "count": count });
    saveData("history", historyData);
}

// reset locaStorage
resetLS.addEventListener("click", function () {
    localStorage.removeItem("count");
    localStorage.removeItem("maxFluppe");
    localStorage.removeItem("history");
    localStorage.removeItem("lastDate");
    localStorage.removeItem("index");
    count = 0;
    labelFluppe.textContent = count;
    maxFluppe = 0;
    labelMax.textContent = maxFluppe;
    //    localStorage.setItem("lastDate", "Fri Nov 06 2026")
    /*/ test history 
    localStorage.setItem("history", JSON.stringify([{"time":"Mon Nov 09 2026","count":10}, {"time":"Sun Nov 08 2026","count":14}, {"time":"Sat Nov 07 2026","count":8}])); 
    */
    }
);


// ClassList thingy to display different pages
// nothing to see here, just perfectly written and efficient code
// TODO add navStats
function toggleNav () {
    menu.classList.toggle("active");
}

navHome.addEventListener("click", function() {
    mainPage.classList.remove("hidden");
    settingsPage.classList.add("hidden");
    statsPage.classList.add("hidden");
    toggleNav();
});

navSettings.addEventListener("click", function() {
    mainPage.classList.add("hidden");
    settingsPage.classList.remove("hidden");
    statsPage.classList.add("hidden");
    toggleNav();
});

navStats.addEventListener("click", function() {
    mainPage.classList.add("hidden");
    settingsPage.classList.add("hidden");
    statsPage.classList.remove("hidden");
    toggleNav();

    const [labels, values] = extractHistory();
    updateChart(labels, values);
    myChart.resize();
})

// update max fluppen
maxInput.addEventListener("change", function() {
    maxFluppe = Number(maxInput.value);
    labelMax.textContent = maxFluppe;
    saveData("maxFluppe", maxFluppe);
});

settingsIcon.addEventListener("click", toggleNav);



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
        updateHistory();
        count = 0;
        labelFluppe.textContent = count;
        shuffledPhrases = shuffle(meanPhrases);
        saveData("lastDate", today);
        saveData("count", count);
        saveData("shuffledPhrases", shuffledPhrases);   
    }
};


// calculate transition for animation
function getMoving () {
    let percent = 100 - (count / maxFluppe) * 100;
    if(percent >= 0 && percent <= 100){
    fluppenBergIMG.style.transform = `translateY(${percent}%)`;
    }
};

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
    if (count > maxFluppe) {
        dangerContainer.classList.remove("hidden");
        phrase.textContent = nextPhrase();
    }
};


// TODO add function that calculates spend money
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

function extractHistory() {
    const historyData = loadData("history", []);
    const labelDate = [];
    const countData = [];
    for (let obj of historyData) {
        labelDate.push(obj["time"]);
        countData.push(obj["count"]);
    }
    return [labelDate, countData];
}

if (typeof Chart !== "undefined") {

    const myChart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: [],
        datasets: [
                {
                label: "Count per day",
                data: [],
                borderColor: "#999",
                borderWidth: 1,
                borderRadius: 3,
                borderSkipped: false,
                maxBarThickness: 28,
                backgroundColor: function (context) {
                const bar = context.element;
                if (!bar || typeof bar.getProps !== "function") return "#f5f5f0";  // no real bar (for example the legend)

                const { ctx } = context.chart;
                const { y, base } = bar.getProps(["y", "base"], true);
                if (y === base) return "#f5f5f0";   // bar has no height yet

                const g = ctx.createLinearGradient(0, base, 0, y);
                g.addColorStop(0,    "#e8a24a");  // filter
                g.addColorStop(0.18, "#e8a24a");
                g.addColorStop(0.18, "#b9722a");  // thin line
                g.addColorStop(0.20, "#b9722a");
                g.addColorStop(0.20, "#f5f5f0");  // paper
                g.addColorStop(0.92, "#f5f5f0");
                g.addColorStop(0.92, "#ff5a1f");  // glowing end
                g.addColorStop(1,    "#ff5a1f");
                return g;
                },
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
        myChart.data.labels = newLabels;
        myChart.data.datasets[0].data = newValues;
        myChart.update();
    };


}



count = loadData("count", 0)
maxFluppe = loadData("maxFluppe", 0);
labelFluppe.textContent = count;
labelMax.textContent = maxFluppe;
maxInput.value = maxFluppe;
checkReset();
getMoving();
princessTreatment()