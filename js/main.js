// Main JavaScript for navigation and general functionality

document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const offsetTop = target.offsetTop - 70;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animated counter for stats
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 100;
        const duration = 2000;
        const stepTime = duration / 100;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + '+';
        }, stepTime);
    };

    // Intersection Observer for counter animation
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateCounter(stat, target);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }

    // Modal functionality
    const modal = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    closeButtons.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        modal.forEach(m => {
            if (e.target === m) {
                m.style.display = 'none';
            }
        });
    });

    // Add escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.forEach(m => {
                m.style.display = 'none';
            });
        }
    });

    // Scroll animations - but exclude member cards as they're rendered dynamically
    const fadeElements = document.querySelectorAll('.achievement-card, .event-card, .alumni-card');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        fadeObserver.observe(element);
    });
});

// Utility function to format dates - handles multiple date formats
function formatDate(dateString) {
    if (!dateString || dateString.trim() === '') {
        return 'Date not available';
    }
    
    let date;
    const trimmed = dateString.trim();
    
    // Try to parse the date string
    // Format: M-DD-YYYY (4-17-2023)
    const dashFormat = trimmed.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (dashFormat) {
        date = new Date(dashFormat[3], parseInt(dashFormat[1]) - 1, dashFormat[2]);
    }
    
    // Format: "November 16, 2024" or "November 16 2024"
    if (!date || isNaN(date.getTime())) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
        const monthRegex = new RegExp(`(${monthNames.join('|')})\\s+(\\d{1,2})[,\\s]+(\\d{4})`, 'i');
        const monthMatch = trimmed.match(monthRegex);
        
        if (monthMatch) {
            const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthMatch[1].toLowerCase());
            date = new Date(monthMatch[3], monthIndex, monthMatch[2]);
        }
    }
    
    // Format: "DD Month YYYY" (8 December, 2024 or 8 December 2024 or 09 March, 2025)
    if (!date || isNaN(date.getTime())) {
        const dayMonthFormat = /^(\d{1,2})\s+([a-zA-Z]+)[,\s]+(\\d{4})$/;
        const dayMonthMatch = trimmed.match(dayMonthFormat);
        
        if (dayMonthMatch) {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                              'July', 'August', 'September', 'October', 'November', 'December'];
            const monthIndex = monthNames.findIndex(m => m.toLowerCase() === dayMonthMatch[2].toLowerCase());
            if (monthIndex !== -1) {
                date = new Date(dayMonthMatch[3], monthIndex, dayMonthMatch[1]);
            }
        }
    }
    
    // Format: "YYYY-MM-DD" (standard ISO format)
    if (!date || isNaN(date.getTime())) {
        const isoFormat = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (isoFormat) {
            date = new Date(isoFormat[1], parseInt(isoFormat[2]) - 1, isoFormat[3]);
        }
    }
    
    // Format: "DD/MM/YYYY"
    if (!date || isNaN(date.getTime())) {
        const slashFormat = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (slashFormat) {
            date = new Date(slashFormat[3], parseInt(slashFormat[2]) - 1, slashFormat[1]);
        }
    }
    
    // If still no valid date, try generic Date parsing as last resort
    if (!date || isNaN(date.getTime())) {
        date = new Date(dateString);
    }
    
    // Check if we have a valid date
    if (isNaN(date.getTime())) {
        return trimmed; // Return original string if can't parse
    }
    
    // Format as: "Month DD, YYYY" (e.g., "April 17, 2023")
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Utility function to check if date is upcoming
function isUpcoming(dateString) {
    return new Date(dateString) > new Date();
}

// Show loading state
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading">Loading...</div>';
    }
}

// Show error message
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="error" style="text-align: center; color: var(--danger); padding: 40px;">${message}</div>`;
    }
}
