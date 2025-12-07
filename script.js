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

    // --- Set Active Navigation Link ---
    function setActiveNavLink() {
        // Get the current page filename (e.g., "index.html", "about.html")
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            // Remove active class from all links
            link.classList.remove('active');
            
            // Add active class to the current page's link
            if (linkHref === currentPage) {
                link.classList.add('active');
            }
            
            // Special case for home page (index.html or empty)
            if (currentPage === '' || currentPage === 'index.html') {
                if (linkHref === 'index.html') {
                    link.classList.add('active');
                }
            }
            
            // Special case for gallery.html
            if (currentPage === 'gallery.html' && linkHref === 'gallery.html') {
                link.classList.add('active');
            }
        });
    }
    
    // Call the function to set active nav link
    setActiveNavLink();
    
    // Add click event to nav links to update active state (optional)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // If mobile menu is open, close it after clicking a link
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
            }
        });
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

    initFloatingMenu();
});

function initFloatingMenu() {
    const menuItems = document.querySelectorAll('.floating-menu .menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId !== '#') {
                e.preventDefault();
                
                // Close the menu
                const menuOpen = document.getElementById('menu-open');
                if (menuOpen) {
                    menuOpen.checked = false;
                }
                
                // Smooth scroll to target
                if (targetId === '#top') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const navHeight = document.querySelector('nav').offsetHeight;
                        const targetPosition = targetElement.offsetTop - navHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });
}