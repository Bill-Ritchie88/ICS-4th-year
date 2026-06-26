const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');
const audio = document.getElementById('audioTrack');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const speedSlider = document.getElementById('speedSlider');
const speedVal = document.getElementById('speedVal');

// Set explicit canvas dimension scale
function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 250;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let animationSpeed = 1;
let angle = 0;

// Update animation speed modifier text
speedSlider.addEventListener('input', (e) => {
    animationSpeed = parseFloat(e.target.value);
    speedVal.textContent = `${animationSpeed}x`;
});

// Audio event hooks
playBtn.addEventListener('click', () => {
    audio.play();
});

pauseBtn.addEventListener('click', () => {
    audio.pause();
});

// Interactive Math-Driven Animation Loop (Visual Simulation of Waveforms)
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let waves = 5;
    let baseWaveHeight = audio.paused ? 15 : 45; // Height reacts dynamically if audio is playing

    for (let i = 0; i < waves; i++) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        // Dynamically change color tracks across the alpha spectrum
        ctx.strokeStyle = `rgba(79, 195, 247, ${1 - i * 0.15})`;
        
        for (let x = 0; x < canvas.width; x++) {
            // Complex trigonometric wave generation
            let y = canvas.height / 2 + 
                    Math.sin(x * 0.015 + angle + (i * 0.5)) * baseWaveHeight * Math.cos(angle * 0.5);
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }

    // Increment angle based on time frame metrics
    angle += 0.02 * animationSpeed;
    requestAnimationFrame(draw);
}

// Fire up the interactive render engine
draw();