'use strict';

window.addEventListener('error', (event) => {
    console.error("Atrunix Error Handler:", event.message, "at", event.filename, ":", event.lineno);
});

const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

const SHAPES = [
    { p: [[10,0], [90,10], [100,50], [80,100], [20,90], [0,60], [5,30], [5,10]], c: [0, 229, 255] },
    { p: [[20,0], [80,0], [100,50], [100,50], [80,100], [20,100], [40,50], [40,50]], c: [181, 0, 255] },
    { p: [[50,0], [75,25], [100,50], [75,75], [50,100], [25,75], [0,50], [25,25]], c: [255, 122, 0] },
    { p: [[25,0], [100,0], [100,0], [75,100], [75,100], [0,100], [0,100], [25,0]], c: [0, 255, 87] },
    { p: [[40,0], [60,0], [100,40], [100,60], [60,100], [40,100], [0,60], [0,40]], c: [255, 0, 85] }
];

const X_POS_L = [-42, -40, -42, -38, -42];
const Y_POS_L = [-30, 0, 30, 0, -30];
const X_POS_R = [42, 40, 42, 38, 42];
const Y_POS_R = [30, 0, -30, 0, 30];

const state = {
    targetScroll: 0, currentScroll: 0,
    isAnimating: false,
    winWidth: window.innerWidth, winHeight: window.innerHeight,
    mouseX: 0, mouseY: 0,
    targetX: 0, targetY: 0,
    maxScroll: 1, modalOpen: false
};

const DOM = {
    shapeL: document.getElementById('geometry-morph'),
    shapeR: document.getElementById('geometry-morph-2'),
    hudBar: document.getElementById('progress-bar'),
    hudBarGlow: document.getElementById('progress-glow'),
    wrapperL: document.getElementById('parallax-wrapper'),
    wrapperR: document.getElementById('parallax-wrapper-2'),
    containerL: document.querySelector('.liquid-container'),
    containerR: document.querySelector('.secondary-container .liquid-container'),
    navDots: document.querySelectorAll('.nav-dot'),
    modal: document.getElementById('intake-modal'),
    openModalBtn: document.getElementById('open-intake'),
    closeModalBtn: document.querySelector('.close-modal'),
    form: document.getElementById('intake-form'),
    feedback: document.getElementById('form-feedback'),
    tokenDisplay: document.getElementById('tracking-token')
};

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

const resizeObserver = new ResizeObserver(debounce(() => {
    state.winWidth = window.innerWidth;
    state.winHeight = window.innerHeight;
    calculateMaxScroll();
    if(!state.isAnimating) {
        state.isAnimating = true;
        window.requestAnimationFrame(renderLoop);
    }
}, 100));

resizeObserver.observe(document.body);

// --- Component 1: Solar System Logic ---
const planetDatabase = {
    mercury: { name: "Mercury_Node", type: "Terrestrial", radius: "2,439 km", gravity: "3.7 m/s²", facts: "Innermost planetary node. Highly cratered surface with zero atmosphere, experiencing extreme thermal swings from -180°C to 430°C.", visual: "radial-gradient(circle at 30% 30%, #a6a6a6, #595959, #000)" },
    venus: { name: "Venus_Node", type: "Terrestrial", radius: "6,051 km", gravity: "8.8 m/s²", facts: "Enveloped in dense sulfuric acid clouds. Exhibits an extreme runaway greenhouse effect making it the hottest surface in the system.", visual: "radial-gradient(circle at 30% 30%, #e3bb76, #a17838, #000)" },
    earth: { name: "Earth_Node", type: "Terrestrial", radius: "6,371 km", gravity: "9.8 m/s²", facts: "Atrunix HQ. The only known node supporting biological life and organic data processing. Surface composition is 71% liquid H2O.", visual: "radial-gradient(circle at 30% 30%, #4b9fe3, #1e5c8f, #000)" },
    mars: { name: "Mars_Node", type: "Terrestrial", radius: "3,389 km", gravity: "3.7 m/s²", facts: "High iron oxide surface concentration. Hosts Olympus Mons, the largest geological volcano formation in the planetary network.", visual: "radial-gradient(circle at 30% 30%, #e27b58, #8c3b23, #000)" },
    jupiter: { name: "Jupiter_Node", type: "Gas Giant", radius: "69,911 km", gravity: "24.7 m/s²", facts: "Primary gravitational anchor. Its Great Red Spot represents a persistent atmospheric storm system larger than the Earth node.", visual: "radial-gradient(circle at 30% 30%, #c88b3a, #7a5223, #000)" },
    saturn: { name: "Saturn_Node", type: "Gas Giant", radius: "58,232 km", gravity: "10.4 m/s²", facts: "Characterized by an extensive orbital ring network composed of ice particles, rocky debris, and cosmic dust.", visual: "radial-gradient(circle at 30% 30%, #e3d599, #9e9154, #000)" },
    uranus: { name: "Uranus_Node", type: "Ice Giant", radius: "25,362 km", gravity: "8.7 m/s²", facts: "Rotates on a radical 97.8-degree axial tilt. Methane-rich atmospheric mantle imparts a distinct cyan coloration.", visual: "radial-gradient(circle at 30% 30%, #68d8d6, #2b8a88, #000)" },
    neptune: { name: "Neptune_Node", type: "Ice Giant", radius: "24,622 km", gravity: "11.1 m/s²", facts: "Outermost giant node. Experiences extreme supersonic winds reaching up to 2,100 km/h within its deep blue atmosphere.", visual: "radial-gradient(circle at 30% 30%, #4169e1, #192a78, #000)" }
};

const setupSolarSystem = () => {
    const planets = document.querySelectorAll('.celestial-body[data-planet]');
    const modal = document.getElementById('planet-modal');
    const closeBtn = document.getElementById('close-planet-btn');
    const visual = document.getElementById('detail-planet-visual');
    let typingInterval;
    
    planets.forEach(p => {
        p.addEventListener('click', () => {
            const data = planetDatabase[p.getAttribute('data-planet')];
            if(data) {
                visual.style.background = data.visual;
                document.getElementById('detail-name').textContent = data.name;
                document.getElementById('detail-type').textContent = data.type;
                document.getElementById('detail-radius').textContent = data.radius;
                document.getElementById('detail-gravity').textContent = data.gravity;
                
                const factsEl = document.getElementById('detail-facts');
                factsEl.textContent = '';
                clearInterval(typingInterval);
                let i = 0;
                typingInterval = setInterval(() => {
                    factsEl.textContent += data.facts.charAt(i);
                    i++;
                    if(i >= data.facts.length) clearInterval(typingInterval);
                }, 15);
                
                visual.innerHTML = '';
                if(p.getAttribute('data-planet') === 'saturn') {
                    const ring = document.createElement('div');
                    ring.className = 'saturn-rings-detail';
                    visual.appendChild(ring);
                }
                modal.classList.remove('hidden');
            }
        });
    });

    if(closeBtn) closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        clearInterval(typingInterval);
    });
};

// --- Component 2: High-Performance Terminal Simulator ---
const setupTerminal = () => {
    const btn = document.getElementById('term-run-btn');
    const output = document.getElementById('term-output');
    if(!btn || !output) return;

    const scriptLines = [
        { text: "> Authenticating local access...", delay: 400 },
        { text: "[OK] Credentials verified.", delay: 300, class: "term-success" },
        { text: "> Fetching build dependencies...", delay: 600 },
        { text: "[WARN] 2 deprecation warnings ignored.", delay: 200, class: "term-warn" },
        { text: "> Compiling JavaScript bundles (0.8s)...", delay: 800 },
        { text: "> Injecting CSS variables...", delay: 400 },
        { text: "[OK] Deployment routine finished.", delay: 500, class: "term-success" }
    ];

    btn.addEventListener('click', () => {
        btn.disabled = true;
        output.innerHTML = '';
        
        let cumulativeDelay = 0;
        
        scriptLines.forEach((line, index) => {
            cumulativeDelay += line.delay;
            setTimeout(() => {
                const span = document.createElement('span');
                span.className = `term-line ${line.class || ''}`;
                span.textContent = line.text;
                output.appendChild(span);
                output.scrollTop = output.scrollHeight;
                
                if(index === scriptLines.length - 1) {
                    setTimeout(() => {
                        const prompt = document.createElement('span');
                        prompt.innerHTML = '<br><span class="term-prompt">user@atrunix:~$</span> Ready.';
                        output.appendChild(prompt);
                        output.scrollTop = output.scrollHeight;
                        btn.disabled = false;
                    }, 800);
                }
            }, cumulativeDelay);
        });
    });
};

// --- Component 3: 3D Holographic Card ---
const setupHoloCard = () => {
    const cardBox = document.getElementById('holo-viewport');
    const card = document.getElementById('holo-card');
    const glare = document.getElementById('holo-glare');
    if (!cardBox || !card || !glare || PREFERS_REDUCED_MOTION.matches) return;

    const updateCardTilt = (clientX, clientY) => {
        const rect = cardBox.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -15; 
        const rotateY = ((x - centerX) / centerX) * 15;
        
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        glare.style.transform = `translate(${x - (rect.width*1.5)}px, ${y - (rect.height*1.5)}px)`;
        glare.style.opacity = 1;
    };

    const resetCardTilt = () => {
        card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        glare.style.opacity = 0;
    };

    cardBox.addEventListener('mousemove', (e) => updateCardTilt(e.clientX, e.clientY));
    cardBox.addEventListener('mouseleave', resetCardTilt);
    
    cardBox.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const rect = cardBox.getBoundingClientRect();
        if(touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
            updateCardTilt(touch.clientX, touch.clientY);
        } else {
            resetCardTilt();
        }
    }, {passive: true});
    cardBox.addEventListener('touchend', resetCardTilt);
};

// --- Form & Accessibility Logic ---
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
    if(DOM.modal) DOM.modal.setAttribute('aria-hidden', !isOpen);
    if(DOM.openModalBtn) DOM.openModalBtn.setAttribute('aria-expanded', isOpen);
    
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

if (DOM.openModalBtn && DOM.closeModalBtn) {
    DOM.openModalBtn.addEventListener('click', () => toggleModal(true));
    DOM.closeModalBtn.addEventListener('click', () => toggleModal(false));
    DOM.modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') toggleModal(false);
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus(); e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus(); e.preventDefault();
            }
        }
    });
}

if (DOM.form) {
    DOM.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;
        DOM.form.querySelectorAll('input[required], textarea[required]').forEach(input => {
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
            
            DOM.form.style.display = 'none';
            DOM.tokenDisplay.textContent = 'ATRX-' + cryptoArr[0].toString(36).toUpperCase().padStart(6, '0');
            DOM.feedback.classList.remove('hidden');
            updateFocusTrap();
            DOM.tokenDisplay.focus();
        } catch (error) {
            console.error('Submission failed:', error);
            alert('A network error occurred. Please try again.');
        } finally {
            submitBtn.classList.remove('skeleton-loader');
            submitBtn.innerHTML = '<span class="btn-text">Submit Project Brief</span>';
            submitBtn.disabled = false;
        }
    });
}

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
        } catch (err) { console.error('Failed to copy!', err); }
    });
}

// --- Global Interaction Events ---
document.querySelector('.side-nav')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-dot')) {
        e.preventDefault();
        document.getElementById(e.target.getAttribute('data-target'))?.scrollIntoView({ behavior: 'smooth' });
    }
});

const handlePointerMove = (clientX, clientY) => {
    if (state.modalOpen) return;
    
    state.targetX = (clientX / state.winWidth) * 2 - 1;
    state.targetY = (clientY / state.winHeight) * 2 - 1;
    
    if(!state.isAnimating) {
        state.isAnimating = true;
        window.requestAnimationFrame(renderLoop);
    }
};

window.addEventListener('mousemove', (e) => handlePointerMove(e.clientX, e.clientY), { passive: true });
window.addEventListener('touchmove', (e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
window.addEventListener('touchstart', (e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });

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
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    document.querySelectorAll('.fade-in-section').forEach(section => observer.observe(section));
};

// --- Optimized Render Loop Engine ---
const renderLoop = () => {
    if (PREFERS_REDUCED_MOTION.matches && document.documentElement.scrollTop === state.targetScroll) { 
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

    if (DOM.wrapperL) DOM.wrapperL.style.transform = `translate3d(${viewportX + (state.mouseX * 15)}px, ${viewportY + (state.mouseY * 15)}px, 0)`;
    if (DOM.wrapperR) DOM.wrapperR.style.transform = `translate3d(${viewportX2 + (state.mouseX * 10)}px, ${viewportY2 + (state.mouseY * 10)}px, 0)`;

    // Calculate Hardware-Accelerated Progress Bar Bloom Updates
    const dashOffset = 100 - (scrollProgress * 100);
    if(DOM.hudBar) DOM.hudBar.style.strokeDashoffset = dashOffset;
    if(DOM.hudBarGlow) DOM.hudBarGlow.style.strokeDashoffset = dashOffset;

    let poly1 = 'polygon(', poly2 = 'polygon(';
    for (let i = 0; i < 8; i++) {
        const x = currentShape.p[i][0] + (nextShape.p[i][0] - currentShape.p[i][0]) * localProgress;
        const y = currentShape.p[i][1] + (nextShape.p[i][1] - currentShape.p[i][1]) * localProgress;
        const x2 = nextShape.p[i][0] + (nextShape2.p[i][0] - nextShape.p[i][0]) * localProgress;
        const y2 = nextShape.p[i][1] + (nextShape2.p[i][1] - nextShape.p[i][1]) * localProgress;
        poly1 += `${x}% ${y}%${i < 7 ? ', ' : ''}`;
        poly2 += `${x2}% ${y2}%${i < 7 ? ', ' : ''}`;
    }
    if(DOM.shapeL) DOM.shapeL.style.clipPath = poly1 + ')';
    if(DOM.shapeR) DOM.shapeR.style.clipPath = poly2 + ')';

    const r = Math.round(currentShape.c[0] + (nextShape.c[0] - currentShape.c[0]) * localProgress);
    const g = Math.round(currentShape.c[1] + (nextShape.c[1] - currentShape.c[1]) * localProgress);
    const b = Math.round(currentShape.c[2] + (nextShape.c[2] - currentShape.c[2]) * localProgress);
    document.documentElement.style.setProperty('--dyn-color', `rgb(${r}, ${g}, ${b})`);

    const deltaScroll = Math.abs(state.targetScroll - state.currentScroll);
    
    if (deltaScroll > 0.5 || fluidIntensity > 0.01) {
        window.requestAnimationFrame(renderLoop);
    } else {
        state.isAnimating = false;
    }
};

const initApp = () => {
    setupSolarSystem();
    setupTerminal();
    setupHoloCard();
    
    setTimeout(() => {
        calculateMaxScroll();
        setupObserver();
        state.targetScroll = window.scrollY;
        state.currentScroll = window.scrollY;
        state.isAnimating = true;
        window.requestAnimationFrame(renderLoop);
    }, 100);
};

if (document.readyState !== 'loading') {
    initApp();
} else {
    document.addEventListener('DOMContentLoaded', initApp);
}
