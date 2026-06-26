gsap.registerPlugin(ScrollTrigger);

/* --- Navbar Scroll Effect --- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* --- Canvas Animation Configuration --- */
const config = {
  frameCount: 173,
  framePath: (index) => `./frames/ezgif-1396dc2b0598705c-jpg/ezgif-frame-${String(index).padStart(3, '0')}.jpg`,
  scrollLength: "450vh", // Scrub duration
  scrubSpeed: 0.8
};

const canvas = document.getElementById("animation-canvas");
const ctx = canvas.getContext("2d");
const heroWrapper = document.querySelector(".hero-wrapper");

// UI Elements
const loaderOverlay = document.getElementById("loader-overlay");
const progressBar = document.getElementById("progress-bar");
const pctText = document.getElementById("pct-text");

// Dynamic height assignment for the scroll container
heroWrapper.style.height = config.scrollLength;

const frames = [];
let currentFrame = 0;
let imagesLoaded = 0;

/* --- Canvas Draw & Scale Logic --- */
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentNode.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  ctx.scale(dpr, dpr);
  drawFrame(currentFrame);
}

function drawFrame(index) {
  const img = frames[index];
  if (!img || !img.complete || !img.naturalWidth) return;

  const cw = parseFloat(canvas.style.width) || window.innerWidth;
  const ch = parseFloat(canvas.style.height) || window.innerHeight;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  const imgRatio = iw / ih;
  const canvasRatio = cw / ch;

  let dw, dh, dx, dy;

  if (canvasRatio > imgRatio) {
    dw = cw;
    dh = cw / imgRatio;
    dx = 0;
    dy = (ch - dh) / 2;
  } else {
    dw = ch * imgRatio;
    dh = ch;
    dx = (cw - dw) / 2;
    dy = 0;
  }

  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, dx, dy, dw, dh);
}

/* --- Preloader Logic --- */
function preloadImages() {
  for (let i = 1; i <= config.frameCount; i++) {
    const img = new Image();
    img.src = config.framePath(i);
    
    img.onload = () => handleLoadProgress();
    img.onerror = () => handleLoadProgress(); // skip broken frames silently
    
    frames.push(img);
  }
}

function handleLoadProgress() {
  imagesLoaded++;
  const percentage = Math.round((imagesLoaded / config.frameCount) * 100);
  
  progressBar.style.width = `${percentage}%`;
  pctText.textContent = percentage;

  if (imagesLoaded === config.frameCount) {
    initScrollAnimations();
  }
}

/* --- Lenis Smooth Scroll Setup --- */
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
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

/* --- ScrollTrigger Initialization --- */
function initScrollAnimations() {
  // Fade out preloader
  gsap.to(loaderOverlay, {
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    onComplete: () => loaderOverlay.classList.add("loaded")
  });

  // Initial Canvas Setup with Resize Debouncing
  resizeCanvas();
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 150);
  });

  // GSAP MatchMedia for Responsive Triggers
  let mm = gsap.matchMedia();

  // Responsive Reveal Animations
  mm.add({
    isDesktop: "(min-width: 769px)",
    isMobile: "(max-width: 768px)"
  }, (context) => {
    let { isDesktop, isMobile } = context.conditions;

    if (isDesktop) {
      // Desktop Hero Canvas Animation
      const airRender = { frame: 0 };
      
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-wrapper",
          start: "top top",
          end: "bottom bottom",
          scrub: config.scrubSpeed,
          pin: ".canvas-pin-container",
        }
      });

      heroTl.to(".hero-text-container", {
        opacity: 0,
        duration: 0.15,
        ease: "power1.out"
      });

      heroTl.to(airRender, {
        frame: config.frameCount - 1,
        ease: "none",
        duration: 0.85,
        onUpdate: () => {
          const frameIndex = Math.round(airRender.frame);
          if (currentFrame !== frameIndex) {
            currentFrame = frameIndex;
            drawFrame(currentFrame);
          }
        }
      });

      heroTl.to(".hero-finale-tagline", {
        opacity: 1,
        transform: "translate(-50%, -50%)",
        duration: 0.15,
        ease: "power1.out"
      }, "-=0.15");

      heroTl.to(".explore-scroll-btn", {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.15,
        ease: "power1.out"
      }, "<");
    }

    if (isMobile) {
      // Mobile Hero Animation
      gsap.from(".hero-text-container", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".hero-wrapper",
          start: "top 80%",
        }
      });
      // Removed normalizeScroll to allow native pull-to-refresh
    }
    
    // On mobile, trigger later (top 90%) to ensure it's fully on screen before animating
    const triggerStart = isMobile ? "top 90%" : "top 80%";
    const staggerAmount = isMobile ? 0.1 : 0.2;

    gsap.from(".amenity-card", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: staggerAmount,
      scrollTrigger: {
        trigger: "#amenities",
        start: triggerStart,
      }
    });

    gsap.from(".plan-card", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: staggerAmount,
      scrollTrigger: {
        trigger: "#plans",
        start: triggerStart,
      }
    });

    gsap.from(".insta-item", {
      scale: 0.9,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      scrollTrigger: {
        trigger: "#community",
        start: triggerStart,
      }
    });
    
    return () => {}; // Cleanup function
  });
}

// Start Everything
window.addEventListener("DOMContentLoaded", preloadImages);

/* --- WhatsApp Popup Logic --- */
const waPopup = document.getElementById('wa-popup');
const waCloseBtn = document.getElementById('wa-close-btn');

// Show popup after 5 seconds if not closed in this session
setTimeout(() => {
  if (waPopup && !sessionStorage.getItem('waPopupClosed')) {
    waPopup.classList.add('show');
  }
}, 5000);

// Close popup on button click
if (waCloseBtn) {
  waCloseBtn.addEventListener('click', () => {
    waPopup.classList.remove('show');
    sessionStorage.setItem('waPopupClosed', 'true');
  });
}

/* --- Mobile Menu & Accordion Logic --- */
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');
const branchesItem = document.getElementById('branches-item');
const megaMenu = document.getElementById('mega-menu');

if (mobileMenuBtn && navMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('mobile-active');
  });
}

if (branchesItem && megaMenu) {
  branchesItem.addEventListener('click', (e) => {
    if (window.innerWidth <= 992) {
      // Allow clicking children links in the mega menu
      if (e.target.closest('.mega-menu-links')) return;
      
      e.preventDefault();
      megaMenu.classList.toggle('accordion-open');
    }
  });
}

/* --- Inquiry Modal Logic --- */
const triggerModalBtns = document.querySelectorAll('.trigger-modal');
const inquiryModal = document.getElementById('inquiry-modal');
const inquiryCloseBtn = document.getElementById('inquiry-close-btn');

// Open modal
triggerModalBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    inquiryModal.classList.add('active');
  });
});

// Close modal on 'X' click
if (inquiryCloseBtn) {
  inquiryCloseBtn.addEventListener('click', () => {
    inquiryModal.classList.remove('active');
  });
}

// Close modal on outside backdrop click
if (inquiryModal) {
  inquiryModal.addEventListener('click', (e) => {
    if (e.target === inquiryModal) {
      inquiryModal.classList.remove('active');
    }
  });
}

/* --- Subtle Cursor Glow Logic --- */
document.addEventListener('mousemove', (e) => {
  document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
  document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
});

/* --- Scroll Reveal Intersection Observer --- */
const revealObserverOptions = {
  root: null,
  rootMargin: '0px 0px -50px 0px',
  threshold: 0.15
};

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // Unobserve to ensure animation only happens once
      observer.unobserve(entry.target);
    }
  });
}, revealObserverOptions);

// Select all sections with the reveal-section class and observe them
document.querySelectorAll('.reveal-section').forEach(section => {
  revealObserver.observe(section);
});

/* --- Community Lightbox Modal --- */
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('media-lightbox');
  const lightboxContent = document.getElementById('media-lightbox-content');
  const lightboxClose = document.getElementById('media-lightbox-close');
  const lightboxPrev = document.getElementById('media-lightbox-prev');
  const lightboxNext = document.getElementById('media-lightbox-next');

  if (lightbox && lightboxContent && lightboxClose) {
    const mediaCards = Array.from(document.querySelectorAll('.community-card, .trigger-lightbox'));
    let currentIndex = 0;
    
    const loadMedia = (index) => {
      if (index < 0 || index >= mediaCards.length) return;
      currentIndex = index;
      
      const card = mediaCards[index];
      const type = card.getAttribute('data-media-type');
      const src = card.getAttribute('data-media-src');
      
      if (type === 'video') {
        lightboxContent.innerHTML = `<video src="${src}" autoplay controls controlsList="nofullscreen" playsinline></video>`;
        const videoElement = lightboxContent.querySelector('video');
        videoElement.addEventListener('ended', () => {
          // Auto-swipe to the next media item seamlessly
          const nextIndex = (currentIndex + 1) % mediaCards.length;
          loadMedia(nextIndex);
        });
      } else if (type === 'image') {
        lightboxContent.innerHTML = `<img src="${src}" />`;
      }
    };

    mediaCards.forEach((card, index) => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        loadMedia(index);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightboxContent.innerHTML = '';
      document.body.style.overflow = 'auto';
    };

    lightboxClose.addEventListener('click', closeLightbox);

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        const prevIndex = (currentIndex - 1 + mediaCards.length) % mediaCards.length;
        loadMedia(prevIndex);
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        const nextIndex = (currentIndex + 1) % mediaCards.length;
        loadMedia(nextIndex);
      });
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  /* --- Gallery View All Logic --- */
  const viewAllBtn = document.getElementById('view-all-gallery-btn');
  const galleryModal = document.getElementById('gallery-modal');
  const closeGalleryBtn = document.getElementById('close-gallery-btn');

  if (viewAllBtn && galleryModal) {
    viewAllBtn.addEventListener('click', () => {
      galleryModal.showModal();
    });
  }
  if (closeGalleryBtn && galleryModal) {
    closeGalleryBtn.addEventListener('click', () => {
      galleryModal.close();
    });
  }
  if (galleryModal) {
    galleryModal.addEventListener('click', (e) => {
      if (e.target === galleryModal) galleryModal.close();
    });
  }
});
