// Coordinate and Color Mapping for Interpolation
const shapes = [
    { p: [[50,0], [50,0], [100,100], [100,100], [50,100], [0,100], [0,100], [50,0]], c: [0, 229, 255] },     // Triangle
    { p: [[0,0], [50,0], [100,0], [100,50], [100,100], [50,100], [0,100], [0,50]], c: [181, 0, 255] },       // Square
    { p: [[50,0], [50,0], [100,38], [100,38], [82,100], [18,100], [0,38], [0,38]], c: [255, 122, 0] },       // Pentagon
    { p: [[50,0], [100,25], [100,25], [100,75], [50,100], [50,100], [0,75], [0,25]], c: [0, 255, 87] },      // Hexagon
    { p: [[30,0], [70,0], [100,30], [100,70], [70,100], [30,100], [0,70], [0,30]], c: [255, 0, 85] }         // Circle
];

let ticking = false;

const updateScrollVisuals = () => {
    const scrollTop = window.scrollY;
    // Calculate total scrollable area
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    // Determine progress as a ratio between 0 and 1
    let scrollProgress = scrollTop / maxScroll;
    scrollProgress = Math.max(0, Math.min(1, scrollProgress)); // Clamp value
    
    // --- 1. Edge Lights Animation ---
    const lightLines = document.querySelectorAll('.light-line');
    // SVG pathLength is 100. Offset from 100 down to 0 draws the line.
    const offset = 100 - (scrollProgress * 100);
    lightLines.forEach(line => {
        line.style.strokeDashoffset = offset;
    });

    // --- 2. Shape Morphing Interpolation ---
    const numShapes = shapes.length;
    const scaledProgress = scrollProgress * (numShapes - 1);
    
    const currentIndex = Math.floor(scaledProgress);
    const nextIndex = Math.min(currentIndex + 1, numShapes - 1);
    // Determine progress between just the current and next shape
    const localProgress = scaledProgress - currentIndex; 

    const currentShape = shapes[currentIndex];
    const nextShape = shapes[nextIndex];

    // Mathematical coordinate blending
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

    // RGB color blending
    const r = Math.round(currentShape.c[0] + (nextShape.c[0] - currentShape.c[0]) * localProgress);
    const g = Math.round(currentShape.c[1] + (nextShape.c[1] - currentShape.c[1]) * localProgress);
    const b = Math.round(currentShape.c[2] + (nextShape.c[2] - currentShape.c[2]) * localProgress);
    const interpolatedColor = `rgb(${r}, ${g}, ${b})`;

    // Apply exact frame properties
    const shapeEl = document.getElementById('geometry-morph');
    shapeEl.style.clipPath = polygonString;
    shapeEl.style.backgroundColor = interpolatedColor;
    
    // Sync the edge light color to match the current morphing shape
    const edgeLights = document.querySelector('.edge-lights');
    edgeLights.style.stroke = interpolatedColor;
    edgeLights.style.filter = `drop-shadow(0 0 10px rgba(${r}, ${g}, ${b}, 0.8))`;
    
    ticking = false;
};

// Event listener optimized for render frames
document.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateScrollVisuals);
        ticking = true;
    }
});

// Run once on load to establish the initial visual state
window.requestAnimationFrame(updateScrollVisuals);
