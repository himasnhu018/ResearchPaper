/**
 * Main JavaScript functionality for the website
 * - Smooth scrolling for anchor links
 * - Navigation highlighting based on scroll position
 * - Mobile menu handling
 */
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScrolling();
    initScrollSpy();
    initMobileMenu();
});

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const HEADER_OFFSET = 70;
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - HEADER_OFFSET,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize scroll spy to highlight active navigation links
 */
function initScrollSpy() {
    const SCROLL_OFFSET = 100;
    const navLinks = document.querySelectorAll('nav ul li a');
    let sections = [];
    
    // Cache section references for better performance
    navLinks.forEach(link => {
        const sectionId = link.getAttribute('href').substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
            sections.push({ id: sectionId, element: section });
        }
    });
    
    // Throttle scroll event for better performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                highlightCurrentSection();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial call to highlight the correct section
    highlightCurrentSection();
    
    function highlightCurrentSection() {
        const scrollPosition = window.pageYOffset;
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.element.offsetTop - SCROLL_OFFSET;
            const sectionHeight = section.element.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        navLinks.forEach(link => {
            // Use classList instead of directly manipulating style properties
            link.classList.toggle('active-nav', 
                link.getAttribute('href') === `#${currentSection}`);
        });
    }
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    const body = document.body;
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    body.appendChild(overlay);
    
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Toggle body scroll
        body.style.overflow = hamburger.classList.contains('active') ? 'hidden' : '';
    }
    
    // Event listeners
    hamburger?.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    
    // Close menu when clicking navigation links
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger?.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Media query listener for responsive design
    const mediaQuery = window.matchMedia('(min-width: 769px)');
    
    function handleScreenChange(e) {
        if (e.matches && hamburger?.classList.contains('active')) {
            toggleMenu();
        }
    }
    
    // Initial check and listener
    mediaQuery.addEventListener('change', handleScreenChange);
}