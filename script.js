const shapes = [
    { p: [[50,0], [50,0], [100,100], [100,100], [50,100], [0,100], [0,100], [50,0]], c: [0, 229, 255] },
    { p: [[0,0], [50,0], [100,0], [100,50], [100,100], [50,100], [0,100], [0,50]], c: [181, 0, 255] },
    { p: [[50,0], [50,0], [100,38], [100,38], [82,100], [18,100], [0,38], [0,38]], c: [255, 122, 0] },
    { p: [[50,0], [100,25], [100,25], [100,75], [50,100], [50,100], [0,75], [0,25]], c: [0, 255, 87] },
    { p: [[30,0], [70,0], [100,30], [100,70], [70,100], [30,100], [0,70], [0,30]], c: [255, 0, 85] }
];

// Target VW positions for slides 1 through 5 (Left to Right movement)
const xPositions = [-25, 25, -25, 25, -25];

let targetScroll = 0;
let currentScroll = 0;
let isAnimating = false;

const shapeEl = document.getElementById('geometry-morph');
const glowEl = document.getElementById('geometry-glow');
const edgeLights = document.getElementById('edge-glow');
const originSpot = document.querySelector('.origin-spot');
const destSpot = document.getElementById('dest-spot');
const lightLines = document.querySelectorAll('.light-line');
const subheadings = document.querySelectorAll('.subheading');
const primaryButtons = document.querySelectorAll('.primary-btn');
const parallaxWrapper = document.getElementById('parallax-wrapper');
const liquidContainer = document.querySelector('.liquid-container');
const navDots = document.querySelectorAll('.nav-dot');
const fluidBlurEl = document.getElementById('fluid-blur');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Bulletproof height calculation preventing Division By Zero (NaN) errors
const getMaxScroll = () => {
    const lastSection = document.getElementById('contact');
    const computedScroll = lastSection ? lastSection.offsetTop : (document.documentElement.scrollHeight - window.innerHeight);
    return Math.max(1, computedScroll); 
};

let targetX = 0, targetY = 0;
let mouseX = 0, mouseY = 0;

window.addEventListener('mousemove', (e) => {
    if (prefersReducedMotion.matches) return;
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = (e.clientY / window.innerHeight) * 2 - 1;
});

const setupObserver = () => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
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

window.addEventListener('scroll', () => {
    targetScroll = window.scrollY;
    if (!isAnimating) {
        isAnimating = true;
        window.requestAnimationFrame(renderLoop);
    }
});

const renderLoop = () => {
    currentScroll += (targetScroll - currentScroll) * 0.35;
    
    // Dynamically calculate max height every frame to account for late CSS/Font loading
    const maxScroll = getMaxScroll();
    
    let scrollProgress = currentScroll / maxScroll;
    
    // Safety boundary clamping
    if (scrollProgress > 0.985) scrollProgress = 1;
    scrollProgress = Math.max(0, Math.min(1, scrollProgress)); 
    
    // Failsafe to ensure progress is a valid number
    if (isNaN(scrollProgress)) scrollProgress = 0;

    const numShapes = shapes.length;
    const scaledProgress = scrollProgress * (numShapes - 1);
    const currentIndex = Math.floor(scaledProgress);
    const nextIndex = Math.min(currentIndex + 1, numShapes - 1);
    const localProgress = scaledProgress - currentIndex; 

    // Extract horizontal position and fluid math
    const shapeX = xPositions[currentIndex] + (xPositions[nextIndex] - xPositions[currentIndex]) * localProgress;
    const fluidIntensity = prefersReducedMotion.matches ? 0 : Math.sin(localProgress * Math.PI);
    
    // Parallax Interpolation
    mouseX += (targetX - mouseX) * 0.1;
    mouseY += (targetY - mouseY) * 0.1;
    
    // Unified Transform coordinates mapping
    const viewportX = (shapeX * window.innerWidth) / 100;
    parallaxWrapper.style.transform = `translate(${viewportX + (mouseX * 15)}px, ${mouseY * 15}px)`;

    // Apply the Gooey Liquid Matrix
    if (fluidBlurEl) {
        fluidBlurEl.setAttribute('stdDeviation', fluidIntensity * 20);
    }
    
    // Stretch and Skew algorithms for fluid droplet physics
    const volumeCompensator = 1 + (fluidIntensity * 0.15);
    const skewAmount = (xPositions[nextIndex] - xPositions[currentIndex]) * fluidIntensity * -0.2;
    liquidContainer.style.transform = `scale(${volumeCompensator}) skewX(${skewAmount}deg)`;

    // Edge Light calculations
    let offset = 100 - (scrollProgress * 100);
    if (scrollProgress > 0.99) offset = 0;
    lightLines.forEach(line => line.style.strokeDashoffset = offset);

    // Frame-by-Frame Geometry Interpolation
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

    // RGB Interpolation
    const r = Math.round(currentShape.c[0] + (nextShape.c[0] - currentShape.c[0]) * localProgress);
    const g = Math.round(currentShape.c[1] + (nextShape.c[1] - currentShape.c[1]) * localProgress);
    const b = Math.round(currentShape.c[2] + (nextShape.c[2] - currentShape.c[2]) * localProgress);
    const interpolatedColor = `rgb(${r}, ${g}, ${b})`;

    // Apply Output to DOM
    shapeEl.style.clipPath = polygonString;
    shapeEl.style.backgroundColor = interpolatedColor;
    glowEl.style.clipPath = polygonString;
    glowEl.style.backgroundColor = interpolatedColor;

    edgeLights.style.stroke = interpolatedColor;
    originSpot.style.fill = interpolatedColor;
    edgeLights.style.filter = `drop-shadow(0 0 15px ${interpolatedColor})`;

    if (scrollProgress >= 0.99) {
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

    // Check conditions to continue the animation loop
    if (Math.abs(targetScroll - currentScroll) > 0.5 || Math.abs(targetX - mouseX) > 0.01 || fluidIntensity > 0.01) {
        window.requestAnimationFrame(renderLoop);
    } else {
        isAnimating = false;
    }
};

// Initialize sequence
window.requestAnimationFrame(() => {
    targetScroll = window.scrollY;
    currentScroll = window.scrollY;
    setupObserver();
    
    isAnimating = true;
    renderLoop();
});
