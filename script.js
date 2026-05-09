// Neural Network Canvas Effect
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const connectionDistance = 160;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 0.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    // Adjust density based on screen size
    const numParticles = Math.floor((width * height) / 18000);
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                
                const opacity = 1 - (distance / connectionDistance);
                ctx.strokeStyle = `rgba(112, 0, 255, ${opacity * 0.4})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);

// Initialize canvas
resize();
animate();

// Glitch Effect implementation for hover
const glitchText = document.querySelector('.glitch-text');
if (glitchText) {
    setInterval(() => {
        if (Math.random() > 0.96) {
            glitchText.style.textShadow = `
                ${Math.random() * 8 - 4}px ${Math.random() * 8 - 4}px 0px rgba(0, 240, 255, 0.8),
                ${Math.random() * -8 + 4}px ${Math.random() * -8 + 4}px 0px rgba(112, 0, 255, 0.8)
            `;
            setTimeout(() => {
                glitchText.style.textShadow = '0 0 15px rgba(0, 240, 255, 0.6)';
            }, 120);
        }
    }, 250);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
});

// Contact Form AJAX Submission
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        formStatus.style.display = 'none';
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        fetch("https://formsubmit.co/ajax/multiverso@outlook.com", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                formStatus.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.';
                formStatus.style.color = '#00f0ff';
                formStatus.style.display = 'block';
                contactForm.reset();
            } else {
                formStatus.textContent = 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.';
                formStatus.style.color = '#ff4081';
                formStatus.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            formStatus.textContent = 'Error de conexión. Inténtalo de nuevo más tarde.';
            formStatus.style.color = '#ff4081';
            formStatus.style.display = 'block';
        })
        .finally(() => {
            submitBtn.textContent = 'Enviar Mensaje';
            submitBtn.disabled = false;
        });
    });
}
