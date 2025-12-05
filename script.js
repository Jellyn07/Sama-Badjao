function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        // Get the href and extract just the filename
        const linkHref = link.getAttribute('href');
        const linkPage = linkHref.split('/').pop();
        
        // Remove active class from all links
        link.classList.remove('active');
        
        // Add active class to current page link
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
        
        // Special case: index.html for home page
        if (currentPage === '' || currentPage === 'index.html') {
            if (linkHref === 'index.html' || linkHref === './' || linkHref === '/') {
                link.classList.add('active');
            }
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    setActiveNavLink();
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Close mobile menu
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // --- Slideshow Functionality (Improved) ---
const slideshow = document.querySelector('.slideshow');
const slides = slideshow ? slideshow.querySelectorAll('img') : [];
let currentSlide = 0;
let slideshowInterval;
let isTransitioning = false; // Prevent rapid clicks during transition
const TRANSITION_DURATION = 600; // Match CSS transition duration

// Initialize slideshow
function initSlideshow() {
    if (slides.length === 0) return;

    // Set initial active slide
    updateActiveSlide(0);
    updateNeighborSlides();

    // Create dots navigation
    createDots();

    // Start automatic cycling
    startAutoCycle();

    // Add click handlers for manual navigation with debounce
    slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
            if (!isTransitioning && index !== currentSlide) {
                goToSlide(index);
            }
        });
    });

    // Pause on hover
    slideshow.addEventListener('mouseenter', pauseAutoCycle);
    slideshow.addEventListener('mouseleave', startAutoCycle);
}

function updateActiveSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
        slide.classList.remove('next-to-active');
    });
    
    // Update dots
    updateDots(index);
    
    // Reset transition lock after animation completes
    isTransitioning = true;
    setTimeout(() => {
        isTransitioning = false;
    }, TRANSITION_DURATION);
}

function updateNeighborSlides() {
    // Add special styling to slides next to active one
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    const nextIndex = (currentSlide + 1) % slides.length;
    
    slides[prevIndex]?.classList.add('next-to-active');
    slides[nextIndex]?.classList.add('next-to-active');
}

function nextSlide() {
    if (isTransitioning) return;
    
    currentSlide = (currentSlide + 1) % slides.length;
    updateActiveSlide(currentSlide);
    updateNeighborSlides();
}

function goToSlide(index) {
    if (isTransitioning) return;
    
    currentSlide = index;
    updateActiveSlide(currentSlide);
    updateNeighborSlides();
    resetAutoCycle();
}

function startAutoCycle() {
    clearInterval(slideshowInterval);
    slideshowInterval = setInterval(nextSlide, 2000); // 3 seconds between slides
}

function pauseAutoCycle() {
    clearInterval(slideshowInterval);
}

function resetAutoCycle() {
    clearInterval(slideshowInterval);
    startAutoCycle();
}

function createDots() {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slideshow-dots';

    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            if (!isTransitioning && index !== currentSlide) {
                goToSlide(index);
            }
        });
        dotsContainer.appendChild(dot);
    });

    slideshow.appendChild(dotsContainer);
}

function updateDots(index) {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// Initialize slideshow if it exists
if (slideshow) {
    initSlideshow();
}

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