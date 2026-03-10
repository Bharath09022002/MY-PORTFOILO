// ===== LENIS SMOOTH SCROLL =====
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// Integrate Lenis with GSAP ScrollTrigger
if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0, 0)
}

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
const navObserverOptions = {
    threshold: 0.3,
    rootMargin: "-20% 0px -40% 0px"
};

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, navObserverOptions);

sections.forEach(section => {
    navObserver.observe(section);
});

// ===== GSAP HERO ANIMATIONS =====
function initHeroAnimations() {
    // Split text into characters for the massive title
    const titleLines = document.querySelectorAll('.hero-title-massive span');
    
    if (typeof SplitType !== 'undefined' && titleLines.length) {
        titleLines.forEach(line => {
            new SplitType(line, { types: 'chars', tagName: 'span' });
        });
        
        gsap.from('.hero-title-massive .char', {
            y: 100,
            opacity: 0,
            rotationZ: 10,
            duration: 1.2,
            stagger: 0.05,
            ease: 'power4.out',
            delay: 1.5 // Wait for preloader
        });
    }

    gsap.from('.hero-greeting', {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 1.2
    });

    gsap.from('.hero-bottom-info', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 2.2
    });
}

// Call animations after preloader
window.addEventListener('load', () => {
    initHeroAnimations();
});

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

// ===== SMOOTH SCROLL (Updated for Lenis) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target, { offset: -80 });
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

// ===== SUPERIOR CUSTOM CURSOR =====
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
    const speed = 0.2;
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Add hover effect to interactive elements
const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-card');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
    });
});

// ===== INTERACTIVE NOISE/PARTICLE HERO CANVAS =====
const _canvas = document.getElementById('hero-canvas');
if(_canvas) {
    const _ctx = _canvas.getContext('2d');
    let width, height;
    let particles = [];

    function initCanvas() {
        width = _canvas.width = window.innerWidth;
        height = _canvas.height = window.innerHeight;
        particles = [];
        for(let i=0; i<100; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5
            });
        }
    }

    function animateCanvas() {
        _ctx.clearRect(0, 0, width, height);
        _ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        
        // Draw noise
        for(let i=0; i<particles.length; i++) {
            let p = particles[i];
            
            // Mouse repulse
            let dx = mouseX - p.x;
            let dy = mouseY - p.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < 150) {
                p.x -= dx * 0.02;
                p.y -= dy * 0.02;
            }

            p.x += p.speedX;
            p.y += p.speedY;

            if(p.x < 0) p.x = width;
            if(p.x > width) p.x = 0;
            if(p.y < 0) p.y = height;
            if(p.y > height) p.y = 0;

            _ctx.globalAlpha = p.opacity;
            _ctx.beginPath();
            _ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            _ctx.fill();
        }
        
        requestAnimationFrame(animateCanvas);
    }

    initCanvas();
    animateCanvas();
    window.addEventListener('resize', initCanvas);
}

console.log('Portfolio loaded successfully! 🚀');

// ===== PROJECTS HORIZONTAL SCROLL =====
function initHorizontalScroll() {
    const track = document.getElementById('projects-track');
    const container = document.querySelector('.projects-horizontal-section');
    
    if (track && container && typeof ScrollTrigger !== 'undefined') {
        const getScrollAmount = () => {
            let trackWidth = track.scrollWidth;
            return -(trackWidth - window.innerWidth);
        };

        const tween = gsap.to(track, {
            x: getScrollAmount,
            ease: "none"
        });

        ScrollTrigger.create({
            trigger: container,
            start: "top top",
            end: () => `+=${getScrollAmount() * -1}`,
            pin: true,
            animation: tween,
            scrub: 1,
            invalidateOnRefresh: true
        });
    }
}

// ===== THEME COLOR CUSTOMIZER =====
const colorPicker = document.getElementById('accentColorPicker');
if (colorPicker) {
    // Load saved color
    const savedColor = localStorage.getItem('themeColor');
    if (savedColor) {
        document.documentElement.style.setProperty('--primary', savedColor);
        document.documentElement.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${savedColor} 0%, #3b82f6 100%)`);
        colorPicker.value = savedColor;
    }

    colorPicker.addEventListener('input', (e) => {
        const newColor = e.target.value;
        document.documentElement.style.setProperty('--primary', newColor);
        document.documentElement.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${newColor} 0%, #3b82f6 100%)`);
        localStorage.setItem('themeColor', newColor);
    });
}

// Initialize scripts
window.addEventListener('load', () => {
    initHeroAnimations();
    initHorizontalScroll();
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

