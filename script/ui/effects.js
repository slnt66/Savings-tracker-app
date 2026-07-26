// Hover total savings card effect 
// include lib/vanilla-tilt.min.js 
const statsCard = document.querySelector('.user_statistics > .stat_card');

VanillaTilt.init(statsCard, {
    max:3,
    glare: true,
    'max-glare': 0.2,
    scale: 1.02,
    speed:  10000, 
});