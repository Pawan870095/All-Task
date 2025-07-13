const container = document.querySelector(".ticks");
for (let i = 1; i <= 60; i++) {
    const tick = document.createElement("div");
    tick.className = "tick";
    tick.style.setProperty("--i", i);
    if (i % 5 === 0) {
        tick.classList.add("major");
    } else {
        tick.classList.add("minor");
    }
    container.appendChild(tick);
}

// ----------------------------------------------------------------

const digitalScreen = document.getElementById("digi-screen");
const playPauseBtn = document.getElementById("pause-play");
const resetBtn = document.getElementById("reset");
const lapBtn = document.getElementById("record-lap");

const screenHr = document.getElementById("hrs");
const screenMin = document.getElementById("mins");
const screenSec = document.getElementById("secs");
const screenMs = document.getElementById("milis");
const startBtn = document.getElementById("start");

const hand = document.querySelector(".hand");

let timeElapsed = 0;
let intervalId = null;
let startTime = 0;
const refreshTime = 10;
let isPaused = false;
const laps = [];

function miliToOthers(miliseconds) {
    const hours = Math.floor(miliseconds / 3600000);
    const minutes = Math.floor((miliseconds % 3600000) / 60000);
    const seconds = Math.floor((miliseconds % 60000) / 1000);
    const milliseconds = Math.floor(miliseconds % 1000);
    return {hours, minutes, seconds, milliseconds};
}

function startTimer() {
    startBtn.style.display = "none";
    playPauseBtn.style.display = "block";
    resetBtn.style.display = "block";
    lapBtn.style.display = "block";

    startTime = Date.now();
    intervalId = setInterval(() => {
        timeElapsed = Date.now() - startTime;

        const {hours, minutes, seconds, milliseconds} = miliToOthers(timeElapsed);
        screenHr.textContent = hours.toString().padStart(2, "0");
        screenMin.textContent = minutes.toString().padStart(2, "0");
        screenSec.textContent = seconds.toString().padStart(2, "0");
        screenMs.textContent = milliseconds.toString().padStart(3, "0");

        // Use total timeElapsed, not just the milliseconds component
        const angle = (timeElapsed % 60000) * (360 / 60000); // Rotate over 60s
        hand.style.transform = `rotate(${angle - 180}deg)`;
    }, refreshTime);
}

function pauseOrResume() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        playPauseBtn.textContent = "Resume";
    } else {
        playPauseBtn.textContent = "Pause";
        startTime = Date.now() - timeElapsed;
        intervalId = setInterval(() => {
            timeElapsed = Date.now() - startTime;
            const {hours, minutes, seconds, milliseconds} =
                miliToOthers(timeElapsed);
            screenHr.textContent = hours.toString().padStart(2, "0");
            screenMin.textContent = minutes.toString().padStart(2, "0");
            screenSec.textContent = seconds.toString().padStart(2, "0");
            screenMs.textContent = milliseconds.toString().padStart(3, "0");

            // Use total timeElapsed, not just the milliseconds component
            const angle = (timeElapsed % 60000) * (360 / 60000); // Rotate over 60s
            hand.style.transform = `rotate(${angle - 180}deg)`;
        }, refreshTime);
    }
}

function resetTimer() {
    startBtn.style.display = "block";
    playPauseBtn.style.display = "none";
    resetBtn.style.display = "none";
    lapBtn.style.display = "none";
    clearInterval(intervalId);
    timeElapsed = 0;
    screenHr.textContent = "00";
    screenMin.textContent = "00";
    screenSec.textContent = "00";
    screenMs.textContent = "000";
    laps.splice(0, laps.length);
    hand.style.transform = `rotate(${-180}deg)`;

    document.querySelector(".laps-data table > tbody").innerHTML = "";
}

function recordLap() {
    laps.push(timeElapsed);

    const lastLap = laps[laps.length - 1];
    const {hours, minutes, seconds, milliseconds} = miliToOthers(lastLap);
    const lapTime = document.createElement("tr");
    lapTime.innerHTML = `
        <td>${laps.length}</td>
        <td>${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${milliseconds
        .toString()
        .padStart(3, "0")}</td>
        <td>${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${milliseconds
        .toString()
        .padStart(3, "0")}</td>
    `;
    document.querySelector(".laps-data table > tbody").appendChild(lapTime);
}

startBtn.addEventListener("click", startTimer);
playPauseBtn.addEventListener("click", pauseOrResume);
resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", recordLap);
