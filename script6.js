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

// Contact items animation
function initContactItemsAnimation() {
  const contactItems = document.querySelectorAll('.contact-item');
  
  contactItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'all 0.6s ease';
    
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }, index * 100);
  });
}

// Form validation and animation
function initFormFunctionality() {
  const form = document.querySelector('form');
  const inputs = document.querySelectorAll('.form-input');
  
  // Add focus effects
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      if (this.value === '') {
        this.parentElement.classList.remove('focused');
      }
    });
  });
  
  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simple validation
    let isValid = true;
    inputs.forEach(input => {
      if (input.value.trim() === '') {
        isValid = false;
        input.style.borderColor = 'var(--accent)';
      } else {
        input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      }
    });
    
    if (isValid) {
      const submitButton = form.querySelector('.submit-button');
      const originalText = submitButton.innerHTML;
      
      submitButton.innerHTML = '<i class="fas fa-check"></i> Сообщение отправлено';
      submitButton.style.background = 'var(--gradient-accent)';
      
      setTimeout(() => {
        submitButton.innerHTML = originalText;
        submitButton.style.background = '';
        form.reset();
      }, 3000);
    }
  });
}

// Map interaction
function initMapInteraction() {
  const mapContainer = document.querySelector('.map-container');
  
  mapContainer.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.02)';
    this.style.transition = 'transform 0.3s ease';
  });
  
  mapContainer.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
}

// Emergency contact animation
function initEmergencyContactAnimation() {
  const emergencyContact = document.querySelector('.emergency-contact');
  
  const pulseAnimation = () => {
    emergencyContact.style.boxShadow = '0 0 0 0 rgba(255, 107, 157, 0.7)';
    emergencyContact.offsetWidth; // Trigger reflow
    emergencyContact.style.boxShadow = '0 0 0 10px rgba(255, 107, 157, 0)';
    emergencyContact.style.transition = 'box-shadow 1.5s ease';
  };
  
  // Pulse every 3 seconds
  setInterval(pulseAnimation, 3000);
  pulseAnimation(); // Initial pulse
}

// Working hours animation
function initWorkingHoursAnimation() {
  const hourItems = document.querySelectorAll('.hour-item');
  
  hourItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
      item.style.transition = 'all 0.5s ease';
    }, 500 + (index * 100));
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  createParticles();
  initMobileMenu();
  initBackToTop();
  initContactItemsAnimation();
  initFormFunctionality();
  initMapInteraction();
  initEmergencyContactAnimation();
  initWorkingHoursAnimation();
  
  window.addEventListener('scroll', handleHeaderScroll);
  
  // Initial header state
  handleHeaderScroll();
});

// Add CSS for additional animations
const style = document.createElement('style');
style.textContent = `
  .form-group {
    position: relative;
  }
  
  .form-group.focused .form-label {
    color: var(--primary-light);
    transform: translateY(-5px);
  }
  
  .contact-item {
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  
  .map-container {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .emergency-contact {
    animation: emergencyPulse 3s infinite;
  }
  
  @keyframes emergencyPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 107, 157, 0.7);
    }
    70% {
      box-shadow: 0 0 0 15px rgba(255, 107, 157, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 107, 157, 0);
    }
  }
`;
document.head.appendChild(style);