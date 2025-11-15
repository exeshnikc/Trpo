/* Updated Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 40px 80px;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(0, 212, 170, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(0, 102, 255, 0.1) 0%, transparent 50%);
  z-index: -1;
}

.hero-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 80px;
  align-items: center;
  width: 100%;
}

.hero-text {
  z-index: 2;
}

.hero-title {
  font-size: 3.8rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 30px;
  background: linear-gradient(135deg, var(--white) 0%, var(--primary-light) 50%, var(--secondary-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: var(--gray-light);
  margin-bottom: 50px;
  font-weight: 400;
  line-height: 1.7;
  opacity: 0.9;
  max-width: 90%;
}

/* Updated Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 40px;
}

.stat-item {
  text-align: center;
  padding: 30px 20px;
  background: var(--gradient-glass);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius);
  backdrop-filter: blur(10px);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--gradient-primary);
  transition: var(--transition);
  z-index: -1;
  opacity: 0.1;
}

.stat-item:hover {
  transform: translateY(-10px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-lg);
}

.stat-item:hover::before {
  left: 0;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 1rem;
  color: var(--gray-light);
  font-weight: 500;
  opacity: 0.9;
}

/* Updated Hero Visual */
.hero-visual {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.main-photo {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
  transition: var(--transition);
  height: 400px;
}

.main-photo:hover {
  transform: perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1.02);
}

.main-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.main-photo:hover img {
  transform: scale(1.05);
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 25px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: var(--white);
}

.photo-text {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
  font-weight: 500;
}

.photo-text i {
  color: var(--secondary-light);
}

/* Feature Cards */
.feature-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.feature-card {
  background: var(--gradient-glass);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius);
  padding: 25px;
  backdrop-filter: blur(10px);
  transition: var(--transition);
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow);
}

.feature-icon {
  font-size: 2.5rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 15px;
  display: block;
}

.feature-text {
  color: var(--gray-light);
  font-size: 0.95rem;
  font-weight: 500;
}

/* CTA Button */
.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 15px;
  background: var(--gradient-primary);
  color: var(--white);
  padding: 18px 35px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: var(--transition);
  box-shadow: 0 15px 40px rgba(0, 102, 255, 0.3);
  margin-top: 20px;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--gradient-accent);
  transition: var(--transition);
  z-index: -1;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 50px rgba(0, 102, 255, 0.4);
}

.cta-button:hover::before {
  left: 0;
}

.cta-button i {
  transition: var(--transition);
}

.cta-button:hover i {
  transform: translateX(5px);
}

/* Responsive Design for Hero */
@media (max-width: 1200px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 60px;
    text-align: center;
  }
  
  .hero-subtitle {
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
  
  .main-photo {
    transform: none;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .stats-grid {
    max-width: 600px;
    margin: 40px auto 0;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 100px 25px 60px;
  }
  
  .hero-title {
    font-size: 2.8rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .stat-item {
    padding: 25px 20px;
  }
  
  .feature-cards {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .main-photo {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2.2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .stat-number {
    font-size: 2.5rem;
  }
  
  .cta-button {
    padding: 16px 30px;
    font-size: 1rem;
  }
}