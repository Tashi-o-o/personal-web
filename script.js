/* Color Variables - Warm, Elegant, Light Brown/Coffee Palette */
:root {
    --bg-base: #f4efe6;
    --text-main: #2c241b;
    --text-muted: #7a6352;
    --accent-brand: #a6603a;
    --accent-light: #e6d5c3;
    
    /* Apple Premium Glassmorphism Properties */
    --glass-bg: rgba(255, 255, 255, 0.55);
    --glass-border: rgba(255, 255, 255, 0.8);
    --glass-highlight: rgba(255, 255, 255, 0.9);
    --glass-shadow: 0 10px 40px rgba(100, 70, 50, 0.08);
    
    /* Grid Configuration */
    --grid-gap: 20px;
}

* { box-sizing: border-box; }

html { font-size: 16px; scroll-behavior: smooth; overflow-x: hidden; }

body {
    margin: 0;
    padding: 0;
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background-color: var(--bg-base);
    color: var(--text-main);
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow-x: hidden;
}

/* --- Hardware-Accelerated Static Background --- */
.organic-bg {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    background: var(--bg-base);
}

.bg-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.7;
    transform: translateZ(0); 
}

.shape-sand { width: 60vw; height: 60vw; background: #fdfbf7; top: -10%; left: -10%; }
.shape-mocha { width: 50vw; height: 50vw; background: #e6d5c3; bottom: -20%; right: -10%; }
.shape-latte { width: 40vw; height: 40vw; background: #f0e4d4; top: 30%; left: 40%; }

/* --- Windows 8 / Metro UI Architecture --- */
.metro-dashboard {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(220px, auto);
    gap: var(--grid-gap);
    padding: 4rem 2rem;
    max-width: 1200px;
    width: 100%;
}

/* Metro Spans */
.span-2x2 { grid-column: span 2; grid-row: span 2; }
.span-2x1 { grid-column: span 2; grid-row: span 1; }
.span-1x2 { grid-column: span 1; grid-row: span 2; }
.span-1x1 { grid-column: span 1; grid-row: span 1; }
.span-4x1 { grid-column: span 4; grid-row: span 1; }

/* --- Apple Glass Component --- */
.apple-glass {
    background: var(--glass-bg);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-radius: 28px;
    box-shadow: 
        var(--glass-shadow), 
        inset 0 0 0 1px var(--glass-border), 
        inset 0 2px 0 0 var(--glass-highlight);
    padding: 2rem;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* --- Scroll In/Out Animations --- */
.reveal {
    opacity: 0;
    transform: translateY(60px) scale(0.95);
    transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
    will-change: opacity, transform;
}

.reveal.in-view {
    opacity: 1;
    transform: translateY(0) scale(1);
}

/* Interactive Push Effect */
.apple-glass.in-view:active {
    transform: translateY(0) scale(0.97);
    box-shadow: inset 0 0 0 1px var(--glass-border), inset 0 2px 0 0 var(--glass-highlight);
}

/* --- Typography & Internal Tile Layouts --- */
h1, h2, h3 { margin-top: 0; color: var(--text-main); font-weight: 700; letter-spacing: -0.02em; }
h1 { font-size: clamp(2rem, 4vw, 3rem); line-height: 1.1; margin-bottom: 1rem; }
h2 { font-size: 1.8rem; margin-bottom: 0.5rem; }
h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }
p { color: var(--text-muted); font-size: 1.05rem; line-height: 1.5; margin-bottom: 0; }

.badge { display: inline-block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; color: var(--accent-brand); margin-bottom: 1rem; padding: 6px 12px; background: rgba(166, 96, 58, 0.1); border-radius: 8px; border: 1px solid rgba(166, 96, 58, 0.2);}
.solid-badge { background: var(--accent-brand); color: #fff; border: none; }
.small-text { font-size: 0.9rem; }

.flex-center { align-items: center; justify-content: center; }
.text-center { text-align: center; }
.icon-large { font-size: 2.5rem; margin-bottom: 1rem; }

/* Hero Tile */
.hero-tile { justify-content: flex-start; }
.location-tag { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: var(--text-muted); font-weight: 500; margin-top: auto; padding-top: 1.5rem;}

/* Metric Tile */
.metric-value { font-size: 3.5rem; font-weight: 700; color: var(--accent-brand); line-height: 1; margin-bottom: 0.5rem; letter-spacing: -0.05em;}
.metric-symbol { font-size: 1.5rem; color: var(--text-muted); font-weight: 500;}

/* Showcase Tiles */
.interactive-ui { background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4)); }
.calendar-mini { background: #fff; padding: 1rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); width: 100%; border: 1px solid rgba(0,0,0,0.05); margin-top: 1rem;}
.cal-days { display: flex; justify-content: space-between; margin-bottom: 0.75rem; }
.day { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: var(--bg-base); border-radius: 8px; font-weight: 600; font-size: 0.9rem; color: var(--text-muted);}
.day.active { background: var(--accent-brand); color: #fff; box-shadow: 0 4px 10px rgba(166, 96, 58, 0.3);}
.day.booked { opacity: 0.3; text-decoration: line-through; }
.cal-status { font-size: 0.75rem; font-weight: 600; color: var(--accent-brand); text-align: center; text-transform: uppercase; letter-spacing: 1px;}

/* Valuation Tile */
.valuation-tile { justify-content: space-between; }
.val-header { display: flex; justify-content: space-between; align-items: flex-start; width: 100%;}
.slider-ui { width: 100%; text-align: center; background: rgba(255,255,255,0.4); padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.5);}
.val-display { font-size: 2.5rem; font-weight: 700; color: var(--accent-brand); margin-bottom: 1rem; line-height: 1;}
input[type=range] { -webkit-appearance: none; width: 100%; background: transparent; }
input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 24px; width: 24px; border-radius: 50%; background: #fff; border: 2px solid var(--accent-brand); cursor: pointer; margin-top: -10px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 4px; cursor: pointer; background: rgba(0,0,0,0.1); border-radius: 2px; }

/* Pricing Tiles */
.pricing-header { display: flex; flex-direction: column; margin-bottom: 0.5rem; }
.price { font-size: 1.25rem; font-weight: 700; color: var(--accent-brand); }
.block-price { display: block; font-size: 1.8rem; margin-bottom: 1rem; line-height: 1;}
.target { font-size: 0.9rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.08); }
.deliverables { list-style: none; padding: 0; margin: 0; font-size: 0.95rem; color: var(--text-main); }
.deliverables li { position: relative; padding-left: 1.5rem; margin-bottom: 0.75rem; }
.deliverables li::before { content: '•'; position: absolute; left: 0; color: var(--accent-brand); font-size: 1.5rem; line-height: 0.8;}
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 0 1rem; }

/* CTA Tile */
.cta-tile p { margin-bottom: 2rem; max-width: 600px;}
.button-row { display: flex; gap: 1rem; }
.btn { padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 1rem; font-family: inherit; cursor: pointer; transition: all 0.2s; border: none; text-decoration: none; display: inline-flex; align-items: center; justify-content: center;}
.btn-primary { background: var(--text-main); color: #fff; box-shadow: 0 4px 12px rgba(44, 36, 27, 0.2); }
.btn-primary:hover { background: #000; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(44, 36, 27, 0.3); }
.btn-secondary { background: rgba(255,255,255,0.8); color: var(--text-main); box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1); }
.btn-secondary:hover { background: #fff; transform: translateY(-2px); }

/* --- Apple Glass Modal --- */
.modal-overlay { position: fixed; inset: 0; background: rgba(244, 239, 230, 0.4); backdrop-filter: blur(12px); z-index: 9999; display: flex; align-items: center; justify-content: center; opacity: 0; visibility: hidden; transition: all 0.4s ease; }
.modal-overlay.active { opacity: 1; visibility: visible; }
.modal-content { max-width: 450px; width: 90%; transform: translateY(30px) scale(0.95); transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-overlay.active .modal-content { transform: translateY(0) scale(1); }
.close-modal { position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.05); border: none; font-size: 1.5rem; color: var(--text-main); cursor: pointer; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s;}
.close-modal:hover { background: rgba(0,0,0,0.1); }
.modal-sub { margin-bottom: 1.5rem; font-size: 0.95rem;}

.input-group { margin-bottom: 1.25rem; text-align: left; width: 100%;}
.input-group label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--text-muted);}
.input-group input, .input-group textarea { width: 100%; background: rgba(255,255,255,0.7); border: 1px solid rgba(0,0,0,0.1); padding: 14px; border-radius: 12px; font-family: inherit; font-size: 1rem; color: var(--text-main); transition: border-color 0.2s, background 0.2s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);}
.input-group input:focus, .input-group textarea:focus { outline: none; border-color: var(--accent-brand); background: #fff;}
.full-width { width: 100%; margin-top: 0.5rem;}

.hidden { display: none !important; }
.feedback-container { text-align: center; padding: 1rem 0; width: 100%;}
.token-display { font-family: 'JetBrains Mono', monospace; font-size: 1.75rem; font-weight: 700; color: var(--text-main); background: #fff; border: 1px solid rgba(0,0,0,0.1); padding: 1rem; border-radius: 12px; width: 100%; margin: 1rem 0; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.05); transition: transform 0.1s, background 0.3s, color 0.3s;}
.token-display:active { transform: scale(0.98); }

/* --- Responsive Grid Adjustments --- */
@media (max-width: 1024px) {
    .metro-dashboard { grid-template-columns: repeat(3, 1fr); padding: 3rem 1.5rem;}
    .span-4x1 { grid-column: span 3; }
}

@media (max-width: 768px) {
    .metro-dashboard { grid-template-columns: repeat(2, 1fr); padding: 2rem 1rem;}
    .span-2x2, .span-2x1, .span-4x1 { grid-column: span 2; }
    .two-col { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
    .metro-dashboard { grid-template-columns: 1fr; }
    .span-2x2, .span-2x1, .span-1x2, .span-4x1 { grid-column: span 1; grid-row: auto; }
    .apple-glass { padding: 1.5rem; border-radius: 20px;}
    .button-row { flex-direction: column; width: 100%; }
    .btn { width: 100%; }
}
