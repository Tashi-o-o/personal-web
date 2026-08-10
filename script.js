const shapes = [
    { p: [[50,0], [50,0], [100,100], [100,100], [50,100], [0,100], [0,100], [50,0]], c: [0, 229, 255] },
    { p: [[0,0], [50,0], [100,0], [100,50], [100,100], [50,100], [0,100], [0,50]], c: [181, 0, 255] },
    { p: [[50,0], [50,0], [100,38], [100,38], [82,100], [18,100], [0,38], [0,38]], c: [255, 122, 0] },
    { p: [[50,0], [100,25], [100,25], [100,75], [50,100], [50,100], [0,75], [0,25]], c: [0, 255, 87] },
    { p: [[30,0], [70,0], [100,30], [100,70], [70,100], [30,100], [0,70], [0,30]], c: [255, 0, 85] }
];

// System State
let targetScroll = 0;
let currentScroll = 0;
let isAnimating = false;
let maxScroll = 0;
let resizeTimeout;

// DOM Elements
const shapeEl = document.getElementById('geometry-morph');
const glowEl = document.getElementById('geometry-glow');
const edgeLights = document.getElementById('edge-glow');
const originSpot = document.querySelector('.origin-spot');
const destSpot = document.getElementById('dest-spot');
const lightLines = document.querySelectorAll('.light-line');
const subheadings = document.querySelectorAll('.subheading');
const primaryButtons = document.querySelectorAll('.primary-btn');
const parallaxWrapper = document.getElementById('parallax-wrapper');
const navDots = document.querySelectorAll('.nav-dot');

// Accessibility Check
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// --- Window Resize Debounce ---
const calculateMetrics = () => {
    maxScroll = document.documentElement.scrollHeight - window.innerHeight;
};
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(calculateMetrics, 150);
});
calculateMetrics();

// --- Mouse Parallax ---
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

window.addEventListener('mousemove', (e) => {
    if (prefersReducedMotion.matches) return;
    // Normalize coordinates from -1 to 1
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = (e.clientY / window.innerHeight) * 2 - 1;
});

// --- Intersection Observers ---
const setupObserver = () => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.5 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Update side dot navigation
                const id = entry.target.parentElement.id;
                navDots.forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.getAttribute('data-target') === id) {
                        dot.classList.add('active');
                    }
                });
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
    if (!isAnimating && !prefersReducedMotion.matches) {
        isAnimating = true;
        window.requestAnimationFrame(renderLoop);
    }
});

const applyStaticVisuals = () => {
    // Fallback if reduced motion is enabled (skips interpolation loop)
    let scrollProgress = (window.scrollY / maxScroll) * 1.02;
    scrollProgress = Math.max(0, Math.min(1, scrollProgress));
    
    const numShapes = shapes.length;
    const scaledProgress = scrollProgress * (numShapes - 1);
    const currentIndex = Math.floor(scaledProgress);
    
    // Apply exact shape and color without morphing
    const cShape = shapes[currentIndex];
    let polygonString = 'polygon(';
    cShape.p.forEach((point, i) => {
        polygonString += `${point[0]}% ${point[1]}%${i < 7 ? ', ' : ''}`;
    });
    polygonString += ')';
    const colorStr = `rgb(${cShape.c[0]}, ${cShape.c[1]}, ${cShape.c[2]})`;
    
    shapeEl.style.clipPath = polygonString;
    shapeEl.style.backgroundColor = colorStr;
    glowEl.style.clipPath = polygonString;
    glowEl.style.backgroundColor = colorStr;
};

const renderLoop = () => {
    currentScroll += (targetScroll - currentScroll) * 0.35;
    
    // Parallax Interpolation
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;
    parallaxWrapper.style.transform = `translate(${currentX * 15}px, ${currentY * 15}px)`;
    
    let scrollProgress = (currentScroll / maxScroll) * 1.02;
    scrollProgress = Math.max(0, Math.min(1, scrollProgress)); 

    const offset = 100 - (scrollProgress * 100);
    lightLines.forEach(line => line.style.strokeDashoffset = offset);

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
        
        polygonString += `${x}% ${y}%${i < 7 ? ', ' : ''}`;
    }
    polygonString += ')';

    const r = Math.round(currentShape.c[0] + (nextShape.c[0] - currentShape.c[0]) * localProgress);
    const g = Math.round(currentShape.c[1] + (nextShape.c[1] - currentShape.c[1]) * localProgress);
    const b = Math.round(currentShape.c[2] + (nextShape.c[2] - currentShape.c[2]) * localProgress);
    
    const interpolatedColor = `rgb(${r}, ${g}, ${b})`;

    shapeEl.style.clipPath = polygonString;
    shapeEl.style.backgroundColor = interpolatedColor;
    
    glowEl.style.clipPath = polygonString;
    glowEl.style.backgroundColor = interpolatedColor;

    edgeLights.style.stroke = interpolatedColor;
    originSpot.style.fill = interpolatedColor;
    edgeLights.style.filter = `drop-shadow(0 0 15px ${interpolatedColor})`;

    if (scrollProgress >= 1) {
        destSpot.style.opacity = '1';
        destSpot.style.fill = interpolatedColor;
        destSpot.style.filter = `drop-shadow(0 0 10px ${interpolatedColor})`;
    } else {
        destSpot.style.opacity = '0';
    }

    subheadings.forEach(sub => sub.style.color = interpolatedColor);
    primaryButtons.forEach(btn => {
        btn.style.backgroundColor = interpolatedColor;
        btn.style.boxShadow = `0 0 20px rgba(${r}, ${g}, ${b}, 0.5)`;
    });
    navDots.forEach(dot => {
        if (dot.classList.contains('active')) {
            dot.style.borderColor = interpolatedColor;
        } else {
            dot.style.borderColor = 'transparent';
        }
    });

    if (Math.abs(targetScroll - currentScroll) > 0.5 || Math.abs(targetX - currentX) > 0.01) {
        window.requestAnimationFrame(renderLoop);
    } else {
        isAnimating = false;
    }
};

// --- Initialization ---
window.requestAnimationFrame(() => {
    targetScroll = window.scrollY;
    currentScroll = window.scrollY;
    setupObserver();
    
    if (prefersReducedMotion.matches) {
        applyStaticVisuals();
    } else {
        isAnimating = true;
        renderLoop();
    }
});
