'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // 1. Momentum Smooth Scroll Engine (The "Heavy, Butter Smooth" Feel)
    const setupSmoothScroll = () => {
        const body = document.body;
        const scrollWrapper = document.getElementById('scroll-wrapper');
        const tiles = document.querySelectorAll('.tile-wrapper');
        
        // Only run on desktop. Mobile browsers handle touch momentum natively perfectly.
        if (window.innerWidth <= 600 || !scrollWrapper) {
            // Fallback for mobile: standard intersection observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) entry.target.classList.add('show');
                    else entry.target.classList.remove('show');
                });
            }, { threshold: 0.1 });
            tiles.forEach(el => observer.observe(el));
            return;
        }

        let targetY = 0;
        let currentY = 0;
        // Ease factor controls the "weight" of the scroll. Lower = heavier/smoother.
        const ease = 0.06; 

        // Set body height to match the absolutely positioned wrapper
        const setBodyHeight = () => {
            body.style.height = `${scrollWrapper.getBoundingClientRect().height}px`;
        };
        
        // Give DOM time to calculate grid heights
        setTimeout(setBodyHeight, 100);
        window.addEventListener('resize', setBodyHeight);

        // Map tile positions once to avoid layout thrashing in the render loop
        let tileOffsets = [];
        const mapTiles = () => {
            tileOffsets = Array.from(tiles).map(tile => {
                return {
                    el: tile,
                    top: tile.offsetTop,
                    triggered: false
                };
            });
        };
        setTimeout(mapTiles, 150);
        window.addEventListener('resize', mapTiles);

        // The high-performance render loop
        const render = () => {
            targetY = window.scrollY;
            currentY += (targetY - currentY) * ease;
            
            // Hardware accelerated translation
            scrollWrapper.style.transform = `translate3d(0, -${currentY}px, 0)`;

            // High-performance scroll tracking for entrance animations
            const triggerPoint = currentY + (window.innerHeight * 0.9); // Trigger slightly before it hits bottom of screen
            
            for (let i = 0; i < tileOffsets.length; i++) {
                const tileData = tileOffsets[i];
                if (triggerPoint > tileData.top && !tileData.triggered) {
                    tileData.el.classList.add('show');
                    tileData.triggered = true;
                } else if (triggerPoint < tileData.top && tileData.triggered) {
                    tileData.el.classList.remove('show');
                    tileData.triggered = false;
                }
            }

            requestAnimationFrame(render);
        };

        requestAnimationFrame(render);
    };

    // 2. Demo Component Logic: Valuation Engine Slider
    const setupValuationSlider = () => {
        const slider = document.getElementById('val-range');
        const priceDisplay = document.getElementById('val-price');
        
        if (slider && priceDisplay) {
            slider.addEventListener('input', (e) => {
                const baseValue = 3500;
                const multiplier = e.target.value;
                const calculatedValue = baseValue + (multiplier * 245);
                priceDisplay.textContent = calculatedValue.toLocaleString('en-IN');
            });
        }
    };

    // 3. Apple Glass Modal & Intake Form Logic
    const setupModal = () => {
        const modal = document.getElementById('intake-modal');
        const openBtn = document.getElementById('open-intake');
        const closeBtn = document.querySelector('.close-modal');
        const form = document.getElementById('intake-form');
        const feedback = document.getElementById('form-feedback');
        const tokenDisplay = document.getElementById('tracking-token');
        
        if (!modal || !openBtn || !closeBtn || !form) return;

        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        let firstFocusableElement, lastFocusableElement;

        const updateFocusTrap = () => {
            const focusableContent = modal.querySelectorAll(focusableElements);
            if(focusableContent.length > 0) {
                firstFocusableElement = focusableContent[0];
                lastFocusableElement = focusableContent[focusableContent.length - 1];
            }
        };

        const toggleModal = (isOpen) => {
            modal.setAttribute('aria-hidden', !isOpen);
            openBtn.setAttribute('aria-expanded', isOpen);
            
            if (isOpen) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; 
                updateFocusTrap();
                setTimeout(() => firstFocusableElement?.focus(), 100);
            } else {
                modal.classList.remove('active');
                document.body.style.overflow = ''; 
                
                setTimeout(() => {
                    form.style.display = 'block';
                    feedback.classList.add('hidden');
                    form.reset();
                    form.querySelectorAll('input, textarea').forEach(el => el.style.borderColor = '');
                    openBtn.focus();
                }, 400);
            }
        };

        openBtn.addEventListener('click', () => toggleModal(true));
        closeBtn.addEventListener('click', () => toggleModal(false));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) toggleModal(false);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                toggleModal(false);
            }
            if (e.key === 'Tab' && modal.classList.contains('active')) {
                if (e.shiftKey && document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus(); 
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus(); 
                    e.preventDefault();
                }
            }
        });

        // Form Submission Logic
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const requiredInputs = form.querySelectorAll('[required]');
            let isValid = true;
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#ff4d4d'; 
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            });

            if (!isValid) return;

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;

            setTimeout(() => {
                const cryptoArr = new Uint32Array(1);
                window.crypto.getRandomValues(cryptoArr);
                const token = 'ATRX-' + cryptoArr[0].toString(36).toUpperCase().padStart(6, '0');
                
                form.style.display = 'none';
                tokenDisplay.textContent = token;
                feedback.classList.remove('hidden');
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                updateFocusTrap();
                tokenDisplay.focus();
            }, 800);
        });

        // Token Copy functionality
        if (tokenDisplay) {
            tokenDisplay.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(tokenDisplay.textContent);
                    
                    const originalBg = tokenDisplay.style.background;
                    const originalColor = tokenDisplay.style.color;
                    
                    tokenDisplay.style.background = 'var(--accent-brand)';
                    tokenDisplay.style.color = '#fff';
                    
                    setTimeout(() => {
                        tokenDisplay.style.background = originalBg;
                        tokenDisplay.style.color = originalColor;
                    }, 800);
                } catch (err) {
                    console.error('Failed to copy token:', err);
                }
            });
        }
    };

    // Initialization Sequence
    setupSmoothScroll();
    setupValuationSlider();
    setupModal();
});
