/**
 * Enhanced mobile navigation with improved accessibility
 */
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScrolling();
    initActiveNavHighlighting();
});

/**
 * Initialize the mobile menu functionality
 */
function initMobileMenu() {
    // Get elements
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    const body = document.body;
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    body.appendChild(overlay);
    
    // Toggle menu function
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevent scrolling when menu is open
        if (hamburger.classList.contains('active')) {
            body.style.overflow = 'hidden';
            
            // Set aria attributes for accessibility
            hamburger.setAttribute('aria-expanded', 'true');
            navMenu.setAttribute('aria-hidden', 'false');
        } else {
            body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
        }
    }
    
    // Set initial ARIA attributes
    if (hamburger) {
        hamburger.setAttribute('aria-controls', 'mobile-menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    }
    
    if (navMenu) {
        navMenu.id = 'mobile-menu';
        navMenu.setAttribute('aria-hidden', 'true');
        navMenu.setAttribute('aria-labelledby', 'menu-button');
    }
    
    // Add click event to hamburger
    hamburger?.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on overlay
    overlay.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on a nav link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger?.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Handle escape key to close menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hamburger?.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    // Close menu when window is resized beyond mobile breakpoint
    const mediaQuery = window.matchMedia('(min-width: 769px)');
    
    function handleScreenChange(e) {
        if (e.matches && hamburger?.classList.contains('active')) {
            toggleMenu();
        }
    }
    
    // Initial check and listener
    mediaQuery.addEventListener('change', handleScreenChange);
}

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
                
                // Update URL without page jump
                history.pushState(null, null, targetId);
                
                // Set focus to the target for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                
                // Remove focus outline
                setTimeout(() => {
                    targetElement.removeAttribute('tabindex');
                }, 1000);
            }
        });
    });
}

/**
 * Initialize active navigation highlighting based on scroll position
 */
function initActiveNavHighlighting() {
    const SCROLL_OFFSET = 100;
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = [];
    
    // Cache section references for better performance
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Only process anchor links
        if (href && href.startsWith('#')) {
            const sectionId = href.substring(1);
            const section = document.getElementById(sectionId);
            if (section) {
                sections.push({ id: sectionId, element: section, link });
            }
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
        
        // Update active class
        navLinks.forEach(link => {
            link.classList.remove('active-nav');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active-nav');
            }
        });
    }
}