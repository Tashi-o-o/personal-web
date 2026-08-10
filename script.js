document.addEventListener('scroll', () => {
    // Calculate total scroll depth as a percentage (0 to 100)
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    const shape = document.getElementById('geometry-morph');
    
    // Clear existing geometric classes
    shape.classList.remove(
        'stage-triangle', 
        'stage-square', 
        'stage-pentagon', 
        'stage-hexagon', 
        'stage-circle'
    );

    // Assign the new class based on scroll depth
    if (scrollPercent < 20) {
        shape.classList.add('stage-triangle');
    } else if (scrollPercent < 40) {
        shape.classList.add('stage-square');
    } else if (scrollPercent < 60) {
        shape.classList.add('stage-pentagon');
    } else if (scrollPercent < 80) {
        shape.classList.add('stage-hexagon');
    } else {
        shape.classList.add('stage-circle');
    }
});
