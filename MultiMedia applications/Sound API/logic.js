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
    { title: "Track 01", file: "audio1.mp3" },
    { title: "Track 02", file: "audio2.mp3" },
    { title: "Track 03", file: "audio3.mp3" }
];

let currentTrackIndex = 0;

function loadTrack(index) {
    currentTrackIndex = index;
    audio.src = playlist[currentTrackIndex].file;
    // Automatic title update
    songTitle.textContent = playlist[currentTrackIndex].title;
    audio.play();
    playPauseBtn.innerHTML = '⏸'; 
}

playPauseBtn.addEventListener('click', () => {
    //Dynamic change (title update)
    songTitle.textContent = playlist[currentTrackIndex].title
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

// Variable to store volume level before muting
let previousVolume = 1; 

muteBtn.addEventListener('click', () => {
    if (!audio.muted) {
        // 1. SAVE the current volume before muting
        previousVolume = audio.volume; 
        
        // 2. MUTE the audio
        audio.muted = true;
        muteBtn.textContent = "Unmute";
        volumeSlider.value = 0; // Move slider to zero visually
    } else {
        // 3. UNMUTE the audio
        audio.muted = false;
        muteBtn.textContent = "Mute";
        
        // 4. RESTORE the volume from our "memory bank"
        audio.volume = previousVolume;
        volumeSlider.value = previousVolume; // Move slider back to where it was
    }
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