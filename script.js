// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }, 2000);
});

// ===== NAVIGATION =====
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelectorAll('.nav-link');

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===== TYPING EFFECT =====
const typingText = document.querySelector('.typing-text');
const phrases = [
    'Junior MERN Stack Developer',
    'Full Stack JavaScript Developer',
    'Backend Enthusiast',
    'Problem Solver'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect
typeEffect();

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.classList.remove('hidden');
        }
    });
}, observerOptions);

// Observe all sections and cards
const animatedElements = document.querySelectorAll(
    '.skill-card, .project-card, .timeline-item, .contact-card, .about-card, .stat-item'
);

animatedElements.forEach(el => {
    el.classList.add('hidden');
    observer.observe(el);
});

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-number');
let hasAnimated = false;

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const increment = target / 100;
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current);
                        setTimeout(updateCounter, 20);
                    } else {
                        counter.textContent = target + '+';
                    }
                };

                updateCounter();
            });
        }
    });
}, { threshold: 0.5 });

const aboutSection = document.querySelector('.about-stats');
if (aboutSection) {
    counterObserver.observe(aboutSection);
}

// ===== SKILL PROGRESS BARS =====
const progressBars = document.querySelectorAll('.progress-bar');

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target;
            const progress = progressBar.getAttribute('data-progress');
            progressBar.style.width = progress + '%';
        }
    });
}, { threshold: 0.5 });

progressBars.forEach(bar => {
    progressObserver.observe(bar);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== CONTACT FORM WITH FORMSPREE =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.querySelector('.form-status');

if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalHTML = submitBtn.innerHTML;

        // Disable button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.innerHTML = '<p class="success">✅ Message sent successfully! I\'ll get back to you soon.</p>';
                contactForm.reset();
            } else {
                formStatus.innerHTML = '<p class="error">❌ Oops! Something went wrong. Please try again.</p>';
            }
        } catch (error) {
            formStatus.innerHTML = '<p class="error">❌ Network error. Please try again later.</p>';
        }

        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;

        // Clear status after 5 seconds
        setTimeout(() => {
            formStatus.innerHTML = '';
        }, 5000);
    });
}

// ===== SCROLL TO TOP BUTTON =====
const scrollTopBtn = document.getElementById('scrollTopBtn');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== CURSOR EFFECT (OPTIONAL ENHANCEMENT) =====
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    const speed = 0.15;
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Add hover effect to interactive elements
const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-card');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
    });
});

// ===== PARALLAX EFFECT FOR HERO ORBS =====
window.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        const xMove = (x - 0.5) * speed;
        const yMove = (y - 0.5) * speed;
        orb.style.transform = `translate(${xMove}px, ${yMove}px)`;
    });
});

console.log('Portfolio loaded successfully! 🚀');

// ===== LOADING SCREEN =====
// Hide loader when page is ready
const loader = document.getElementById('loader');

// Fallback: Hide after 1.5 seconds even if page isn't fully loaded
setTimeout(() => {
    if (loader) {
        loader.classList.add('hidden');
    }
}, 1500);

// Also hide when page fully loads
window.addEventListener('load', () => {
    if (loader) {
        loader.classList.add('hidden');
    }
});

// Hide on DOMContentLoaded (faster)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 1000);
});

// ===== SCROLL PROGRESS BAR =====
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    sunIcon.classList.toggle('hidden');
    moonIcon.classList.toggle('hidden');

    // Save preference
    const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);

    // Add animation effect
    themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'scale(1) rotate(0deg)';
    }, 300);

    // Trigger confetti effect on theme change
    createThemeChangeEffect();
});

// Keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + L)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        themeToggle.click();
    }
});

// Theme change visual effect
function createThemeChangeEffect() {
    const colors = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b'];
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = themeToggle.getBoundingClientRect().left + 30 + 'px';
        particle.style.top = themeToggle.getBoundingClientRect().top + 30 + 'px';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.borderRadius = '50%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10000';
        particle.style.transition = 'all 0.8s ease-out';
        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / 20;
        const velocity = 50 + Math.random() * 50;

        setTimeout(() => {
            particle.style.transform = `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px)`;
            particle.style.opacity = '0';
        }, 10);

        setTimeout(() => {
            particle.remove();
        }, 800);
    }
}

// ===== MOBILE TOUCH RIPPLE EFFECT =====
const canvas = document.getElementById('rippleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ripples = [];

class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 100;
        this.speed = 3;
        this.opacity = 1;
    }

    update() {
        this.radius += this.speed;
        this.opacity = 1 - (this.radius / this.maxRadius);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99, 102, 241, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function addRipple(x, y) {
    ripples.push(new Ripple(x, y));
}

function animateRipples() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ripples = ripples.filter(ripple => ripple.radius < ripple.maxRadius);

    ripples.forEach(ripple => {
        ripple.update();
        ripple.draw();
    });

    requestAnimationFrame(animateRipples);
}

animateRipples();

// Touch events for mobile
document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    addRipple(touch.clientX, touch.clientY);
});

// Click events for desktop
document.addEventListener('click', (e) => {
    addRipple(e.clientX, e.clientY);
});

// Resize canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ===== 3D TILT EFFECT =====
const tiltElements = document.querySelectorAll('[data-tilt]');

tiltElements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        element.style.setProperty('--tilt-x', `${rotateX}deg`);
        element.style.setProperty('--tilt-y', `${rotateY}deg`);
    });

    element.addEventListener('mouseleave', () => {
        element.style.setProperty('--tilt-x', '0deg');
        element.style.setProperty('--tilt-y', '0deg');
    });
});

// ===== MAGNETIC BUTTON EFFECT =====
const magneticButtons = document.querySelectorAll('.btn-magnetic');

magneticButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
    });
});

// ===== PARALLAX EFFECT FOR SECTIONS =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    document.querySelectorAll('.parallax-section').forEach((section, index) => {
        const speed = (index + 1) * 0.05;
        const offset = scrolled * speed;
        section.style.setProperty('--parallax-offset', `${offset}px`);
    });
});

// ===== ENHANCED MOBILE GESTURES =====
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    if (!touchStartX || !touchStartY) return;

    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Swipe detection (optional - can be used for navigation)
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 50) {
            // Swipe left
        } else if (diffX < -50) {
            // Swipe right
        }
    }
});

// ===== SHAKE TO REFRESH (MOBILE) =====
let lastX = 0, lastY = 0, lastZ = 0;
let shakeThreshold = 15;

if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', (e) => {
        const acceleration = e.accelerationIncludingGravity;
        const x = acceleration.x;
        const y = acceleration.y;
        const z = acceleration.z;

        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);

        if (deltaX > shakeThreshold || deltaY > shakeThreshold || deltaZ > shakeThreshold) {
            // Shake detected - add fun animation
            document.body.style.animation = 'shake 0.5s';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 500);
        }

        lastX = x;
        lastY = y;
        lastZ = z;
    });
}

// ===== INTERSECTION OBSERVER FOR STAGGER ANIMATIONS =====
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-tag, .tech-tag').forEach(tag => {
    tag.style.opacity = '0';
    tag.style.transform = 'translateY(20px)';
    tag.style.transition = 'all 0.5s ease';
    staggerObserver.observe(tag);
});

// ===== EASTER EGG: KONAMI CODE =====
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Fun animation when Konami code is entered
    document.body.style.animation = 'rainbow 2s infinite';
    setTimeout(() => {
        document.body.style.animation = '';
        alert('🎉 You found the secret! You are awesome! 🚀');
    }, 2000);
}

// Add rainbow animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy operations
const debouncedScroll = debounce(() => {
    // Heavy scroll operations here
}, 10);

window.addEventListener('scroll', debouncedScroll);

console.log('🎨 All animations loaded!');
console.log('💡 Try the Konami code: ↑↑↓↓←→←→BA');
console.log('📱 Shake your device for a surprise!');

