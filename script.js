window.addEventListener('error', function(event) {
    console.error("Atrunix Telemetry - Script Error:", event.message, "at", event.filename, ":", event.lineno);
});

// Modal UI Logic
const modal = document.getElementById('intake-modal');
const openModalBtn = document.getElementById('open-intake');
const closeModalBtn = document.querySelector('.close-modal');
const intakeForm = document.getElementById('intake-form');
const formFeedback = document.getElementById('form-feedback');
const tokenDisplay = document.getElementById('tracking-token');

if(openModalBtn) {
    openModalBtn.addEventListener('click', () => modal.classList.add('active'));
}

if(closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => {
            intakeForm.style.display = 'block';
            formFeedback.classList.add('hidden');
            intakeForm.reset();
        }, 400);
    });
}

if(intakeForm) {
    intakeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = intakeForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<span class="btn-text">Syncing Database...</span>';
        submitBtn.disabled = true;

        const token = 'ATRX-' + Math.random().toString(36).substring(2, 8).toUpperCase();

        setTimeout(() => {
            intakeForm.style.display = 'none';
            tokenDisplay.textContent = token;
            formFeedback.classList.remove('hidden');
            submitBtn.innerHTML = '<span class="btn-text">Process & Generate Token</span>';
            submitBtn.disabled = false;
        }, 1200);
    });
}

// Coordinate arrays for deeply technical abstract polygons
const shapes = [
    { p: [[10,0], [90,10], [100,50], [80,100], [20,90], [0,60], [5,30], [5,10]], c: [0, 229, 255] },
    { p: [[20,0], [80,0], [100,50], [100,50], [80,100], [20,100], [40,50], [40,50]], c: [181, 0, 255] },
    { p: [[50,0], [75,25], [100,50], [75,75], [50,100], [25,75], [0,50], [25,25]], c: [255, 122, 0] },
    { p: [[25,0], [100,0], [100,0], [75,100], [75,100], [0,100], [0,100], [25,0]], c: [0, 255, 87] },
    { p: [[40,0], [60,0], [100,40], [100,60], [60,100], [40,100], [0,60], [0,40]], c: [255, 0, 85] }
];

// Left Margin constraints: Never crosses X=0
const xPositions = [-42, -40, -42, -38, -42];
const yPositions = [-30, 0, 30, 0, -30];

// Right Margin constraints: Never crosses X=0
const xPositions2 = [42, 40, 42, 38, 42];
const yPositions2 = [30, 0, -30, 0, 30];

let targetScroll = 0;
let currentScroll = 0;
let isAnimating = false;
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;

const shapeEl = document.getElementById('geometry-morph');
const shapeEl2 = document.getElementById('geometry-morph-2');
const hudBar = document.getElementById('progress-bar');
const parallaxWrapper = document.getElementById('parallax-wrapper');
const parallaxWrapper2 = document.getElementById('parallax-wrapper-2');
const liquidContainer = document.querySelector('.liquid-container');
const liquidContainer2 = document.querySelector('.secondary-container .liquid-container');
const navDots = document.querySelectorAll('.nav-dot');

// Query both sets of droplets
const droplets1 = document.querySelectorAll('#parallax-wrapper .droplet');
const droplets2 = document.querySelectorAll('#parallax-wrapper-2 .droplet');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Robust height calculation
const updateMaxScroll = () => {
    return Math.max(1, document.documentElement.scrollHeight - winHeight);
};

window.addEventListener('resize', () => {
    winWidth = window.innerWidth;
    winHeight = window.innerHeight;
});

let targetX = 0, targetY = 0;
let mouseX = 0, mouseY = 0;

window.addEventListener('mousemove', (e) => {
    if (prefersReducedMotion.matches) return;
    targetX = (e.clientX / winWidth) * 2 - 1;
    targetY = (e.clientY / winHeight) * 2 - 1;
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
    document.querySelectorAll('.fade-in-section').forEach(section => observer.observe(section));
};

window.addEventListener('scroll', () => {
    targetScroll = window.scrollY;
    if (!isAnimating) {
        isAnimating = true;
        window.requestAnimationFrame(renderLoop);
    }
}, { passive: true });

const renderLoop = () => {
    currentScroll += (targetScroll - currentScroll) * 0.18;
    const maxScroll = updateMaxScroll();
    
    let scrollProgress = currentScroll / maxScroll;
    if (scrollProgress > 0.985) scrollProgress = 1;
    scrollProgress = Math.max(0, Math.min(1, scrollProgress)); 
    if (isNaN(scrollProgress)) scrollProgress = 0;

    const numShapes = shapes.length;
    const scaledProgress = scrollProgress * (numShapes - 1);
    const currentIndex = Math.floor(scaledProgress);
    const nextIndex = Math.min(currentIndex + 1, numShapes - 1);
    const localProgress = scaledProgress - currentIndex; 

    const currentShape = shapes[currentIndex];
    const nextShape = shapes[nextIndex];
    const nextShape2 = shapes[(nextIndex + 1) % numShapes];

    const shapeX = xPositions[currentIndex] + (xPositions[nextIndex] - xPositions[currentIndex]) * localProgress;
    const shapeY = yPositions[currentIndex] + (yPositions[nextIndex] - yPositions[currentIndex]) * localProgress;
    
    const shapeX2 = xPositions2[currentIndex] + (xPositions2[nextIndex] - xPositions2[currentIndex]) * localProgress;
    const shapeY2 = yPositions2[currentIndex] + (yPositions2[nextIndex] - yPositions2[currentIndex]) * localProgress;

    const fluidIntensity = prefersReducedMotion.matches ? 0 : Math.sin(localProgress * Math.PI);

    mouseX += (targetX - mouseX) * 0.15;
    mouseY += (targetY - mouseY) * 0.15;
    
    const viewportX = (shapeX * winWidth) / 100;
    const viewportY = (shapeY * winHeight) / 100;
    const viewportX2 = (shapeX2 * winWidth) / 100;
    const viewportY2 = (shapeY2 * winHeight) / 100;

    // Apply native smooth translates
    parallaxWrapper.style.transform = `translate3d(${viewportX + (mouseX * 15)}px, ${viewportY + (mouseY * 15)}px, 0)`;
    parallaxWrapper2.style.transform = `translate3d(${viewportX2 + (mouseX * 10)}px, ${viewportY2 + (mouseY * 10)}px, 0)`;

    // Liquid Deformation Simulation (Scale and Skew instead of SVG Filters)
    const stretchY = 1 + (fluidIntensity * 0.4);
    const squishX = 1 - (fluidIntensity * 0.2);
    const skewAmount = (yPositions[nextIndex] - yPositions[currentIndex]) * fluidIntensity * -0.15;
    
    liquidContainer.style.transform = `scale(${squishX}, ${stretchY}) skewY(${skewAmount}deg) translateZ(0)`;
    liquidContainer2.style.transform = `scale(${squishX}, ${stretchY}) skewY(${-skewAmount}deg) translateZ(0)`;

    // Droplet Splash Simulation
    const spread = fluidIntensity * 100;
    const directionY = yPositions[nextIndex] > yPositions[currentIndex] ? 1 : -1;
    
    droplets1[0].style.transform = `translate3d(${-spread * 0.5}px, ${directionY * -spread}px, 0) scale(${0.2 + fluidIntensity * 0.8})`;
    droplets1[1].style.transform = `translate3d(${spread * 0.8}px, ${directionY * spread * 0.5}px, 0) scale(${0.1 + fluidIntensity * 0.9})`;
    droplets1[2].style.transform = `translate3d(0px, ${directionY * spread * 1.5}px, 0) scale(${0.3 + fluidIntensity * 0.7})`;

    droplets2[0].style.transform = `translate3d(${spread * 0.5}px, ${-directionY * -spread}px, 0) scale(${0.2 + fluidIntensity * 0.8})`;
    droplets2[1].style.transform = `translate3d(${-spread * 0.8}px, ${-directionY * spread * 0.5}px, 0) scale(${0.1 + fluidIntensity * 0.9})`;
    droplets2[2].style.transform = `translate3d(0px, ${-directionY * spread * 1.5}px, 0) scale(${0.3 + fluidIntensity * 0.7})`;

    // Update HUD Progress Perimeter Frame
    let offset = 100 - (scrollProgress * 100);
    if (scrollProgress > 0.99) offset = 0;
    hudBar.style.strokeDashoffset = offset;

    // Polygon Morphing Calculation
    let polygonString = 'polygon(';
    let polygonString2 = 'polygon(';
    for (let i = 0; i < 8; i++) {
        const cx = currentShape.p[i][0];
        const cy = currentShape.p[i][1];
        const nx = nextShape.p[i][0];
        const ny = nextShape.p[i][1];
        const nx2 = nextShape2.p[i][0];
        const ny2 = nextShape2.p[i][1];
        
        const x = cx + (nx - cx) * localProgress;
        const y = cy + (ny - cy) * localProgress;
        const x2 = nx + (nx2 - nx) * localProgress;
        const y2 = ny + (ny2 - ny) * localProgress;

        polygonString += `${x}% ${y}%${i < 7 ? ', ' : ''}`;
        polygonString2 += `${x2}% ${y2}%${i < 7 ? ', ' : ''}`;
    }
    polygonString += ')';
    polygonString2 += ')';

    shapeEl.style.clipPath = polygonString;
    shapeEl2.style.clipPath = polygonString2;

    // Single Frame Global Color Update (Drives ALL shadows, borders, text, and SVG styles simultaneously)
    const r = Math.round(currentShape.c[0] + (nextShape.c[0] - currentShape.c[0]) * localProgress);
    const g = Math.round(currentShape.c[1] + (nextShape.c[1] - currentShape.c[1]) * localProgress);
    const b = Math.round(currentShape.c[2] + (nextShape.c[2] - currentShape.c[2]) * localProgress);
    
    document.documentElement.style.setProperty('--dyn-color', `rgb(${r}, ${g}, ${b})`);

    if (Math.abs(targetScroll - currentScroll) > 0.5 || Math.abs(targetX - mouseX) > 0.01 || fluidIntensity > 0.01) {
        window.requestAnimationFrame(renderLoop);
    } else {
        isAnimating = false;
    }
};

window.requestAnimationFrame(() => {
    targetScroll = window.scrollY;
    currentScroll = window.scrollY;
    setupObserver();
    isAnimating = true;
    renderLoop();
});
