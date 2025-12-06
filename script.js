document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Navigation Toggle ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('h2, p, img, .team-card');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100; // How much pixel before element shows

        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            
            // Add 'reveal' class initially if not present
            if (!element.classList.contains('reveal')) {
                element.classList.add('reveal');
            }

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    
    // Trigger once on load
    revealOnScroll();
});