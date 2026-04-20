const audio = document.getElementById('myAudio');
const playPauseBtn = document.getElementById('playPauseBtn');
const songTitle = document.getElementById('songTitle');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const muteBtn = document.getElementById('muteBtn');
const loopBtn = document.getElementById('loopBtn');
const volumeSlider = document.getElementById('volumeSlider');
const speedSlider = document.getElementById('speedSlider');
const speedVal = document.getElementById('speedVal');
const timeDisplay = document.getElementById('timeDisplay');

const playlist = [
    { title: "Track 01", file: "track1.mp3" },
    { title: "Track 02", file: "track2.mp3" },
    { title: "Track 03", file: "track3.mp3" }
];

let currentTrackIndex = 0;

function loadTrack(index) {
    currentTrackIndex = index;
    audio.src = playlist[currentTrackIndex].file;
    songTitle.textContent = playlist[currentTrackIndex].title;
    audio.play();
    playPauseBtn.innerHTML = '⏸'; 
}

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.innerHTML = '⏸';
    } else {
        audio.pause();
        playPauseBtn.innerHTML = '▶';
    }
});

nextBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
});

prevBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
});

muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? "Unmute" : "Mute";
    volumeSlider.value = audio.muted ? 0 : audio.volume;
});

loopBtn.addEventListener('click', () => {
    audio.loop = !audio.loop;
    loopBtn.style.background = audio.loop ? "#38bdf8" : "#334155";
    loopBtn.style.color = audio.loop ? "#0f172a" : "white";
});

volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

speedSlider.addEventListener('input', (e) => {
    audio.playbackRate = e.target.value;
    speedVal.textContent = e.target.value;
});

audio.addEventListener('timeupdate', () => {
    let mins = Math.floor(audio.currentTime / 60);
    let secs = Math.floor(audio.currentTime % 60);
    timeDisplay.textContent = `${mins}:${secs < 10 ? '0' + secs : secs}`;
});

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        
        e.preventDefault(); 
        if (audio.paused) {
            audio.play();
            playPauseBtn.innerHTML = '⏸';
        } else {
            audio.pause();
            playPauseBtn.innerHTML = '▶';
        }
    }
});