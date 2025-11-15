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

// Service cards hover effects
function initServiceCardsEffects() {
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-15px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
}

// Benefit items animation
function initBenefitsAnimation() {
  const benefitItems = document.querySelectorAll('.benefit-item');
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  benefitItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'all 0.6s ease';
    observer.observe(item);
  });
}

// Price tags animation
function initPriceTagsAnimation() {
  const priceTags = document.querySelectorAll('.price-tag');
  
  priceTags.forEach((tag, index) => {
    tag.style.animationDelay = `${index * 0.1}s`;
  });
}

// Payment methods hover effects
function initPaymentMethodsEffects() {
  const paymentMethods = document.querySelectorAll('.payment-method');
  
  paymentMethods.forEach(method => {
    method.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px)';
    });
    
    method.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  createParticles();
  initMobileMenu();
  initBackToTop();
  initServiceCardsEffects();
  initBenefitsAnimation();
  initPriceTagsAnimation();
  initPaymentMethodsEffects();
  
  window.addEventListener('scroll', handleHeaderScroll);
  
  // Initial header state
  handleHeaderScroll();
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  .service-card {
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  
  .price-tag {
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 10px 30px rgba(0, 102, 255, 0.3);
    }
    50% {
      box-shadow: 0 10px 40px rgba(0, 102, 255, 0.5);
    }
    100% {
      box-shadow: 0 10px 30px rgba(0, 102, 255, 0.3);
    }
  }
  
  .benefit-item {
    transition: all 0.6s ease;
  }
`;
document.head.appendChild(style);