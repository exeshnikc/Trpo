// script.js

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const burgerMenu = document.getElementById('burgerMenu');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('overlay');
  const backToTop = document.getElementById('backToTop');

  // Toggle mobile menu
  burgerMenu.addEventListener('click', function() {
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  // Close mobile menu when clicking overlay
  overlay.addEventListener('click', function() {
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });

  // Close mobile menu when clicking on a link
  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileNav.classList.remove('active');
      overlay.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });

  // Back to top button functionality
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Add loading animation to service cards
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('fade-in-up');
  });

  // Add hover effect to feature items
  const featureItems = document.querySelectorAll('.feature-item');
  featureItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Form handling for appointment buttons
  const appointmentButtons = document.querySelectorAll('a[href="#appointment"]');
  appointmentButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      // Here you would typically show a modal or redirect to appointment page
      console.log('Redirecting to appointment page...');
      // For demo purposes, we'll just scroll to services section
      document.querySelector('.services-section').scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Services buttons handling
  const serviceButtons = document.querySelectorAll('a[href="#services"]');
  serviceButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector('.services-section').scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Add intersection observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const elementsToAnimate = document.querySelectorAll('.service-card, .info-card, .stat-card, .feature-item');
  elementsToAnimate.forEach(el => {
    observer.observe(el);
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Close mobile menu on resize if window is larger than mobile breakpoint
      if (window.innerWidth > 768) {
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    }, 250);
  });

  // Add active state to navigation links based on scroll position
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav a, .mobile-nav a');

  function updateActiveNavLink() {
    let current = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);

  // Preload critical images
  function preloadImage(url) {
    const img = new Image();
    img.src = url;
  }

  // Preload hero image
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    preloadImage(heroImage.src);
  }
});

// Add CSS for animations programmatically
const style = document.createElement('style');
style.textContent = `
  .fade-in-up {
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 0.6s ease forwards;
  }
  
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-in {
    animation: slideInUp 0.6s ease forwards;
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .no-scroll {
    overflow: hidden;
  }
  
  .back-to-top {
    transition: all 0.3s ease;
  }
  
  .back-to-top.visible {
    opacity: 1;
    visibility: visible;
  }
  
  .service-card,
  .info-card,
  .stat-card,
  .feature-item {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .service-card:hover,
  .info-card:hover {
    transform: translateY(-5px);
  }
  
  .feature-item:hover {
    transform: translateY(-3px);
  }
`;
document.head.appendChild(style);