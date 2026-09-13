'use strict';

// 1. Intersection Observer for smooth scrolling fade-ins
const setupObserver = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(section => observer.observe(section));
};

// 2. Interactive Glass Tile Hover Effect (Updates CSS Variables for the Glare)
const setupGlassCards = () => {
    const cards = document.querySelectorAll('.interactive-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set CSS variables directly on the card element
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
};

// 3. Demo Component Logic: Valuation Engine Slider
const setupValuationSlider = () => {
    const slider = document.getElementById('val-range');
    const priceDisplay = document.getElementById('val-price');
    
    if (slider && priceDisplay) {
        slider.addEventListener('input', (e) => {
            // Simulated calculation logic
            const baseValue = 3500;
            const multiplier = e.target.value;
            const calculatedValue = baseValue + (multiplier * 245);
            
            // Format number to INR string
            priceDisplay.textContent = calculatedValue.toLocaleString('en-IN');
        });
    }
};

// 4. Modal & Intake Form Logic
const setupModal = () => {
    const modal = document.getElementById('intake-modal');
    const openBtn = document.getElementById('open-intake');
    const closeBtn = document.querySelector('.close-modal');
    const form = document.getElementById('intake-form');
    const feedback = document.getElementById('form-feedback');
    const tokenDisplay = document.getElementById('tracking-token');
    
    if (!modal || !openBtn || !closeBtn || !form) return;

    const toggleModal = (isOpen) => {
        if (isOpen) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset form state after closing
            setTimeout(() => {
                form.style.display = 'block';
                feedback.classList.add('hidden');
                form.reset();
            }, 300);
        }
    };

    openBtn.addEventListener('click', () => toggleModal(true));
    closeBtn.addEventListener('click', () => toggleModal(false));
    
    // Close on escape key or clicking outside modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) toggleModal(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) toggleModal(false);
    });

    // Form Submission Logic
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic Validation
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

        // UI Feedback: Simulate processing
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Generate pseudo-random token
            const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
            
            form.style.display = 'none';
            tokenDisplay.textContent = `ATRX-${randomString}`;
            feedback.classList.remove('hidden');
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1200);
    });

    // Token Copy functionality
    if (tokenDisplay) {
        tokenDisplay.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(tokenDisplay.textContent);
                const originalBg = tokenDisplay.style.background;
                tokenDisplay.style.background = '#d4a373';
                tokenDisplay.style.color = '#fff';
                setTimeout(() => {
                    tokenDisplay.style.background = originalBg;
                    tokenDisplay.style.color = '';
                }, 1000);
            } catch (err) {
                console.error('Failed to copy token:', err);
            }
        });
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    setupObserver();
    setupGlassCards();
    setupValuationSlider();
    setupModal();
});
