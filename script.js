// Coordinate and Color Mapping for Interpolation
const shapes = [
    { p: [[50,0], [50,0], [100,100], [100,100], [50,100], [0,100], [0,100], [50,0]], c: [0, 229, 255] },     // Triangle
    { p: [[0,0], [50,0], [100,0], [100,50], [100,100], [50,100], [0,100], [0,50]], c: [181, 0, 255] },       // Square
    { p: [[50,0], [50,0], [100,38], [100,38], [82,100], [18,100], [0,38], [0,38]], c: [255, 122, 0] },       // Pentagon
    { p: [[50,0], [100,25], [100,25], [100,75], [50,100], [50,100], [0,75], [0,25]], c: [0, 255, 87] },      // Hexagon
    { p: [[30,0], [70,0], [100,30], [100,70], [70,100], [30,100], [0,70], [0,30]], c: [255, 0, 85] }         // Circle
];

let targetScroll = 0;
let currentScroll = 0;
let isAnimating = false;

// DOM Elements
const shapeEl = document.getElementById('geometry-morph');
const glowEl = document.getElementById('geometry-glow');
const edgeLights = document.getElementById('edge-glow');
const originSpot = document.querySelector('.origin-spot');
const destSpot = document.getElementById('dest-spot');
const lightLines = document.querySelectorAll('.light-line');
const subheadings = document.querySelectorAll('.subheading');
const primaryButtons = document.querySelectorAll('.primary-btn');

// --- Intersection Observer for Text Fade-Ins ---
const setupObserver = () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });
};

// --- Main Render Loop ---
window.addEventListener('scroll', () => {
    targetScroll = window.scrollY;
    
    if (!isAnimating) {
        isAnimating = true;
        window.requestAnimationFrame(renderLoop);
    }
});

const renderLoop = () => {
    currentScroll += (targetScroll - currentScroll) * 0.35;
    
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    // The 1.02 multiplier buffers against fractional pixel discrepancies, forcing the value to 100%
    let scrollProgress = (currentScroll / maxScroll) * 1.02;
    scrollProgress = Math.max(0, Math.min(1, scrollProgress)); 

    // Edge Lights Tracing
    const offset = 100 - (scrollProgress * 100);
    lightLines.forEach(line => {
        line.style.strokeDashoffset = offset;
    });

    // Shape Morphing Interpolation
    const numShapes = shapes.length;
    const scaledProgress = scrollProgress * (numShapes - 1);
    
    const currentIndex = Math.floor(scaledProgress);
    const nextIndex = Math.min(currentIndex + 1, numShapes - 1);
    const localProgress = scaledProgress - currentIndex; 

    const currentShape = shapes[currentIndex];
    const nextShape = shapes[nextIndex];

    let polygonString = 'polygon(';
    for (let i = 0; i < 8; i++) {
        const cx = currentShape.p[i][0];
        const cy = currentShape.p[i][1];
        const nx = nextShape.p[i][0];
        const ny = nextShape.p[i][1];
        
        const x = cx + (nx - cx) * localProgress;
        const y = cy + (ny - cy) * localProgress;
        
        polygonString += `${x}% ${y}%`;
        if (i < 7) polygonString += ', ';
    }
    polygonString += ')';

    const r = Math.round(currentShape.c[0] + (nextShape.c[0] - currentShape.c[0]) * localProgress);
    const g = Math.round(currentShape.c[1] + (nextShape.c[1] - currentShape.c[1]) * localProgress);
    const b = Math.round(currentShape.c[2] + (nextShape.c[2] - currentShape.c[2]) * localProgress);
    
    const interpolatedColor = `rgb(${r}, ${g}, ${b})`;

    // Apply Visuals
    shapeEl.style.clipPath = polygonString;
    shapeEl.style.backgroundColor = interpolatedColor;
    
    glowEl.style.clipPath = polygonString;
    glowEl.style.backgroundColor = interpolatedColor;

    edgeLights.style.stroke = interpolatedColor;
    originSpot.style.fill = interpolatedColor;
    edgeLights.style.filter = `drop-shadow(0 0 15px ${interpolatedColor})`;

    // Destination Node Logic
    if (scrollProgress >= 1) {
        destSpot.style.opacity = '1';
        destSpot.style.fill = interpolatedColor;
        destSpot.style.filter = `drop-shadow(0 0 10px ${interpolatedColor})`;
    } else {
        destSpot.style.opacity = '0';
    }

    // Sync Text Accents and Buttons
    subheadings.forEach(sub => sub.style.color = interpolatedColor);
    primaryButtons.forEach(btn => {
        btn.style.backgroundColor = interpolatedColor;
        btn.style.boxShadow = `0 0 20px rgba(${r}, ${g}, ${b}, 0.5)`;
    });

    if (Math.abs(targetScroll - currentScroll) > 0.5) {
        window.requestAnimationFrame(renderLoop);
    } else {
        isAnimating = false;
    }
};

// Initialize
window.requestAnimationFrame(() => {
    targetScroll = window.scrollY;
    currentScroll = window.scrollY;
    isAnimating = true;
    setupObserver();
    renderLoop();
});
