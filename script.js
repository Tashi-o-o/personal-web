'use strict';

// --- Telemetry & Error Boundary ---
window.addEventListener('error', (event) => {
    console.error("Atrunix Error Handler:", event.message, "at", event.filename, ":", event.lineno);
});

// --- Constants & Config ---
const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

const SHAPES = [
    { p: [[10,0], [90,10], [100,50], [80,100], [20,90], [0,60], [5,30], [5,10]], c: [0, 229, 255] },
    { p: [[20,0], [80,0], [100,50], [100,50], [80,100], [20,100], [40,50], [40,50]], c: [181, 0, 255] },
    { p: [[50,0], [75,25], [100,50], [75,75], [50,100], [25,75], [0,50], [25,25]], c: [255, 122, 0] },
    { p: [[25,0], [100,0], [100,0], [75,100], [75,100], [0,100], [0,100], [25,0]], c: [0, 255, 87] },
    { p: [[40,0], [60,0], [100,40], [100,60], [60,100], [40,100], [0,60], [0,40]], c: [255, 0, 85] }
];

// Left Margin constraints
const X_POS_L = [-42, -40, -42, -38, -42];
const Y_POS_L = [-30, 0, 30, 0, -30];
// Right Margin constraints
const X_POS_R = [42, 40, 42, 38, 42];
const Y_POS_R = [30, 0, -30, 0, 30];

// --- State Management ---
const state = {
    targetScroll: 0,
    currentScroll: 0,
    isAnimating: false,
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
    mouseX: 0,
    mouseY: 0,
    targetX: 0,
    targetY: 0,
    maxScroll: 1,
    modalOpen: false
};

// --- DOM Elements ---
const DOM = {
    shapeL: document.getElementById('geometry-morph'),
    shapeR: document.getElementById('geometry-morph-2'),
    hudBar: document.getElementById('progress-bar'),
    wrapperL: document.getElementById('parallax-wrapper'),
    wrapperR: document.getElementById('parallax-wrapper-2'),
    containerL: document.querySelector('.liquid-container'),
    containerR: document.querySelector('.secondary-container .liquid-container'),
    navDots: document.querySelectorAll('.nav-dot'),
    dropletsL: document.querySelectorAll('#parallax-wrapper .droplet'),
    dropletsR: document.querySelectorAll('#parallax-wrapper-2 .droplet'),
    modal: document.getElementById('intake-modal'),
    openModalBtn: document.getElementById('open-intake'),
    closeModalBtn: document.querySelector('.close-modal'),
    form: document.getElementById('intake-form'),
    feedback: document.getElementById('form-feedback'),
    tokenDisplay: document.getElementById('tracking-token'),
    dyeSpread: document.getElementById('dye-spread')
};

// --- Utility Functions ---
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

const calculateMaxScroll = () => {
    state.maxScroll = Math.max(1, document.documentElement.scrollHeight - state.winHeight);
};

// --- Modal & Form Focus Trap Logic ---
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
let firstFocusableElement, lastFocusableElement;

const updateFocusTrap = () => {
    const focusableContent = DOM.modal.querySelectorAll(focusableElements);
    if(focusableContent.length > 0) {
        firstFocusableElement = focusableContent[0];
        lastFocusableElement = focusableContent[focusableContent.length - 1];
    }
};

const toggleModal = (isOpen) => {
    state.modalOpen = isOpen;
    DOM.modal.setAttribute('aria-hidden', !isOpen);
    DOM.openModalBtn.setAttribute('aria-expanded', isOpen);
    
    if (isOpen) {
        DOM.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateFocusTrap();
        setTimeout(() => firstFocusableElement?.focus(), 100);
    } else {
        DOM.modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            DOM.form.style.display = 'block';
            DOM.feedback.classList.add('hidden');
            DOM.form.reset();
            DOM.form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
            DOM.openModalBtn.focus();
        }, 400);
    }
};

// Modal Event Listeners
if (DOM.openModalBtn && DOM.closeModalBtn) {
    DOM.openModalBtn.addEventListener('click', () => toggleModal(true));
    DOM.closeModalBtn.addEventListener('click', () => toggleModal(false));
    
    DOM.modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') toggleModal(false);
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Form Submission & Validation (Mock API Request)
if (DOM.form) {
    DOM.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;
        
        const requiredInputs = DOM.form.querySelectorAll('input[required], textarea[required]');
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.parentElement.classList.add('invalid');
                document.getElementById(`error-${input.id.split('-')[0]}`).textContent = 'This field is required.';
                isValid = false;
            } else {
                input.parentElement.classList.remove('invalid');
            }
        });

        if (!isValid) return;

        const submitBtn = DOM.form.querySelector('button[type="submit"]');
        submitBtn.classList.add('skeleton-loader');
        submitBtn.innerHTML = '';
        submitBtn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const cryptoArr = new Uint32Array(1);
            window.crypto.getRandomValues(cryptoArr);
            const token = 'ATRX-' + cryptoArr[0].toString(36).toUpperCase().padStart(6, '0');

            DOM.form.style.display = 'none';
            DOM.tokenDisplay.textContent = token;
            DOM.feedback.classList.remove('hidden');
            updateFocusTrap();
            DOM.tokenDisplay.focus();

        } catch (error) {
            console.error('Submission failed:', error);
            alert('A network error occurred. Please try again.');
        } finally {
            submitBtn.classList.remove('skeleton-loader');
            submitBtn.innerHTML = '<span class="btn-text">Process & Generate Token</span>';
            submitBtn.disabled = false;
        }
    });
}

// Token Copy to Clipboard
if (DOM.tokenDisplay) {
    DOM.tokenDisplay.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(DOM.tokenDisplay.textContent);
            DOM.tokenDisplay.classList.add('copied');
            const hint = document.querySelector('.copy-hint');
            if(hint) hint.textContent = 'Copied to clipboard!';
            setTimeout(() => {
                DOM.tokenDisplay.classList.remove('copied');
                if(hint) hint.textContent = 'Click token to copy.';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    });
}

// --- Graphical Rendering Engine ---

document.querySelector('.side-nav')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-dot')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('data-target');
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
});

window.addEventListener('resize', debounce(() => {
    state.winWidth = window.innerWidth;
    state.winHeight = window.innerHeight;
    calculateMaxScroll();
}, 250));

window.addEventListener('mousemove', (e) => {
    if (PREFERS_REDUCED_MOTION.matches || state.modalOpen) return;
    state.targetX = (e.clientX / state.winWidth) * 2 - 1;
    state.targetY = (e.clientY / state.winHeight) * 2 - 1;
}, { passive: true });

window.addEventListener('scroll', () => {
    state.targetScroll = window.scrollY;
    if (!state.isAnimating) {
        state.isAnimating = true;
        window.requestAnimationFrame(renderLoop);
    }
}, { passive: true });

const setupObserver = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                const id = entry.target.parentElement.id;
                DOM.navDots.forEach(dot => {
                    dot.classList.toggle('active', dot.getAttribute('data-target') === id);
                    dot.setAttribute('aria-current', dot.getAttribute('data-target') === id ? 'true' : 'false');
                });
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.5 });

    document.querySelectorAll('.fade-in-section').forEach(section => observer.observe(section));
};

const renderLoop = () => {
    if (PREFERS_REDUCED_MOTION.matches) {
        state.isAnimating = false;
        return; 
    }

    state.currentScroll += (state.targetScroll - state.currentScroll) * 0.18;
    let scrollProgress = Math.max(0, Math.min(1, state.currentScroll / state.maxScroll)) || 0;

    const numShapes = SHAPES.length;
    const scaledProgress = scrollProgress * (numShapes - 1);
    const currentIndex = Math.floor(scaledProgress);
    const nextIndex = Math.min(currentIndex + 1, numShapes - 1);
    const localProgress = scaledProgress - currentIndex; 

    const currentShape = SHAPES[currentIndex];
    const nextShape = SHAPES[nextIndex];
    const nextShape2 = SHAPES[(nextIndex + 1) % numShapes];

    const shapeX = X_POS_L[currentIndex] + (X_POS_L[nextIndex] - X_POS_L[currentIndex]) * localProgress;
    const shapeY = Y_POS_L[currentIndex] + (Y_POS_L[nextIndex] - Y_POS_L[currentIndex]) * localProgress;
    
    const shapeX2 = X_POS_R[currentIndex] + (X_POS_R[nextIndex] - X_POS_R[currentIndex]) * localProgress;
    const shapeY2 = Y_POS_R[currentIndex] + (Y_POS_R[nextIndex] - Y_POS_R[currentIndex]) * localProgress;

    const time = Date.now() * 0.001;
    const ambientY = Math.sin(time) * 10;
    const fluidIntensity = Math.sin(localProgress * Math.PI);

    state.mouseX += (state.targetX - state.mouseX) * 0.15;
    state.mouseY += (state.targetY - state.mouseY) * 0.15;
    
    const viewportX = (shapeX * state.winWidth) / 100;
    const viewportY = ((shapeY * state.winHeight) / 100) + ambientY;
    const viewportX2 = (shapeX2 * state.winWidth) / 100;
    const viewportY2 = ((shapeY2 * state.winHeight) / 100) - ambientY;

    DOM.wrapperL.style.transform = `translate3d(${viewportX + (state.mouseX * 15)}px, ${viewportY + (state.mouseY * 15)}px, 0)`;
    DOM.wrapperR.style.transform = `translate3d(${viewportX2 + (state.mouseX * 10)}px, ${viewportY2 + (state.mouseY * 10)}px, 0)`;

    // Interactive Cursor Dye Spread Translation
    const cursorPixelX = ((state.mouseX + 1) / 2) * state.winWidth;
    const cursorPixelY = ((state.mouseY + 1) / 2) * state.winHeight;
    if (DOM.dyeSpread) {
        DOM.dyeSpread.style.transform = `translate3d(${cursorPixelX}px, ${cursorPixelY}px, 0)`;
    }

    const stretchY = 1 + (fluidIntensity * 0.4);
    const squishX = 1 - (fluidIntensity * 0.2);
    const skewAmount = (Y_POS_L[nextIndex] - Y_POS_L[currentIndex]) * fluidIntensity * -0.15;
    
    DOM.containerL.style.transform = `scale(${squishX}, ${stretchY}) skewY(${skewAmount}deg) translateZ(0)`;
    DOM.containerR.style.transform = `scale(${squishX}, ${stretchY}) skewY(${-skewAmount}deg) translateZ(0)`;

    const spread = fluidIntensity * 100;
    const dirY = Y_POS_L[nextIndex] > Y_POS_L[currentIndex] ? 1 : -1;
    
    DOM.dropletsL[0].style.transform = `translate3d(${-spread * 0.5}px, ${dirY * -spread}px, 0) scale(${0.2 + fluidIntensity * 0.8})`;
    DOM.dropletsL[1].style.transform = `translate3d(${spread * 0.8}px, ${dirY * spread * 0.5}px, 0) scale(${0.1 + fluidIntensity * 0.9})`;
    DOM.dropletsL[2].style.transform = `translate3d(0px, ${dirY * spread * 1.5}px, 0) scale(${0.3 + fluidIntensity * 0.7})`;

    DOM.dropletsR[0].style.transform = `translate3d(${spread * 0.5}px, ${-dirY * -spread}px, 0) scale(${0.2 + fluidIntensity * 0.8})`;
    DOM.dropletsR[1].style.transform = `translate3d(${-spread * 0.8}px, ${-dirY * spread * 0.5}px, 0) scale(${0.1 + fluidIntensity * 0.9})`;
    DOM.dropletsR[2].style.transform = `translate3d(0px, ${-dirY * spread * 1.5}px, 0) scale(${0.3 + fluidIntensity * 0.7})`;

    DOM.hudBar.style.strokeDashoffset = (scrollProgress > 0.99) ? 0 : 100 - (scrollProgress * 100);

    let poly1 = 'polygon(', poly2 = 'polygon(';
    for (let i = 0; i < 8; i++) {
        const x = currentShape.p[i][0] + (nextShape.p[i][0] - currentShape.p[i][0]) * localProgress;
        const y = currentShape.p[i][1] + (nextShape.p[i][1] - currentShape.p[i][1]) * localProgress;
        const x2 = nextShape.p[i][0] + (nextShape2.p[i][0] - nextShape.p[i][0]) * localProgress;
        const y2 = nextShape.p[i][1] + (nextShape2.p[i][1] - nextShape.p[i][1]) * localProgress;

        poly1 += `${x}% ${y}%${i < 7 ? ', ' : ''}`;
        poly2 += `${x2}% ${y2}%${i < 7 ? ', ' : ''}`;
    }
    DOM.shapeL.style.clipPath = poly1 + ')';
    DOM.shapeR.style.clipPath = poly2 + ')';

    const r = Math.round(currentShape.c[0] + (nextShape.c[0] - currentShape.c[0]) * localProgress);
    const g = Math.round(currentShape.c[1] + (nextShape.c[1] - currentShape.c[1]) * localProgress);
    const b = Math.round(currentShape.c[2] + (nextShape.c[2] - currentShape.c[2]) * localProgress);
    document.documentElement.style.setProperty('--dyn-color', `rgb(${r}, ${g}, ${b})`);

    if (Math.abs(state.targetScroll - state.currentScroll) > 0.5 || Math.abs(state.targetX - state.mouseX) > 0.01 || fluidIntensity > 0.01) {
        window.requestAnimationFrame(renderLoop);
    } else {
        window.requestAnimationFrame(renderLoop); 
    }
};

const init = () => {
    calculateMaxScroll();
    setupObserver();
    state.targetScroll = window.scrollY;
    state.currentScroll = window.scrollY;
    state.isAnimating = true;
    window.requestAnimationFrame(renderLoop);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
