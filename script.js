/* ===================================================================
   SURAT DENTAL CLINIC — Interactive Logic & Animations
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------
  // 1. NAVBAR: Sticky scroll effect & mobile toggle
  // ---------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  // Scroll-based navbar styling
  const handleNavScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav when a link is clicked
  document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ---------------------------------------------------------------
  // 2. SMOOTH SCROLL for anchor links
  // ---------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const navHeight = navbar.offsetHeight;
        const ribbonHeight = document.getElementById('top-ribbon').offsetHeight;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---------------------------------------------------------------
  // 3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  // ---------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------------------------------------------------------------
  // 4. BEFORE/AFTER IMAGE COMPARISON SLIDER (Overlay approach)
  // ---------------------------------------------------------------
  const baSlider = document.getElementById('ba-slider');
  const baHandle = document.getElementById('ba-handle');
  const baLine = document.getElementById('ba-line');
  const baOverlay = document.getElementById('ba-overlay');
  const baBeforeImg = document.getElementById('ba-before-img');

  if (baSlider && baHandle && baLine && baOverlay && baBeforeImg) {
    let isDragging = false;

    // Size the before image to match the container width
    const sizeBeforeImage = () => {
      const containerWidth = baSlider.offsetWidth;
      baBeforeImg.style.width = containerWidth + 'px';
    };

    // Initial sizing + resize handler
    sizeBeforeImage();
    window.addEventListener('resize', sizeBeforeImage);

    // Also re-size after image loads
    baBeforeImg.addEventListener('load', sizeBeforeImage);

    const updateSlider = (clientX) => {
      const rect = baSlider.getBoundingClientRect();
      let x = clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const percent = (x / rect.width) * 100;

      // Update overlay width (clips the before image)
      baOverlay.style.width = `${percent}%`;
      // Move the slider line and handle
      baHandle.style.left = `${percent}%`;
      baLine.style.left = `${percent}%`;
    };

    // Mouse events
    baHandle.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
    });

    baSlider.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        updateSlider(e.clientX);
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events
    baHandle.addEventListener('touchstart', (e) => {
      isDragging = true;
      e.preventDefault();
    });

    baSlider.addEventListener('touchstart', (e) => {
      isDragging = true;
      updateSlider(e.touches[0].clientX);
    });

    document.addEventListener('touchmove', (e) => {
      if (isDragging) {
        updateSlider(e.touches[0].clientX);
      }
    }, { passive: true });

    document.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // ---------------------------------------------------------------
  // 4.5. TREATMENTS TAB SWITCHING INTERACTION
  // ---------------------------------------------------------------
  const tabBtns = document.querySelectorAll('.treatments-tab-btn');
  const tabPanels = document.querySelectorAll('.treatments-tab-panel');
  const indicator = document.querySelector('.tab-nav-indicator');

  const updateTabIndicator = (activeBtn) => {
    if (!indicator || window.innerWidth <= 768) return;
    const parentRect = activeBtn.parentElement.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    
    indicator.style.width = `${btnRect.width}px`;
    indicator.style.transform = `translateX(${btnRect.left - parentRect.left - 6}px)`;
  };

  const switchTab = (tabId) => {
    tabBtns.forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        updateTabIndicator(btn);
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    tabPanels.forEach(panel => {
      if (panel.id === `panel-${tabId}`) {
        panel.style.display = 'block';
        panel.classList.add('active');
      } else {
        panel.style.display = 'none';
        panel.classList.remove('active');
      }
    });
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  if (tabBtns.length > 0) {
    const activeBtn = document.querySelector('.treatments-tab-btn.active');
    if (activeBtn) {
      setTimeout(() => updateTabIndicator(activeBtn), 100);
    }

    window.addEventListener('resize', () => {
      const currentActive = document.querySelector('.treatments-tab-btn.active');
      if (currentActive) updateTabIndicator(currentActive);
    }, { passive: true });
  }

  // ---------------------------------------------------------------
  // 5. TESTIMONIAL CAROUSEL
  // ---------------------------------------------------------------
  const testimonialPages = document.querySelectorAll('.testimonial-page');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  let currentTestimonialPage = 0;
  let testimonialInterval;

  const showTestimonialPage = (pageIndex) => {
    testimonialPages.forEach(page => {
      page.style.display = 'none';
      page.classList.remove('active');
    });
    testimonialDots.forEach(dot => dot.classList.remove('active'));

    if (testimonialPages[pageIndex]) {
      testimonialPages[pageIndex].style.display = 'block';
      testimonialPages[pageIndex].classList.add('active');

      // Fade in animation
      testimonialPages[pageIndex].style.opacity = '0';
      testimonialPages[pageIndex].style.transform = 'translateY(10px)';
      testimonialPages[pageIndex].style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      requestAnimationFrame(() => {
        testimonialPages[pageIndex].style.opacity = '1';
        testimonialPages[pageIndex].style.transform = 'translateY(0)';
      });
    }
    if (testimonialDots[pageIndex]) {
      testimonialDots[pageIndex].classList.add('active');
    }
    currentTestimonialPage = pageIndex;
  };

  testimonialDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const page = parseInt(dot.dataset.page);
      showTestimonialPage(page);
      resetTestimonialAutoplay();
    });
  });

  const autoplayTestimonials = () => {
    testimonialInterval = setInterval(() => {
      const nextPage = (currentTestimonialPage + 1) % testimonialPages.length;
      showTestimonialPage(nextPage);
    }, 6000);
  };

  const resetTestimonialAutoplay = () => {
    clearInterval(testimonialInterval);
    autoplayTestimonials();
  };

  if (testimonialPages.length > 0) {
    autoplayTestimonials();
  }

  // ---------------------------------------------------------------
  // 6. APPOINTMENT FORM — Date Picker & Time Slots
  // ---------------------------------------------------------------
  const dateInput = document.getElementById('appointment-date');
  const timeSlots = document.querySelectorAll('.time-slot');
  let selectedTime = null;

  // Set minimum date to today
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;

    // Set default date to tomorrow (if tomorrow is Sunday, skip to Monday)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (tomorrow.getDay() === 0) {
      tomorrow.setDate(tomorrow.getDate() + 1);
    }
    const tmYYYY = tomorrow.getFullYear();
    const tmMM = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const tmDD = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.value = `${tmYYYY}-${tmMM}-${tmDD}`;

    // Sunday validation
    dateInput.addEventListener('change', () => {
      if (!dateInput.value) return;
      const selectedDate = new Date(dateInput.value);
      if (selectedDate.getDay() === 0) {
        alert("The clinic is closed on Sundays. Please select a Monday to Saturday date.");
        
        // Reset to next available weekday
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 1);
        if (defaultDate.getDay() === 0) {
          defaultDate.setDate(defaultDate.getDate() + 1);
        }
        const defYYYY = defaultDate.getFullYear();
        const defMM = String(defaultDate.getMonth() + 1).padStart(2, '0');
        const defDD = String(defaultDate.getDate()).padStart(2, '0');
        dateInput.value = `${defYYYY}-${defMM}-${defDD}`;
      }
    });
  }

  // Time slot selection
  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      selectedTime = slot.dataset.time;
    });
  });

  // ---------------------------------------------------------------
  // 7. FORM SUBMISSION with animated success state
  // ---------------------------------------------------------------
  const form = document.getElementById('appointment-form');
  const formInner = document.getElementById('booking-form-inner');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('btn-submit');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const name = document.getElementById('patient-name').value.trim();
      const phone = document.getElementById('patient-phone').value.trim();
      const concern = document.getElementById('treatment-concern').value;
      const date = document.getElementById('appointment-date').value;

      if (!name || !phone || !concern || !date) {
        // Shake the submit button for feedback
        submitBtn.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
          submitBtn.style.animation = '';
        }, 500);

        // Highlight empty fields
        const fields = [
          { el: document.getElementById('patient-name'), val: name },
          { el: document.getElementById('patient-phone'), val: phone },
          { el: document.getElementById('treatment-concern'), val: concern },
          { el: document.getElementById('appointment-date'), val: date }
        ];

        fields.forEach(field => {
          if (!field.val) {
            field.el.style.borderColor = 'var(--red)';
            field.el.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)';
            setTimeout(() => {
              field.el.style.borderColor = '';
              field.el.style.boxShadow = '';
            }, 2000);
          }
        });

        return;
      }

      // Check if phone number is at least 10 digits
      const cleanedPhone = phone.replace(/\D/g, '');
      if (cleanedPhone.length < 10) {
        alert("⚠️ Please enter a valid 10-digit phone number.");
        const phoneField = document.getElementById('patient-phone');
        phoneField.style.borderColor = 'var(--red)';
        phoneField.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)';
        phoneField.focus();
        setTimeout(() => {
          phoneField.style.borderColor = '';
          phoneField.style.boxShadow = '';
        }, 2000);
        return;
      }

      // Check if selected date is a Sunday (safety check)
      const selectedDate = new Date(date);
      if (selectedDate.getDay() === 0) {
        alert("The clinic is closed on Sundays. Please select a Monday to Saturday date.");
        return;
      }

      if (!selectedTime) {
        // Flash the time slots grid
        const grid = document.getElementById('time-slots-grid');
        grid.style.outline = '2px solid var(--red)';
        grid.style.outlineOffset = '4px';
        grid.style.borderRadius = '8px';
        setTimeout(() => {
          grid.style.outline = '';
          grid.style.outlineOffset = '';
        }, 2000);
        return;
      }

      // Disable button and show loading
      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ Processing...';

      // Simulate webhook call (1.5s delay)
      setTimeout(() => {
        // Log the form data
        const formData = {
          name,
          phone,
          concern,
          date,
          time: selectedTime,
          submitted_at: new Date().toISOString()
        };
        console.log('📋 Appointment Data (Ready for Webhook):', formData);

        // Animate form away, show success
        formInner.classList.add('hidden');

        setTimeout(() => {
          formInner.style.display = 'none';
          formSuccess.classList.add('visible');
        }, 400);
      }, 1500);
    });
  }

  // ---------------------------------------------------------------
  // 8. PARALLAX LIGHT EFFECT on hero section (subtle)
  // ---------------------------------------------------------------
  const hero = document.getElementById('hero');
  if (hero) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      hero.style.setProperty('--mouse-x', `${x}px`);
      hero.style.setProperty('--mouse-y', `${y}px`);
    }, { passive: true });
  }

  // ---------------------------------------------------------------
  // 9. ACTIVE NAV LINK on scroll
  // ---------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;
    const navHeight = navbar ? navbar.offsetHeight : 72;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      // Set the activation threshold slightly above the landing scroll position (-0px extra offset)
      const sectionTop = section.offsetTop - navHeight - 10;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinksAll.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // ---------------------------------------------------------------
  // 10. COUNTER ANIMATION for floating badges
  // ---------------------------------------------------------------
  const animateCounter = (element, target, suffix = '') => {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 16);
  };

  // Observe the hero badges for counter animation
  const badgeCounters = document.querySelectorAll('.hero-float-badge .float-badge-text strong');
  if (badgeCounters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent;
          
          if (text.includes('5000')) {
            animateCounter(el, 5000, '+');
          }
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    badgeCounters.forEach(counter => counterObserver.observe(counter));
  }
});

// ---------------------------------------------------------------
// CSS Keyframe injection for shake animation
// ---------------------------------------------------------------
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
    20%, 40%, 60%, 80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);
