const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Application State
let score = 0;
let speedMultiplier = 1;
let gameOver = false;
let frameCount = 0;

// Base/Turret variables
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let turretAngle = 0;

// Rapid Fire Controls
let isMouseDown = false;
let shootCooldown = 0;
const FIRE_RATE = 8; // Lower number = faster firing rate.

// Mouse Tracking for interaction
const mouse = { x: centerX, y: centerY };
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

// Track mouse down and up for rapid fire
canvas.addEventListener('mousedown', () => { isMouseDown = true; });
canvas.addEventListener('mouseup', () => { isMouseDown = false; });
canvas.addEventListener('mouseleave', () => { isMouseDown = false; }); 

// Arrays for multiple objects
let lasers = [];
let enemies = [];

// Audio generation (Web Audio API)
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playShootSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.1); 
    
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime); 
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

function spawnEnemy() {
    const angle = Math.random() * Math.PI * 2;
    const distance = canvas.width; 
    enemies.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        baseRadius: 15,
        radius: 15,
        speed: (Math.random() * 1.2 + 0.4) // Slightly slowed down base movement speed too
    });
}

// Main Update Loop
function update() {
    if (gameOver) return;
    frameCount++;

    // Creativity: Speed changes based on score
    speedMultiplier = 1 + (score / 150); // Slowed down how fast things accelerate

    // GEOMETRY: Simulating rotation - Calculate angle between base and mouse
     turretAngle = Math.atan2(mouse.y - centerY, mouse.x - centerX);

    // Handle Rapid Fire Shooting Logic
    if (shootCooldown > 0) {
        shootCooldown--; 
    }

    if (isMouseDown && shootCooldown === 0) {
        playShootSound();
        lasers.push({
            x: centerX,
            y: centerY,
            dx: Math.cos(turretAngle) * 8, 
            dy: Math.sin(turretAngle) * 8, 
            radius: 3
        });
        shootCooldown = FIRE_RATE; 
    }

    // Update Lasers
    for (let i = lasers.length - 1; i >= 0; i--) {
        // GEOMETRY: Moving the object
        lasers[i].x += lasers[i].dx;
        lasers[i].y += lasers[i].dy;

        if (lasers[i].x < 0 || lasers[i].x > canvas.width || lasers[i].y < 0 || lasers[i].y > canvas.height) {
            lasers.splice(i, 1);
        }
    }

    // Update Enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const angleToCenter = Math.atan2(centerY - enemy.y, centerX - enemy.x);
        
        // GEOMETRY: Moving the object towards the center
        enemy.x += Math.cos(angleToCenter) * enemy.speed * speedMultiplier;
        enemy.y += Math.sin(angleToCenter) * enemy.speed * speedMultiplier;

        // GEOMETRY: Changing its size - enemies pulsate as they move
        enemy.radius = enemy.baseRadius + Math.sin(frameCount * 0.1) * 3;

        // RASTERIZATION: Overlapping - Check collision between enemy and Base
        const distToBase = Math.hypot(enemy.x - centerX, enemy.y - centerY);
        if (distToBase < enemy.radius + 20) {
            gameOver = true; 
        }

        // RASTERIZATION: Overlapping - Check collision between Lasers and Enemy
        for (let j = lasers.length - 1; j >= 0; j--) {
            const laser = lasers[j];
            const distToLaser = Math.hypot(enemy.x - laser.x, enemy.y - laser.y);
            
            if (distToLaser < enemy.radius + laser.radius) {
                score += 10;
                enemies.splice(i, 1); 
                lasers.splice(j, 1);  
                break; 
            }
        }
    }

    // --- SPAWN RATE ADJUSTMENT ---
    // Start with a 120-frame delay (~2 seconds), and never drop below a 35-frame delay.
    let spawnRate = Math.max(35, 120 - (score / 2)); 
    
    if (frameCount % Math.floor(spawnRate) === 0) {
        spawnEnemy();
    }
}

// Main Draw Loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // RASTERIZATION: Layering - Draw from back to front
    
    // Layer 1: Forcefield Base
    // RASTERIZATION: Transparency - Using globalAlpha for the shield
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#00ffcc';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0; 

    // Layer 2: Lasers
    ctx.fillStyle = '#ff0055';
    lasers.forEach(laser => {
        ctx.beginPath();
        ctx.arc(laser.x, laser.y, laser.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // Layer 3: Enemies
    ctx.fillStyle = '#9900ff';
    ctx.strokeStyle = '#fff';
    enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    });

    // Layer 4: The Turret
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(turretAngle); // GEOMETRY: Applying the rotation state to the canvas
    
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(-10, -10, 20, 20); 
    ctx.fillRect(10, -4, 15, 8); 
    
    ctx.restore();

    // Layer 5: UI
    ctx.fillStyle = '#00ffcc';
    ctx.font = '20px Courier New';
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`Threat Lvl: ${speedMultiplier.toFixed(1)}`, 420, 30);

    if (gameOver) {
        // RASTERIZATION: Transparency - dimming the background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ff0055';
        ctx.font = '40px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('BASE DESTROYED', centerX, centerY - 20);
        
        ctx.fillStyle = '#00ffcc';
        ctx.font = '20px Courier New';
        ctx.fillText(`Final Score: ${score}`, centerX, centerY + 20);
        ctx.fillText('Refresh page to restart', centerX, centerY + 60);
    }
}

function loop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(loop);
    }
}

loop();