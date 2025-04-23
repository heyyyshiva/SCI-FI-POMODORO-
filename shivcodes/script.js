let timeLeft;
let timerId = null;
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const timerDisplay = document.getElementById('timer');
const modeButtons = document.querySelectorAll('.mode-btn');
const dateDisplay = document.getElementById('date');

function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString('en-US', options);
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    // Update the flip clock display
    timerDisplay.innerHTML = `
        <span>${minutes.toString().padStart(2, '0')}</span>
        <span>${seconds.toString().padStart(2, '0')}</span>
    `;
}

function startTimer() {
    if (timerId === null) {
        startButton.textContent = 'Pause';
        timerId = setInterval(() => {
            timeLeft--;
            updateTimer();
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                startButton.textContent = 'Start';
                // Play notification sound or show notification here
            }
        }, 1000);
    } else {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    }
}

function resetTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
    const activeButton = document.querySelector('.mode-btn.active');
    timeLeft = parseInt(activeButton.dataset.time) * 60;
    updateTimer();
    startButton.textContent = 'Start';
}

modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        timeLeft = parseInt(button.dataset.time) * 60;
        updateTimer();
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
            startButton.textContent = 'Start';
        }
    });
});

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

// Initialize
resetTimer();
updateDate();
// Update date every minute
setInterval(updateDate, 60000);

const spotifyApi = {
    clientId: '69d243ba06524326b09ccb0f45c86b19',
    redirectUri: 'http://localhost:5500/callback.html', // Or your deployed URL

    init() {
        document.getElementById('spotify-login').addEventListener('click', () => {
            this.login();
        });
    },

    login() {
        const scope = 'user-read-playback-state user-modify-playback-state';
        const url = `https://accounts.spotify.com/authorize?client_id=${this.clientId}&response_type=token&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(scope)}`;
        window.location.href = url;
    }
};

// Initialize the timer and Spotify
document.addEventListener('DOMContentLoaded', () => {
    spotifyApi.init();
});