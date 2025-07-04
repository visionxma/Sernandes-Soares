/**
 * Modern Honda Consortium Website
 * Advanced JavaScript with ES6+ features, animations, and form validation
 * Author: Sernandes Soares Consultant
 * Version: 2.0
 */

class ConsortiumWebsite {
  constructor() {
    this.init();
    this.setupEventListeners();
    this.setupAnimations();
    this.setupFormValidation();
  }

  /**
   * Initialize the website
   */
  init() {
    // Hide loading screen after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
          loadingScreen.classList.add('hidden');
          setTimeout(() => {
            loadingScreen.style.display = 'none';
          }, 300);
        }
      }, 1000);
    });

    // Initialize navbar scroll effect
    this.initNavbarScroll();
    
    // Initialize back to top button
    this.initBackToTop();
    
    // Initialize mobile menu
    this.initMobileMenu();
    
    // Initialize intersection observer for animations
    this.initIntersectionObserver();
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Smooth scroll to simulation form
    const btnSimulacao = document.getElementById('btn-simulacao');
    if (btnSimulacao) {
      btnSimulacao.addEventListener('click', (e) => {
        this.addRippleEffect(e);
        this.scrollToElement('#simulacao');
      });
    }

    // Navigation links smooth scroll
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          this.scrollToElement(href);
          this.closeMobileMenu();
        }
      });
    });

    // Add ripple effect to all buttons
    document.querySelectorAll('.btn-primary').forEach(button => {
      button.addEventListener('click', this.addRippleEffect);
    });
  }

  /**
   * Initialize navbar scroll effects
   */
  initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScrollY = currentScrollY;
    });
  }

  /**
   * Initialize back to top button
   */
  initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add('show');
        } else {
          backToTopBtn.classList.remove('show');
        }
      });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  /**
   * Initialize mobile menu
   */
  initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
    }
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  }

  /**
   * Initialize intersection observer for scroll animations
   */
  initIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('animate');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with fade-in-up class
    document.querySelectorAll('.fade-in-up').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * Setup scroll animations
   */
  setupAnimations() {
    // Add stagger delay to animated elements
    document.querySelectorAll('.fade-in-up').forEach((el, index) => {
      if (!el.dataset.delay) {
        el.dataset.delay = index * 100;
      }
    });
  }

  /**
   * Smooth scroll to element
   * @param {string} selector - CSS selector of target element
   */
  scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      const navbarHeight = document.getElementById('navbar').offsetHeight;
      const elementPosition = element.offsetTop - navbarHeight - 20;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Add ripple effect to button clicks
   * @param {Event} e - Click event
   */
  addRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('btn-ripple');

    // Remove existing ripples
    const existingRipple = button.querySelector('.btn-ripple');
    if (existingRipple) {
      existingRipple.remove();
    }

    button.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /**
   * Setup advanced form validation
   */
  setupFormValidation() {
    const form = document.getElementById('form-simulacao');
    if (!form) return;

    const validator = new FormValidator(form);
    validator.init();
  }
}

/**
 * Advanced Form Validator Class
 */
class FormValidator {
  constructor(form) {
    this.form = form;
    this.fields = {};
    this.isSubmitting = false;
    this.csrfToken = this.generateCSRFToken();
    
    // Validation rules
    this.rules = {
      nome: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
        message: 'Nome deve conter apenas letras e ter pelo menos 2 caracteres'
      },
      whatsapp: {
        required: true,
        pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
        message: 'WhatsApp deve estar no formato (99) 99999-9999'
      },
      email: {
        required: false,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'E-mail deve ter um formato válido'
      },
      tipo: {
        required: true,
        message: 'Selecione o tipo de consórcio'
      },
      valor: {
        required: false,
        pattern: /^\d{1,3}(\.\d{3})*$/,
        message: 'Valor deve estar no formato 25.000'
      }
    };
  }

  /**
   * Initialize form validation
   */
  init() {
    this.setupFields();
    this.setupEventListeners();
    this.setupCSRFProtection();
  }

  /**
   * Setup form fields
   */
  setupFields() {
    Object.keys(this.rules).forEach(fieldName => {
      const field = this.form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        this.fields[fieldName] = {
          element: field,
          errorElement: document.getElementById(`${fieldName}-error`),
          isValid: false
        };
      }
    });
  }

  /**
   * Setup event listeners for form validation
   */
  setupEventListeners() {
    // Real-time validation on input
    Object.keys(this.fields).forEach(fieldName => {
      const field = this.fields[fieldName].element;
      
      // Input event for real-time validation
      field.addEventListener('input', () => {
        this.validateField(fieldName);
      });

      // Blur event for final validation
      field.addEventListener('blur', () => {
        this.validateField(fieldName);
      });

      // Special formatting for phone number
      if (fieldName === 'whatsapp') {
        field.addEventListener('input', this.formatPhoneNumber.bind(this));
      }

      // Special formatting for currency
      if (fieldName === 'valor') {
        field.addEventListener('input', this.formatCurrency.bind(this));
      }
    });

    // Form submission
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  /**
   * Setup CSRF protection
   */
  setupCSRFProtection() {
    const csrfInput = this.form.querySelector('input[name="csrf_token"]');
    if (csrfInput) {
      csrfInput.value = this.csrfToken;
    }
  }

  /**
   * Generate CSRF token (simplified for demo)
   */
  generateCSRFToken() {
    return 'csrf_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  /**
   * Validate individual field
   * @param {string} fieldName - Name of the field to validate
   */
  validateField(fieldName) {
    const field = this.fields[fieldName];
    const rule = this.rules[fieldName];
    const value = field.element.value.trim();

    let isValid = true;
    let errorMessage = '';

    // Required validation
    if (rule.required && !value) {
      isValid = false;
      errorMessage = `${this.getFieldLabel(fieldName)} é obrigatório`;
    }
    // Pattern validation
    else if (value && rule.pattern && !rule.pattern.test(value)) {
      isValid = false;
      errorMessage = rule.message;
    }
    // Min length validation
    else if (value && rule.minLength && value.length < rule.minLength) {
      isValid = false;
      errorMessage = rule.message;
    }

    // Update field state
    field.isValid = isValid;
    this.updateFieldUI(fieldName, isValid, errorMessage);

    return isValid;
  }

  /**
   * Update field UI based on validation state
   * @param {string} fieldName - Name of the field
   * @param {boolean} isValid - Validation state
   * @param {string} errorMessage - Error message to display
   */
  updateFieldUI(fieldName, isValid, errorMessage) {
    const field = this.fields[fieldName];
    
    // Update field classes
    field.element.classList.remove('error', 'valid');
    field.element.classList.add(isValid ? 'valid' : 'error');

    // Update error message
    if (field.errorElement) {
      field.errorElement.textContent = errorMessage;
      field.errorElement.classList.toggle('show', !isValid && errorMessage);
    }
  }

  /**
   * Get field label for error messages
   * @param {string} fieldName - Name of the field
   */
  getFieldLabel(fieldName) {
    const labels = {
      nome: 'Nome',
      whatsapp: 'WhatsApp',
      email: 'E-mail',
      tipo: 'Tipo de consórcio',
      valor: 'Valor'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Format phone number input
   * @param {Event} e - Input event
   */
  formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 11) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 6) {
      value = value.replace(/(\d{2})(\d{4})/, '($1) $2');
    } else if (value.length >= 2) {
      value = value.replace(/(\d{2})/, '($1) ');
    }
    
    e.target.value = value;
  }

  /**
   * Format currency input
   * @param {Event} e - Input event
   */
  formatCurrency(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value) {
      value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }
    
    e.target.value = value;
  }

  /**
   * Validate entire form
   */
  validateForm() {
    let isFormValid = true;

    Object.keys(this.fields).forEach(fieldName => {
      const isFieldValid = this.validateField(fieldName);
      if (!isFieldValid) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  /**
   * Handle form submission
   * @param {Event} e - Submit event
   */
  async handleSubmit(e) {
    e.preventDefault();

    if (this.isSubmitting) return;

    // Validate form
    if (!this.validateForm()) {
      this.showFormMessage('error', 'Por favor, corrija os erros no formulário.');
      return;
    }

    this.isSubmitting = true;
    this.setSubmitButtonLoading(true);

    try {
      // Simulate API call
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      
      // Add additional security and tracking data
      data.timestamp = new Date().toISOString();
      data.userAgent = navigator.userAgent;
      data.referrer = document.referrer;

      // Simulate network delay
      await this.simulateAPICall(data);

      // Success
      this.showFormMessage('success');
      this.form.reset();
      this.resetFieldStates();

      // Track conversion (in real app, use analytics)
      this.trackConversion(data);

    } catch (error) {
      console.error('Form submission error:', error);
      this.showFormMessage('error', 'Erro ao enviar simulação. Tente novamente.');
    } finally {
      this.isSubmitting = false;
      this.setSubmitButtonLoading(false);
    }
  }

  /**
   * Simulate API call for demo purposes
   * @param {Object} data - Form data
   */
  async simulateAPICall(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 95% success rate
        if (Math.random() > 0.05) {
          console.log('Form submitted successfully:', data);
          resolve(data);
        } else {
          reject(new Error('Simulated server error'));
        }
      }, 2000);
    });
  }

  /**
   * Set submit button loading state
   * @param {boolean} isLoading - Loading state
   */
  setSubmitButtonLoading(isLoading) {
    const submitBtn = this.form.querySelector('.btn-submit');
    if (submitBtn) {
      submitBtn.classList.toggle('loading', isLoading);
      submitBtn.disabled = isLoading;
    }
  }

  /**
   * Show form success/error message
   * @param {string} type - Message type ('success' or 'error')
   * @param {string} customMessage - Custom message (optional)
   */
  showFormMessage(type, customMessage = null) {
    // Hide all messages first
    document.querySelectorAll('.form-message').forEach(msg => {
      msg.classList.remove('show');
    });

    const messageElement = document.getElementById(`form-${type}`);
    if (messageElement) {
      if (customMessage && type === 'error') {
        const messageText = messageElement.querySelector('p');
        if (messageText) {
          messageText.textContent = customMessage;
        }
      }
      
      setTimeout(() => {
        messageElement.classList.add('show');
      }, 100);

      // Auto-hide after 5 seconds
      setTimeout(() => {
        messageElement.classList.remove('show');
      }, 5000);
    }
  }

  /**
   * Reset all field states
   */
  resetFieldStates() {
    Object.keys(this.fields).forEach(fieldName => {
      const field = this.fields[fieldName];
      field.element.classList.remove('error', 'valid');
      field.isValid = false;
      
      if (field.errorElement) {
        field.errorElement.classList.remove('show');
        field.errorElement.textContent = '';
      }
    });
  }

  /**
   * Track conversion for analytics
   * @param {Object} data - Form data
   */
  trackConversion(data) {
    // In a real application, you would send this to your analytics service
    console.log('Conversion tracked:', {
      event: 'form_submission',
      form_type: 'consortium_simulation',
      consortium_type: data.tipo,
      timestamp: data.timestamp
    });

    // Example: Google Analytics 4 event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'generate_lead', {
        currency: 'BRL',
        value: data.valor ? parseFloat(data.valor.replace(/\./g, '')) : 0,
        lead_type: data.tipo
      });
    }
  }
}

/**
 * Utility functions
 */
const Utils = {
  /**
   * Debounce function to limit function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function to limit function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   */
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Check if element is in viewport
   * @param {Element} element - Element to check
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
};

/**
 * Error handling and logging
 */
window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno,
    error: e.error
  });
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason);
});

/**
 * Initialize the website when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    new ConsortiumWebsite();
    console.log('Honda Consortium Website initialized successfully');
  } catch (error) {
    console.error('Failed to initialize website:', error);
  }
});

/**
 * Performance monitoring
 */
window.addEventListener('load', () => {
  // Log performance metrics
  if ('performance' in window) {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Page Load Performance:', {
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
      totalTime: perfData.loadEventEnd - perfData.fetchStart
    });
  }
});