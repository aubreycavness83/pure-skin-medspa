// NAVBAR
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navOverlay = document.getElementById("navOverlay");
const navLinks = document.querySelectorAll(".nav-link");

// Scroll effect - add solid background
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Hamburger toggle
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
  navOverlay.classList.toggle("active");
  document.body.style.overflow = navMenu.classList.contains("active")
    ? "hidden"
    : "";
});

// Close menu on overlay click
navOverlay.addEventListener("click", () => {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
  navOverlay.classList.remove("active");
  document.body.style.overflow = "";
});

// Close menu on link click
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    navOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });
});

// HERO SECTION
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");
const dotsContainer = document.getElementById("dotsContainer");

let currentIndex = 0;
const slideIntervalTime = 5000;
let autoplay;

// Create dots
if (dotsContainer) {
  slides.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      showSlide(index);
      resetTimer();
    });

    dotsContainer.appendChild(dot);
  });
}

function showSlide(index) {
  currentIndex = (index + slides.length) % slides.length;

  // Remove active class from all slides and dots
  slides.forEach((slide) => slide.classList.remove("active"));
  document
    .querySelectorAll(".dot")
    .forEach((dot) => dot.classList.remove("active"));

  // Add active class to current slide and dot
  slides[currentIndex].classList.add("active");
  const dots = document.querySelectorAll(".dot");
  if (dots[currentIndex]) {
    dots[currentIndex].classList.add("active");
  }
}

function nextSlide() {
  showSlide(currentIndex + 1);
}

function prevSlide() {
  showSlide(currentIndex - 1);
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetTimer();
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetTimer();
  });
}

function startTimer() {
  autoplay = setInterval(nextSlide, slideIntervalTime);
}

function resetTimer() {
  clearInterval(autoplay);
  startTimer();
}

startTimer();

// STATS SECTION
const initCounters = () => {
  const stats = document.querySelectorAll(".stat-number");

  const observerOptions = {
    threshold: 0.7, // Starts when 70% of the section is visible
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const targetElement = entry.target;
        const targetNumber = parseInt(
          targetElement.getAttribute("data-target"),
        );
        const duration = 2000; // Animation lasts 2 seconds
        let startTime = null;

        const step = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);

          // Update the text with the current progress
          targetElement.innerText = Math.floor(progress * targetNumber);

          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            // Ensure it ends on the exact target + a plus sign
            targetElement.innerText = targetNumber + "+";
          }
        };

        window.requestAnimationFrame(step);
        observer.unobserve(targetElement); // Only animate once
      }
    });
  }, observerOptions);

  stats.forEach((stat) => counterObserver.observe(stat));
};

// Run the function
initCounters();

// WELCOME SECTION
const observerOptions = {
  threshold: 0.4,
};

const welcomeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

const animatedElements = document.querySelectorAll(
  ".welcome-text-wrap, .welcome-image-wrap",
);
animatedElements.forEach((el) => welcomeObserver.observe(el));

// SERVICES SECTION
const servicesObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        servicesObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 },
);

document.querySelectorAll(".service-card").forEach((card) => {
  servicesObserver.observe(card);
});

// EXPANDING CARDS SECTION
const isMobileOrTablet = () => window.innerWidth <= 992;

document.querySelectorAll(".expand-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    // Don't collapse if clicking a link
    if (e.target.closest(".expand-card-link")) return;

    // On desktop, only toggle when clicking the icon
    if (!isMobileOrTablet() && !e.target.closest(".expand-icon")) return;

    const isExpanded = card.classList.contains("expanded");

    // Close all other cards
    document.querySelectorAll(".expand-card.expanded").forEach((openCard) => {
      openCard.classList.remove("expanded");
    });

    // Toggle clicked card
    if (!isExpanded) {
      card.classList.add("expanded");
    }
  });
});

// REVIEWS SLIDER
const reviewsTrack = document.getElementById("reviewsTrack");
const reviewPrev = document.getElementById("reviewPrev");
const reviewNext = document.getElementById("reviewNext");
const reviewDotsContainer = document.getElementById("reviewDots");
const reviewCards = document.querySelectorAll(".review-card");

let reviewIndex = 0;
let reviewsPerView = 3;
let reviewAutoplay;

function getReviewsPerView() {
  if (window.innerWidth <= 992) return 1;
  return 3;
}

function getTotalReviewPages() {
  return Math.ceil(reviewCards.length / reviewsPerView);
}

function buildReviewDots() {
  if (!reviewDotsContainer) return;
  reviewDotsContainer.innerHTML = "";
  const totalPages = getTotalReviewPages();
  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement("button");
    dot.classList.add("review-dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      reviewIndex = i;
      updateReviewSlider();
      resetReviewAutoplay();
    });
    reviewDotsContainer.appendChild(dot);
  }
}

function updateReviewSlider() {
  const sliderWidth = reviewsTrack.parentElement.offsetWidth;
  const gap = 32;
  const offset = reviewIndex * (sliderWidth + gap);
  reviewsTrack.style.transform = `translateX(-${offset}px)`;

  // Update dots
  document.querySelectorAll(".review-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === reviewIndex);
  });
}

function nextReview() {
  const totalPages = getTotalReviewPages();
  reviewIndex = (reviewIndex + 1) % totalPages;
  updateReviewSlider();
}

function prevReview() {
  const totalPages = getTotalReviewPages();
  reviewIndex = (reviewIndex - 1 + totalPages) % totalPages;
  updateReviewSlider();
}

if (reviewNext) {
  reviewNext.addEventListener("click", () => {
    nextReview();
    resetReviewAutoplay();
  });
}

// FAQ ACCORDION
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    faqItems.forEach((other) => {
      other.classList.remove("active");
      other
        .querySelector(".faq-question")
        .setAttribute("aria-expanded", "false");
    });

    if (!isActive) {
      item.classList.add("active");
      question.setAttribute("aria-expanded", "true");
    } else {
      question.setAttribute("aria-expanded", "false");
    }
  });
});

// BOOKING MODAL
const modalOverlay = document.getElementById("bookingModal");
const openModalBtn = document.getElementById("openModal");
const openModalBtns = document.querySelectorAll(".open-modal");
const closeModalBtn = document.getElementById("closeModal");

if (openModalBtn && modalOverlay) {
  openModalBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });
}

openModalBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

if (closeModalBtn && modalOverlay) {
  closeModalBtn.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });
}

if (modalOverlay) {
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      modalOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

if (reviewPrev) {
  reviewPrev.addEventListener("click", () => {
    prevReview();
    resetReviewAutoplay();
  });
}

function startReviewAutoplay() {
  reviewAutoplay = setInterval(nextReview, 8000);
}

function resetReviewAutoplay() {
  clearInterval(reviewAutoplay);
  startReviewAutoplay();
}

// Touch/swipe support
let reviewTouchStartX = 0;
let reviewTouchEndX = 0;

if (reviewsTrack) {
  reviewsTrack.addEventListener("touchstart", (e) => {
    reviewTouchStartX = e.changedTouches[0].screenX;
  });

  reviewsTrack.addEventListener("touchend", (e) => {
    reviewTouchEndX = e.changedTouches[0].screenX;
    const diff = reviewTouchStartX - reviewTouchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextReview();
      else prevReview();
      resetReviewAutoplay();
    }
  });
}

// Handle resize
window.addEventListener("resize", () => {
  const newPerView = getReviewsPerView();
  if (newPerView !== reviewsPerView) {
    reviewsPerView = newPerView;
    reviewIndex = 0;
    buildReviewDots();
    updateReviewSlider();
  }
});

// Init
reviewsPerView = getReviewsPerView();
buildReviewDots();
updateReviewSlider();
startReviewAutoplay();

// ===================== CTA Section Scroll Animation =====================
const ctaText = document.querySelector(".cta-text");
const ctaImageWrap = document.querySelector(".cta-image-wrap");

if (ctaText && ctaImageWrap) {
  const ctaObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          ctaText.classList.add("animate");
          ctaImageWrap.classList.add("animate");
          ctaObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  ctaObserver.observe(document.querySelector(".cta-section"));
}
