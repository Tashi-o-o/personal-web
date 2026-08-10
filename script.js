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

const shapeEl = document.getElementById('geometry-morph');
const glowEl = document.getElementById('geometry-glow');
const edgeLights = document.getElementById('edge-glow');
const originSpot = document.querySelector('.origin-spot');
const lightLines = document.querySelectorAll('.light-line');

window.addEventListener('scroll', () => {
    targetScroll = window.scrollY;
    
    if (!isAnimating) {
        isAnimating = true;
        window.requestAnimationFrame(renderLoop);
    }
});

const renderLoop = () => {
    // Increased multiplier to 0.35 ensures the shape tracks tightly with the scroll snap, eliminating lag
    currentScroll += (targetScroll - currentScroll) * 0.35;
    
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    let scrollProgress = currentScroll / maxScroll;
    scrollProgress = Math.max(0, Math.min(1, scrollProgress)); 

    // --- 1. Edge Lights Tracing ---
    const offset = 100 - (scrollProgress * 100);
    lightLines.forEach(line => {
        line.style.strokeDashoffset = offset;
    });

    // --- 2. Shape Morphing Interpolation ---
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

    // --- 3. Apply Visuals and Bloom ---
    
    // Solid interior shape
    shapeEl.style.clipPath = polygonString;
    shapeEl.style.backgroundColor = interpolatedColor;
    
    // Background blurred shape (Hardware Accelerated Bloom)
    glowEl.style.clipPath = polygonString;
    glowEl.style.backgroundColor = interpolatedColor;

    // Edge Line and Spot Bloom synchronization
    edgeLights.style.stroke = interpolatedColor;
    originSpot.style.fill = interpolatedColor;
    edgeLights.style.filter = `drop-shadow(0 0 15px ${interpolatedColor})`;

    // --- 4. Render Loop Logic ---
    if (Math.abs(targetScroll - currentScroll) > 0.5) {
        window.requestAnimationFrame(renderLoop);
    } else {
        isAnimating = false;
    }
};

// Initialize the first frame
window.requestAnimationFrame(() => {
    targetScroll = window.scrollY;
    currentScroll = window.scrollY;
    isAnimating = true;
    renderLoop();
});
