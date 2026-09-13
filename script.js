'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // 1. Demo Component Logic: Valuation Engine Slider
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

    // 2. Apple Glass Modal & Intake Form Logic
    const setupModal = () => {
        const modal = document.getElementById('intake-modal');
        const openBtn = document.getElementById('open-intake');
        const closeBtn = document.querySelector('.close-modal');
        const form = document.getElementById('intake-form');
        const feedback = document.getElementById('form-feedback');
        const tokenDisplay = document.getElementById('tracking-token');
        
        if (!modal || !openBtn || !closeBtn || !form) return;

        // Focus trapping variables for accessibility
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

    // Initialize
    setupValuationSlider();
    setupModal();
});
