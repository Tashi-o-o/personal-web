const shapes = [
    { p: [[50,0], [50,0], [100,100], [100,100], [50,100], [0,100], [0,100], [50,0]], c: [0, 229, 255] },
    { p: [[0,0], [50,0], [100,0], [100,50], [100,100], [50,100], [0,100], [0,50]], c: [181, 0, 255] },
    { p: [[50,0], [50,0], [100,38], [100,38], [82,100], [18,100], [0,38], [0,38]], c: [255, 122, 0] },
    { p: [[50,0], [100,25], [100,25], [100,75], [50,100], [50,100], [0,75], [0,25]], c: [0, 255, 87] },
    { p: [[30,0], [70,0], [100,30], [100,70], [70,100], [30,100], [0,70], [0,30]], c: [255, 0, 85] }
];

const xPositions = [-42, 42, 42, -42, 0];
const yPositions = [-40, -40, 40, 40, -40];

let targetScroll = 0;
let currentScroll = 0;
let isAnimating = false;
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;

const shapeEl = document.getElementById('geometry-morph');
const glowEl = document.getElementById('geometry-glow');
const ambientBloom = document.getElementById('ambient-bloom');
const edgeLights = document.getElementById('edge-glow');
const originSpot = document.querySelector('.origin-spot');
const lightLines = document.querySelectorAll('.light-line');
const subheadings = document.querySelectorAll('.subheading');
const primaryButtons = document.querySelectorAll('.primary-btn');
const parallaxWrapper = document.getElementById('parallax-wrapper');
const liquidContainer = document.getElementById('liquid-engine');
const navDots = document.querySelectorAll('.nav-dot');
const fluidBlurEl = document.getElementById('fluid-blur');
const droplets = document.querySelectorAll('.droplet');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const getMaxScroll = () => {
    const lastSection = document.getElementById('contact');
    const computedScroll = lastSection ? lastSection.offsetTop : (document.documentElement.scrollHeight - winHeight);
    return Math.max(1, computedScroll); 
};

let targetX = 0, targetY = 0;
let mouseX = 0, mouseY = 0;

window.addEventListener('resize', () => {
    winWidth = window.innerWidth;
    winHeight = window.innerHeight;
});

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
}, { passive: true });

const renderLoop = () => {
    currentScroll += (targetScroll - currentScroll) * 0.18;
    const maxScroll = getMaxScroll();
    
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

    const shapeX = xPositions[currentIndex] + (xPositions[nextIndex] - xPositions[currentIndex]) * localProgress;
    const shapeY = yPositions[currentIndex] + (yPositions[nextIndex] - yPositions[currentIndex]) * localProgress;
    
    const fluidIntensity = prefersReducedMotion.matches ? 0 : Math.sin(localProgress * Math.PI);
    
    if (fluidIntensity > 0.05 && !prefersReducedMotion.matches) {
        liquidContainer.style.filter = "url('#gooey-fluid')";
        fluidBlurEl.setAttribute('stdDeviation', fluidIntensity * 8);
    } else {
        liquidContainer.style.filter = "none";
    }

    mouseX += (targetX - mouseX) * 0.15;
    mouseY += (targetY - mouseY) * 0.15;
    
    const viewportX = (shapeX * winWidth) / 100;
    const viewportY = (shapeY * winHeight) / 100;
    
    parallaxWrapper.style.transform = `translate3d(${viewportX + (mouseX * 10)}px, ${viewportY + (mouseY * 10)}px, 0)`;

    const basePopScale = 1 + ((1 - fluidIntensity) * 0.35); 
    const scaleX = basePopScale + (fluidIntensity * 0.25);
    const scaleY = basePopScale - (fluidIntensity * 0.1);
    
    liquidContainer.style.transform = `scale(${scaleX}, ${scaleY}) translateZ(0)`;

    const spread = fluidIntensity * 80;
    droplets[0].style.transform = `translate3d(${-spread}px, ${-spread}px, 0) scale(${0.2 + fluidIntensity * 0.8})`;
    droplets[1].style.transform = `translate3d(${spread}px, ${spread}px, 0) scale(${0.1 + fluidIntensity * 0.9})`;
    droplets[2].style.transform = `translate3d(${-spread * 0.5}px, ${spread * 0.5}px, 0) scale(${0.3 + fluidIntensity * 0.7})`;

    let offset = 100 - (scrollProgress * 100);
    if (scrollProgress > 0.99) offset = 0;
    lightLines.forEach(line => line.style.strokeDashoffset = offset);

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
    ambientBloom.style.clipPath = polygonString;
    ambientBloom.style.backgroundColor = interpolatedColor;
    
    droplets.forEach(drop => drop.style.backgroundColor = interpolatedColor);

    edgeLights.style.stroke = interpolatedColor;
    originSpot.style.fill = interpolatedColor;
    edgeLights.style.filter = `drop-shadow(0 0 15px ${interpolatedColor})`;

    subheadings.forEach(sub => {
        sub.style.color = interpolatedColor;
        sub.style.textShadow = `0 0 10px ${interpolatedColor}, 0 0 20px rgba(255,255,255,0.5)`;
    });
    primaryButtons.forEach(btn => {
        btn.style.backgroundColor = interpolatedColor;
        btn.style.boxShadow = `0 0 25px ${interpolatedColor}, inset 0 0 10px rgba(255,255,255,0.3)`;
    });
    navDots.forEach(dot => {
        if (dot.classList.contains('active')) {
            dot.style.borderColor = interpolatedColor;
            dot.style.boxShadow = `0 0 12px ${interpolatedColor}`;
        } else {
            dot.style.borderColor = 'transparent';
            dot.style.boxShadow = 'none';
        }
    });

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
