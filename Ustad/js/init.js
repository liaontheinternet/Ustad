// Initialization and Scroll Reveal Functionality

// Function to initialize the application
function init() {
    console.log('Application initialized.');
    // Additional initialization code here...
}

// Function to reveal elements on scroll
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
            reveal.classList.add('active');
        } else {
            reveal.classList.remove('active');
        }
    });
}

// Event listener for scroll
window.addEventListener('scroll', reveal);

// Initialize the application
init();