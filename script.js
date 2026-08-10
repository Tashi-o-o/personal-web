/* Base Reset and Typography */
html {
    scroll-behavior: smooth; /* Enables smooth native scrolling */
}

body, html {
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, sans-serif;
    background-color: #08080c;
    color: #ffffff;
    overflow-x: hidden;
}

/* Edge Light SVG Positioning */
.edge-lights {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999; /* Keeps lights above everything */
    pointer-events: none; /* Prevents blocking clicks on links */
    fill: none;
    stroke: #00e5ff; /* Default start color */
    stroke-width: 4px; 
    filter: drop-shadow(0 0 10px rgba(0, 229, 255, 0.8));
    transition: filter 0.2s ease;
}

.light-line {
    stroke-dasharray: 100;
    stroke-dashoffset: 100; /* Starts completely hidden (off-screen) */
}

/* Background Architecture */
.atrunix-morph-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 0;
    background-color: #08080c;
}

/* Base Shape Properties */
.shape {
    width: min(80vw, 400px);
    height: min(80vw, 400px);
    /* CSS transitions removed; JS now handles frame-by-frame morphing */
}

/* Foreground Content */
.content {
    position: relative;
    z-index: 10;
}

.scroll-zone {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10vw;
}

/* Text Containers */
.text-block {
    background: rgba(8, 8, 12, 0.7);
    padding: 40px;
    border-radius: 12px;
    max-width: 600px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.3s ease;
}

.text-block:hover {
    transform: scale(1.02);
}

.text-block h1 {
    margin-top: 0;
    font-size: 3rem;
    margin-bottom: 20px;
}

.text-block h2 {
    margin-top: 0;
    font-size: 2.5rem;
    margin-bottom: 20px;
}

.text-block p {
    font-size: 1.2rem;
    line-height: 1.6;
    color: #d1d1d1;
}

/* Button Layout */
.button-container {
    display: flex;
    gap: 15px;
    margin-top: 30px;
    flex-wrap: wrap;
}

/* Standard Button */
.cta-button {
    display: inline-block;
    padding: 15px 30px;
    background-color: #00e5ff;
    color: #050505;
    text-decoration: none;
    font-weight: bold;
    border-radius: 5px;
    font-size: 1.1rem;
    transition: background-color 0.3s ease, transform 0.1s ease;
    text-align: center;
    flex-grow: 1;
}

.cta-button:active {
    transform: scale(0.98);
}

/* WhatsApp Override */
.whatsapp-button {
    background-color: #25D366;
    color: #ffffff;
}

.whatsapp-button:hover {
    background-color: #128C7E;
}

/* Mobile Adjustments */
@media (max-width: 600px) {
    .text-block h1 {
        font-size: 2.2rem;
    }
    .text-block h2 {
        font-size: 1.8rem;
    }
    .text-block {
        padding: 25px;
    }
}
