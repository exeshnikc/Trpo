// Particles Background
function createParticles() {
  const container = document.getElementById('particles-container');
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size between 4px and 12px
    const size = Math.random() * 8 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // Random animation delay and duration
    const delay = Math.random() * 20;
    const duration = 15 + Math.random() * 15;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    
    container.appendChild(particle);
  }
}

// Header scroll effect
function handleHeaderScroll() {
  const header = document.querySelector('.header');
  const scrollY = window.scrollY;
  
  if (scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

// Mobile menu functionality
function initMobileMenu() {
  const burgerMenu = document.getElementById('burgerMenu');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('overlay');
  
  function toggleMenu() {
    burgerMenu.classList.toggle('active');
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = burgerMenu.classList.contains('active') ? 'hidden' : '';
  }
  
  burgerMenu.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);
  
  // Close menu when clicking on links
  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      burgerMenu.classList.remove('active');
      mobileNav.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// Back to top button
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  
  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  window.addEventListener('scroll', toggleBackToTop);
}

// Card hover effects
function initCardEffects() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-15px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
}

// Counter animation for stats
function initCounterAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumber = entry.target;
        const targetValue = parseInt(statNumber.textContent.replace('+', '').replace(',', ''));
        animateCounter(statNumber, targetValue);
        observer.unobserve(statNumber);
      }
    });
  }, observerOptions);
  
  statNumbers.forEach(statNumber => {
    observer.observe(statNumber);
  });
}

function animateCounter(element, target) {
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      clearInterval(timer);
      current = target;
    }
    element.textContent = Math.floor(current).toLocaleString() + (element.textContent.includes('+') ? '+' : '');
  }, 16);
}

// Service tags animation
function initServiceTagsAnimation() {
  const serviceTags = document.querySelectorAll('.service-tag');
  
  serviceTags.forEach((tag, index) => {
    tag.style.animationDelay = `${index * 0.1}s`;
    tag.classList.add('animate-in');
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  createParticles();
  initMobileMenu();
  initBackToTop();
  initCardEffects();
  initCounterAnimation();
  initServiceTagsAnimation();
  
  window.addEventListener('scroll', handleHeaderScroll);
  
  // Initial header state
  handleHeaderScroll();
});

// Add CSS for service tags animation
const style = document.createElement('style');
style.textContent = `
  .service-tag {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
  }
  
  .service-tag.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);