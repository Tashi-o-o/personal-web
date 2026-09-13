/* Color Variables - Warm, Earthy, Glassmorphic Theme */
:root {
    --bg-base: #f7f4ee;
    --text-main: #3e2723;
    --text-muted: #795548;
    --accent-light: #d7ccc8;
    --accent-brand: #8b5a2b;
    --accent-glow: rgba(215, 204, 200, 0.6);
    
    /* Premium Glassmorphism Properties */
    --glass-bg: rgba(255, 255, 255, 0.45);
    --glass-border: rgba(255, 255, 255, 0.8);
    --glass-shadow: 0 12px 32px rgba(93, 64, 55, 0.08);
}

* { box-sizing: border-box; }

html { 
    scroll-behavior: smooth; 
    font-size: 16px; 
}

body {
    margin: 0;
    padding: 0;
    font-family: 'Outfit', system-ui, sans-serif;
    background-color: var(--bg-base);
    color: var(--text-main);
    overflow-x: hidden;
    line-height: 1.6;
}

/* --- Optimized Organic Background --- */
.bg-mesh {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    background: #fdfbf7;
}

.ambient-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.6;
    will-change: transform;
    animation: drift 20s infinite alternate ease-in-out;
}

.blob-warm {
    width: 60vw; height: 60vw;
    background: #f3e5f5;
    top: -10%; left: -10%;
    animation-delay: 0s;
}

.blob-sand {
    width: 50vw; height: 50vw;
    background: #ffecb3;
    bottom: -10%; right: -5%;
    animation-delay: -5s;
}

.blob-coffee {
    width: 40vw; height: 40vw;
    background: #d7ccc8;
    top: 40%; left: 30%;
    animation-delay: -10s;
}

@keyframes drift {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(10vw, 5vh) scale(1.1); }
}

/* --- Floating Navigation --- */
.glass-nav {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    max-width: 800px;
    padding: 12px 24px;
    background: var(--glass-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    border-radius: 50px;
    box-shadow: var(--glass-shadow);
    z-index: 1000;
}

.nav-logo { font-weight: 700; font-size: 1.2rem; color: var(--accent-brand); letter-spacing: 1px;}
.nav-links { display: flex; gap: 20px; align-items: center; }
.nav-links a { text-decoration: none; color: var(--text-muted); font-size: 0.95rem; font-weight: 500; transition: color 0.3s; }
.nav-links a:hover { color: var(--accent-brand); }
.nav-btn { background: var(--text-main); color: #fff !important; padding: 6px 16px; border-radius: 30px; font-weight: 600; }

/* --- Global Glass Tile (The Core Aesthetic) --- */
.glass-tile {
    background: linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-top: 1px solid rgba(255,255,255,1);
    border-left: 1px solid rgba(255,255,255,1);
    border-radius: 24px;
    box-shadow: var(--glass-shadow);
    padding: 2.5rem;
    position: relative;
    overflow: hidden;
}

/* --- Layout: Bento Box Grid --- */
.content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 120px 20px 60px 20px;
    display: flex;
    flex-direction: column;
    gap: 4rem;
}

.bento-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.span-2 { grid-column: span 2; }

/* Typography inside tiles */
.eyebrow { display: inline-block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 700; color: var(--accent-brand); margin-bottom: 1rem; padding: 4px 10px; background: rgba(139, 90, 43, 0.1); border-radius: 6px; }
h1, h2, h3 { margin-top: 0; color: var(--text-main); font-weight: 700; letter-spacing: -0.02em; }
h1 { font-size: clamp(2.5rem, 5vw, 4rem); line-height: 1.1; margin-bottom: 1rem; }
h2 { font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 1rem; }
h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
p { color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 0; }

/* Specific Grid Adjustments */
.hero-grid { grid-template-columns: 2fr 1fr; }
.feature-tile { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; text-align: left; }
.icon-wrap { font-size: 2rem; margin-bottom: 1rem; background: #fff; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

/* --- Interactive Hover Cards (JS tracks mouse position) --- */
.interactive-card {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
    cursor: pointer;
}
.interactive-card:hover {
    transform: translateY(-5px);
    border-color: #fff;
}
.card-glare {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
    background: radial-gradient(circle 300px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.8), transparent 80%);
    pointer-events: none;
    z-index: 1;
}
.interactive-card:hover .card-glare { opacity: 1; }
.card-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column;}

/* --- Component Showcase UI Demos --- */
.ui-demo-box { margin-top: 1.5rem; padding: 1.5rem; background: rgba(255,255,255,0.4); border-radius: 16px; border: 1px solid rgba(255,255,255,0.5); flex-grow: 1; display: flex; flex-direction: column; justify-content: center;}

/* Demo 1: Calendar */
.calendar-ui { text-align: center; }
.cal-header { font-weight: 600; margin-bottom: 1rem; font-size: 0.9rem;}
.cal-days { display: flex; justify-content: space-between; margin-bottom: 1rem; }
.day { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #fff; border-radius: 10px; font-weight: 500; font-size: 0.9rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05);}
.day.active { background: var(--text-main); color: #fff; }
.day.booked { opacity: 0.4; text-decoration: line-through; background: transparent; box-shadow: none; border: 1px solid rgba(0,0,0,0.1);}
.ui-btn { width: 100%; padding: 10px; background: var(--text-main); color: #fff; border: none; border-radius: 8px; font-family: inherit; font-weight: 600; cursor: pointer;}

/* Demo 2: Slider */
.slider-ui { text-align: center; }
.val-display { font-size: 2rem; font-weight: 700; color: var(--accent-brand); margin-bottom: 1rem; }
.slider-ui label { display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px;}
input[type=range] { -webkit-appearance: none; width: 100%; background: transparent; }
input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 20px; width: 20px; border-radius: 50%; background: #fff; border: 2px solid var(--text-main); cursor: pointer; margin-top: -8px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 4px; cursor: pointer; background: rgba(0,0,0,0.1); border-radius: 2px; }

/* Demo 3: Empty State Skeleton */
.empty-state { gap: 10px; }
.skeleton-line { height: 12px; background: rgba(0,0,0,0.05); border-radius: 6px; width: 100%; }
.skeleton-line.short { width: 60%; }
.skeleton-box { height: 80px; background: rgba(0,0,0,0.05); border-radius: 12px; width: 100%; margin-top: 10px;}

/* --- Pricing Tiers --- */
.pricing-grid { align-items: stretch; }
.pricing-card { display: flex; flex-direction: column; }
.pricing-card.featured { border: 2px solid var(--accent-brand); transform: scale(1.02); }
.pricing-card.featured:hover { transform: scale(1.02) translateY(-5px); }
.featured-badge { position: absolute; top: 0; right: 0; background: var(--accent-brand); color: #fff; font-size: 0.75rem; font-weight: 700; padding: 6px 12px; border-bottom-left-radius: 16px; text-transform: uppercase; letter-spacing: 1px;}
.price { font-size: 1.5rem; font-weight: 700; color: var(--accent-brand); margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(0,0,0,0.1); }
.target { font-size: 0.9rem; margin-bottom: 1rem; }
.deliverables { list-style: none; padding: 0; margin: 0; font-size: 0.9rem; }
.deliverables li { position: relative; padding-left: 1.5rem; margin-bottom: 0.75rem; }
.deliverables li::before { content: '✓'; position: absolute; left: 0; color: var(--accent-brand); font-weight: bold;}

/* --- Buttons & Forms --- */
.contact-tile { text-align: center; }
.button-group { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap;}
.primary-btn, .secondary-btn { padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 1rem; font-family: inherit; cursor: pointer; transition: all 0.2s; border: none; text-decoration: none;}
.primary-btn { background: var(--text-main); color: #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
.primary-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.3); }
.secondary-btn { background: rgba(255,255,255,0.6); color: var(--text-main); border: 1px solid var(--glass-border); }
.secondary-btn:hover { background: #fff; transform: translateY(-2px); }

/* --- Modal --- */
.modal-overlay { position: fixed; inset: 0; background: rgba(247, 244, 238, 0.6); backdrop-filter: blur(10px); z-index: 9999; display: flex; align-items: center; justify-content: center; opacity: 0; visibility: hidden; transition: all 0.3s ease; }
.modal-overlay.active { opacity: 1; visibility: visible; }
.modal-content { max-width: 500px; width: 90%; position: relative; transform: translateY(20px); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-overlay.active .modal-content { transform: translateY(0); }
.close-modal { position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 2rem; color: var(--text-muted); cursor: pointer; line-height: 1;}

.input-group { margin-bottom: 1.5rem; text-align: left; }
.input-group label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; }
.input-group input, .input-group textarea { width: 100%; background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.1); padding: 12px; border-radius: 8px; font-family: inherit; font-size: 1rem; color: var(--text-main); transition: border-color 0.2s, background 0.2s;}
.input-group input:focus, .input-group textarea:focus { outline: none; border-color: var(--accent-brand); background: #fff;}
.full-width { width: 100%; }
.hidden { display: none !important; }
.feedback-container { text-align: center; padding: 2rem 0; }
.token-display { font-family: monospace; font-size: 1.5rem; font-weight: 700; color: var(--accent-brand); background: rgba(255,255,255,0.8); border: 1px dashed var(--accent-brand); padding: 1rem; border-radius: 8px; width: 100%; margin: 1rem 0; cursor: pointer;}
.token-display:hover { background: #fff; }

/* Fade-in Animation Observer */
.fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.8s ease, transform 0.8s ease; }
.fade-in.visible { opacity: 1; transform: translateY(0); }

/* --- Mobile Responsiveness --- */
@media (max-width: 768px) {
    .hero-grid { grid-template-columns: 1fr; }
    .span-2 { grid-column: span 1; }
    .span-2-mobile { grid-column: span 1; }
    
    .glass-nav { flex-direction: column; gap: 10px; border-radius: 16px; padding: 15px; }
    .nav-links { flex-wrap: wrap; justify-content: center; gap: 10px; }
    
    .content-wrapper { padding-top: 140px; }
    .glass-tile { padding: 1.5rem; }
    
    .pricing-card.featured { transform: none; border: 1px solid var(--glass-border); }
    .pricing-card.featured:hover { transform: translateY(-5px); }
    .featured-badge { border-bottom-left-radius: 12px; font-size: 0.65rem;}
}
