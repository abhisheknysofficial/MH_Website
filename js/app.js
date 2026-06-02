/**
 * Malee Hospitality - Unified Application Interface Module
 * Handles Global Dark Mode Framework, Dropdowns, Sorting Sorters, Dynamic Accordions,
 * Form Security Filters, EmailJS integration, and Lightbox Photo Galleries.
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
       1. PERSISTENT GLOBAL THEME LOGIC CONTROLLER
       ========================================================================== */
  const themeToggleBtn = document.getElementById("themeToggle");

  if (themeToggleBtn) {
    const toggleIcon = themeToggleBtn.querySelector(".toggle-icon");

    // Evaluate user environmental configurations or cache values
    const currentSavedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    // Match initial view state elements
    if (currentSavedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      if (toggleIcon) toggleIcon.textContent = "☀️";
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      if (toggleIcon) toggleIcon.textContent = "🌙";
    }

    themeToggleBtn.addEventListener("click", () => {
      const currentActiveState =
        document.documentElement.getAttribute("data-theme");

      if (currentActiveState === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        toggleIcon.textContent = "🌙";
        localStorage.setItem("theme", "light");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        toggleIcon.textContent = "☀️";
        localStorage.setItem("theme", "dark");
      }
    });
  }

  /* ==========================================================================
       2. INTERACTIVE NAVIGATION DROPDOWN ENGINE
       ========================================================================== */
  const dropdownContainers = document.querySelectorAll(".dropdown");

  dropdownContainers.forEach((dropdown) => {
    const toggleButton = dropdown.querySelector(".dropdown-toggle");

    if (toggleButton) {
      toggleButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const isOpen = dropdown.classList.contains("open");

        // Strip open tags from sibling dropdown containers
        dropdownContainers.forEach((otherDropdown) => {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove("open");
            const activeBtn = otherDropdown.querySelector(".dropdown-toggle");
            if (activeBtn) activeBtn.setAttribute("aria-expanded", "false");
          }
        });

        if (isOpen) {
          dropdown.classList.remove("open");
          toggleButton.setAttribute("aria-expanded", "false");
        } else {
          dropdown.classList.add("open");
          toggleButton.setAttribute("aria-expanded", "true");
        }
      });
    }
  });

  // Close open menus automatically upon external view mutations
  document.addEventListener("click", () => {
    dropdownContainers.forEach((dropdown) => {
      dropdown.classList.remove("open");
      const toggleButton = dropdown.querySelector(".dropdown-toggle");
      if (toggleButton) toggleButton.setAttribute("aria-expanded", "false");
    });
  });

  /* ==========================================================================
       3. CLIENT-SIDE SERVICE CATALOG FILTER SORTER
       ========================================================================== */
  const filterPills = document.querySelectorAll(".pill");
  const catalogCards = document.querySelectorAll(".package-card");

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");

      const targetCategory = pill.getAttribute("data-filter");

      catalogCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");
        if (targetCategory === "all" || cardCategory === targetCategory) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  /* ==========================================================================
       4. CLIENT FAQ DYNAMIC HEIGHT ACCORDION LAYOUT
       ========================================================================== */
  const accordionHeaders = document.querySelectorAll(".accordion-header");

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const currentItem = header.parentElement;
      const currentPanel = currentItem.querySelector(".accordion-panel");
      const isActive = currentItem.classList.contains("active");

      // Collapse all structural panels down to zero layout bounds
      document.querySelectorAll(".accordion-item").forEach((item) => {
        item.classList.remove("active");
        const headNode = item.querySelector(".accordion-header");
        const panelNode = item.querySelector(".accordion-panel");
        if (headNode) headNode.setAttribute("aria-expanded", "false");
        if (panelNode) panelNode.style.maxHeight = null;
      });

      // Calculate exact bounding height variables and apply dynamically
      if (!isActive && currentPanel) {
        currentItem.classList.add("active");
        header.setAttribute("aria-expanded", "true");
        currentPanel.style.maxHeight = currentPanel.scrollHeight + "px";
      }
    });
  });

  /* ==========================================================================
       5. SECURE ENQUIRY FORM VALIDATION & EMAILJS DELIVERY FILTER
       ========================================================================= */
  const mainEnquiryForm = document.getElementById("enquiryForm");

  if (mainEnquiryForm) {
    if (typeof emailjs !== "undefined") {
      emailjs.init("dv48oFXMnICc_HhMk");
    }

    mainEnquiryForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let isFormValid = true;
      const requiredInputs = mainEnquiryForm.querySelectorAll(
        "input[required], select[required]",
      );

      requiredInputs.forEach((element) => {
        element.style.borderColor = "";

        if (
          !element.value.trim() ||
          (element.tagName === "SELECT" && element.value === "")
        ) {
          isFormValid = false;
          element.style.borderColor = "#E53E3E";
        }

        if (element.type === "email" && element.value) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(element.value.trim())) {
            isFormValid = false;
            element.style.borderColor = "#E53E3E";
          }
        }
      });

      if (!isFormValid) {
        alert("Please fill out all highlighted fields correctly.");
        return;
      }

      const submitBtn = mainEnquiryForm.querySelector(".submit-btn");
      const originalBtnText = submitBtn
        ? submitBtn.innerHTML
        : "Send Enquiry 🚀";

      if (submitBtn) {
        submitBtn.innerHTML = "Sending...";
        submitBtn.disabled = true;
      }

      if (typeof emailjs !== "undefined") {
        emailjs
          .sendForm("service_lfn3pid", "template_dvo7dzp", this)
          .then(() => {
            alert("Enquiry sent successfully!");
            mainEnquiryForm.reset();
          })
          .catch((error) => {
            console.error(error);
            alert("Failed to send enquiry.");
          })
          .finally(() => {
            if (submitBtn) {
              submitBtn.innerHTML = originalBtnText;
              submitBtn.disabled = false;
            }
          });
      } else {
        alert("Email transmission engine unavailable.");
        if (submitBtn) {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }
      }
    });
  }

  /* ==========================================================================
       6. FLUID MASONRY GALLERY SYSTEM & OVERLAY LIGHTBOX ENGINE (UPDATED HIDE RULE)
       ========================================================================== */
  const loadMoreBtn = document.getElementById("btnLoadMore");
  const filterButtons = document.querySelectorAll(".gallery-filter-btn");
  const allGalleryItems = document.querySelectorAll(".gallery-item");

  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImg = document.getElementById("lightboxActiveImg");
  const lightboxCaption = document.getElementById("lightboxCaption");

  const itemsPerBatch = 4;
  const INITIAL_VISIBLE_COUNT = 12;
  let visibleCount = INITIAL_VISIBLE_COUNT;
  let currentActiveFilter = "all";
  let dynamicActiveList = [];
  let currentImageIndex = 0;

  const updateGalleryLayoutState = () => {
    let matchCount = 0;

    allGalleryItems.forEach((item) => {
      const itemLocation = item.getAttribute("data-location");
      const matchesFilter =
        currentActiveFilter === "all" || itemLocation === currentActiveFilter;

      if (matchesFilter) {
        matchCount++;
        if (matchCount <= visibleCount) {
          item.classList.remove("hidden-batch");
        } else {
          item.classList.add("hidden-batch");
        }
      } else {
        item.classList.add("hidden-batch");
      }
    });

    // Determine total items matching the filter
    const totalMatchingAvailable = Array.from(allGalleryItems).filter(
      (item) => {
        const loc = item.getAttribute("data-location");
        return currentActiveFilter === "all" || loc === currentActiveFilter;
      },
    ).length;

    // FIXED: Safely hide button container or element via CSS utility priority class overrides
    if (loadMoreBtn) {
      const buttonWrapper = loadMoreBtn.parentElement;
      if (visibleCount >= totalMatchingAvailable) {
        loadMoreBtn.classList.add("force-hide-element");
        if (
          buttonWrapper &&
          buttonWrapper.classList.contains("load-more-container")
        ) {
          buttonWrapper.classList.add("force-hide-element");
        }
      } else {
        loadMoreBtn.classList.remove("force-hide-element");
        if (
          buttonWrapper &&
          buttonWrapper.classList.contains("load-more-container")
        ) {
          buttonWrapper.classList.remove("force-hide-element");
        }
      }
    }
  };

  // Tab interaction triggers mapping logic patterns
  filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      e.currentTarget.classList.add("active");

      currentActiveFilter = e.currentTarget.getAttribute("data-tag");
      visibleCount = INITIAL_VISIBLE_COUNT;
      updateGalleryLayoutState();
    });
  });

  // Pagination interactive bindings
  loadMoreBtn?.addEventListener("click", () => {
    visibleCount += itemsPerBatch;
    updateGalleryLayoutState();
  });

  // Lightbox Context Cache Builders
  function buildActiveArray() {
    dynamicActiveList = Array.from(allGalleryItems).filter(
      (item) => !item.classList.contains("hidden-batch"),
    );
  }

  const galleryGrid = document.getElementById("galleryGrid");
  if (galleryGrid && lightbox && lightboxImg) {
    galleryGrid.addEventListener("click", (e) => {
      const clickedItem = e.target.closest(".gallery-item");
      if (!clickedItem) return;

      buildActiveArray();
      currentImageIndex = dynamicActiveList.indexOf(clickedItem);
      if (currentImageIndex !== -1) {
        openLightboxElement(clickedItem);
      }
    });
  }

  function openLightboxElement(item) {
    if (!lightbox || !lightboxImg) return;
    const targetImg = item.querySelector("img");
    const targetSpan = item.querySelector(".item-overlay span");

    if (targetImg) lightboxImg.src = targetImg.src;
    if (lightboxCaption && targetSpan)
      lightboxCaption.textContent = targetSpan.textContent;

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function navigateLightbox(direction) {
    if (dynamicActiveList.length === 0) return;
    currentImageIndex += direction;

    if (currentImageIndex >= dynamicActiveList.length) currentImageIndex = 0;
    if (currentImageIndex < 0) currentImageIndex = dynamicActiveList.length - 1;

    openLightboxElement(dynamicActiveList[currentImageIndex]);
  }

  // Attach Lightbox Navigation Control Triggers
  const closeBtn = document.getElementById("lightboxClose");
  const nextBtn = document.getElementById("lightboxNext");
  const prevBtn = document.getElementById("lightboxPrev");

  closeBtn?.addEventListener("click", closeLightbox);
  nextBtn?.addEventListener("click", () => navigateLightbox(1));
  prevBtn?.addEventListener("click", () => navigateLightbox(-1));

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") navigateLightbox(1);
    if (e.key === "ArrowLeft") navigateLightbox(-1);
  });

  // Run core engine bootstrap calculations
  updateGalleryLayoutState();
});

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  const dotsContainer = document.getElementById("dotsContainer");

  if (!slides.length) return;

  let currentSlideIndex = 0;
  let slideInterval;
  const autoPlayDelay = 4000; // Changes pictures smoothly every 4 seconds automatically

  // Clear container before populating
  dotsContainer.innerHTML = "";

  // Append functional navigation dots dynamically
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.setAttribute("aria-label", `Maps to slide ${index + 1}`);
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  function updateSliderDOM() {
    slides.forEach((slide, index) => {
      if (index === currentSlideIndex) {
        slide.classList.add("active");
        if (dots[index]) dots[index].classList.add("active");
      } else {
        slide.classList.remove("active");
        if (dots[index]) dots[index].classList.remove("active");
      }
    });
  }

  function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    updateSliderDOM();
  }

  function prevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    updateSliderDOM();
  }

  function goToSlide(index) {
    currentSlideIndex = index;
    updateSliderDOM();
    resetSliderInterval(); // Resets timer so manual clicks don't cause sudden double jumps
  }

  function startSliderInterval() {
    slideInterval = setInterval(nextSlide, autoPlayDelay);
  }

  function resetSliderInterval() {
    clearInterval(slideInterval);
    startSliderInterval();
  }

  // Assign button interaction layers safely
  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetSliderInterval();
    });

    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetSliderInterval();
    });
  }

  // Fire up the automatic slider logic loop
  startSliderInterval();
});

// ==========================================================================
// SEPARATE PACKAGES PAGE CONTROLLER ENGINE (js/packages.js)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const destTabs = document.querySelectorAll(".dest-tab");
  const destPanels = document.querySelectorAll(".destination-panel");

  if (!destTabs.length || !destPanels.length) return;

  destTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // 1. Remove active state from all capsule indicators
      destTabs.forEach((t) => t.classList.remove("active"));

      // 2. Hide all country destination layout panels
      destPanels.forEach((p) => p.classList.remove("active"));

      // 3. Highlight the clicked tab
      tab.classList.add("active");

      // 4. Reveal the corresponding target destination panel
      const targetId = tab.getAttribute("data-target");
      const targetPanel = document.getElementById(targetId);

      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });
});

// ==========================================================================
// SEPARATE PACKAGES FLYER PORTAL INTERACTION LAYER (js/packages.js)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const destTabs = document.querySelectorAll(".dest-tab");
  const destPanels = document.querySelectorAll(".destination-panel");

  if (!destTabs.length || !destPanels.length) return;

  destTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // 1. Clear active configuration flags from pill triggers
      destTabs.forEach((t) => t.classList.remove("active"));

      // 2. Hide active flyer view segments
      destPanels.forEach((p) => p.classList.remove("active"));

      // 3. Flag clicked element as active selection
      tab.classList.add("active");

      // 4. Match and project targets
      const targetId = tab.getAttribute("data-target");
      const targetPanel = document.getElementById(targetId);

      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });
});

// ==========================================================================
// B2B PACKAGES TAB NAVIGATION SWITCH SYSTEM (js/packages.js)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const destTabs = document.querySelectorAll(".dest-tab");
  const destPanels = document.querySelectorAll(".destination-panel");

  if (!destTabs.length || !destPanels.length) return;

  destTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // 1. Clear active flags from tab options
      destTabs.forEach((t) => t.classList.remove("active"));

      // 2. Hide active display sheet sets
      destPanels.forEach((p) => p.classList.remove("active"));

      // 3. Mark current target selection tab as active template state
      tab.classList.add("active");

      // 4. Retrieve and activate the correct panel layout section
      const targetId = tab.getAttribute("data-target");
      const targetPanel = document.getElementById(targetId);

      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });
});

// ==========================================================================
// PORTAL NAVIGATION LOGIC CONTROLS (js/packages.js)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const destTabs = document.querySelectorAll(".dest-tab");
  const destPanels = document.querySelectorAll(".destination-panel");

  if (!destTabs.length || !destPanels.length) return;

  destTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // 1. Terminate styling flags across tab controllers
      destTabs.forEach((t) => t.classList.remove("active"));

      // 2. Hide all layout grids safely from viewport render
      destPanels.forEach((p) => p.classList.remove("active"));

      // 3. Flag clicked option selector element as active view anchor state
      tab.classList.add("active");

      // 4. Match target panel string ID parameters
      const targetId = tab.getAttribute("data-target");
      const targetPanel = document.getElementById(targetId);

      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });
});

// ==========================================================================
// CORE PORTAL ENGINE & FILTER SWITCH MODULE (js/packages.js)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Use scoped selection hooks to isolate interactive trigger states flawlessly
  const tabTriggers = document.querySelectorAll(
    ".destination-tabs-container .dest-tab",
  );
  const panelSheets = document.querySelectorAll(
    ".panels-grid-wrapper .destination-panel",
  );

  if (!tabTriggers.length || !panelSheets.length) {
    console.warn(
      "Malee Packages Engine Notice: Filter items missing from target viewport structural frames.",
    );
    return;
  }

  tabTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();

      // 1. Terminate highlighted active markers across trigger keys
      tabTriggers.forEach((btn) => btn.classList.remove("active"));

      // 2. Clear out visibility flags across all display panels completely
      panelSheets.forEach((panel) => panel.classList.remove("active"));

      // 3. Mark the current click item action state as active view profile
      trigger.classList.add("active");

      // 4. Retrieve key token identifier context
      const targetedDataId = trigger.getAttribute("data-target");
      const activePanelElement = document.getElementById(targetedDataId);

      if (activePanelElement) {
        activePanelElement.classList.add("active");
      } else {
        console.error(
          `Malee Core Error: Target configuration sheet "${targetedDataId}" can not be found inside the DOM framework.`,
        );
      }
    });
  });
});

// Add this to your existing app.js to enable smooth scroll animations
document.addEventListener("DOMContentLoaded", function () {
  const fadeElements = document.querySelectorAll(".fade-in-up");

  const elementObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Stop observing once it has faded in
        }
      });
    },
    {
      root: null,
      threshold: 0.1, // Trigger when 10% of the element is visible
      rootMargin: "0px 0px -50px 0px",
    },
  );

  fadeElements.forEach((el) => {
    elementObserver.observe(el);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
       1. HERO SLIDER ENGINE
       ========================================================================== */
  const slides = document.querySelectorAll(".slide");
  const nextBtn = document.getElementById("nextSlide");
  const prevBtn = document.getElementById("prevSlide");
  const dotsContainer = document.getElementById("dotsContainer");

  if (slides.length > 0) {
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 6000; // 6 seconds per slide

    // Initialize Dots
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.classList.add("dot");
      if (index === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".dot");

    const updateSliderUI = () => {
      slides.forEach((slide) => slide.classList.remove("active"));
      dots.forEach((dot) => dot.classList.remove("active"));

      slides[currentSlide].classList.add("active");
      dots[currentSlide].classList.add("active");
    };

    const nextSlide = () => {
      currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
      updateSliderUI();
      resetInterval();
    };

    const prevSlide = () => {
      currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
      updateSliderUI();
      resetInterval();
    };

    const goToSlide = (index) => {
      currentSlide = index;
      updateSliderUI();
      resetInterval();
    };

    const resetInterval = () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, intervalTime);
    };

    // Event Listeners for Arrows
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);

    // Start Autoplay
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  /* ==========================================================================
       2. SMOOTH SCROLL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
  const animatedElements = document.querySelectorAll(
    ".package-card, .why-card, .about-content, .about-img-holder, .info-card, .social-card",
  );

  // Add base class for CSS to target
  animatedElements.forEach((el) => el.classList.add("smooth-reveal"));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    {
      root: null,
      threshold: 0.15, // Trigger when 15% visible
      rootMargin: "0px 0px -50px 0px",
    },
  );

  animatedElements.forEach((el) => revealObserver.observe(el));

  /* ==========================================================================
       3. FAQ ACCORDION LOGIC
       ========================================================================== */
  const accordions = document.querySelectorAll(".accordion-header");

  accordions.forEach((accordion) => {
    accordion.addEventListener("click", function () {
      // Close other open panels for a cleaner experience (optional)
      accordions.forEach((other) => {
        if (
          other !== this &&
          other.parentElement.classList.contains("active")
        ) {
          other.parentElement.classList.remove("active");
          other.setAttribute("aria-expanded", "false");
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      const panel = this.nextElementSibling;
      const item = this.parentElement;
      const isActive = item.classList.toggle("active");

      this.setAttribute("aria-expanded", isActive);

      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* ==========================================================================
       4. THEME TOGGLE (DARK/LIGHT MODE)
       ========================================================================== */
  const themeToggle = document.getElementById("themeToggle");
  const rootHtml = document.documentElement;
  const toggleIcon = themeToggle
    ? themeToggle.querySelector(".toggle-icon")
    : null;

  // Check local storage for saved preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    rootHtml.setAttribute("data-theme", savedTheme);
    if (toggleIcon)
      toggleIcon.textContent = savedTheme === "dark" ? "☀️" : "🌙";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = rootHtml.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      rootHtml.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      if (toggleIcon)
        toggleIcon.textContent = newTheme === "dark" ? "☀️" : "🌙";
    });
  }

  /* ==========================================================================
       5. FILTER PILLS LOGIC (PACKAGES)
       ========================================================================== */
  const filterPills = document.querySelectorAll(".pill");
  const packageCards = document.querySelectorAll(".package-card");

  if (filterPills.length > 0 && packageCards.length > 0) {
    filterPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        // Update active state on pills
        filterPills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");

        const filterValue = pill.getAttribute("data-filter");

        // Filter cards
        packageCards.forEach((card) => {
          if (
            filterValue === "all" ||
            card.getAttribute("data-category") === filterValue
          ) {
            card.classList.remove("force-hide-element");
            // Slight delay to allow smooth reflow
            setTimeout(() => (card.style.opacity = "1"), 50);
          } else {
            card.style.opacity = "0";
            setTimeout(() => card.classList.add("force-hide-element"), 300);
          }
        });
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
       1. SMOOTH SCROLL REVEAL (Intersection Observer)
       ========================================================================== */
  // Target all elements that should fade up as you scroll
  const animatedElements = document.querySelectorAll(
    ".smooth-reveal, .package-card, .why-card, .team-card",
  );

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    {
      root: null,
      threshold: 0.15, // Trigger when 15% visible
      rootMargin: "0px 0px -50px 0px",
    },
  );

  animatedElements.forEach((el) => {
    // Ensure they have the base class before observing
    el.classList.add("smooth-reveal");
    revealObserver.observe(el);
  });

  /* ==========================================================================
       2. NUMBER COUNTER ANIMATION
       ========================================================================== */
  const counters = document.querySelectorAll(".counter");
  const animationSpeed = 200; // Lower number = faster counting

  const runCounter = (counter) => {
    const updateCount = () => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText;

      // Calculate increment based on target
      const increment = target / animationSpeed;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 10); // Run every 10ms
      } else {
        counter.innerText = target; // Lock exactly to the target number
      }
    };
    updateCount();
  };

  // Use Intersection Observer so it only counts when the user sees it
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          runCounter(counter);
          observer.unobserve(counter); // Stop observing so it doesn't recount
        }
      });
    },
    {
      root: null,
      threshold: 0.5, // Wait until the stats block is 50% visible
      rootMargin: "0px",
    },
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });

  /* ==========================================================================
       3. THEME TOGGLE (DARK/LIGHT MODE)
       ========================================================================== */
  const themeToggle = document.getElementById("themeToggle");
  const rootHtml = document.documentElement;
  const toggleIcon = themeToggle
    ? themeToggle.querySelector(".toggle-icon")
    : null;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    rootHtml.setAttribute("data-theme", savedTheme);
    if (toggleIcon)
      toggleIcon.textContent = savedTheme === "dark" ? "☀️" : "🌙";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = rootHtml.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      rootHtml.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      if (toggleIcon)
        toggleIcon.textContent = newTheme === "dark" ? "☀️" : "🌙";
    });
  }

  /* ==========================================================================
       4. FAQ ACCORDION LOGIC
       ========================================================================== */
  const accordions = document.querySelectorAll(".accordion-header");
  accordions.forEach((accordion) => {
    accordion.addEventListener("click", function () {
      // Close others
      accordions.forEach((other) => {
        if (
          other !== this &&
          other.parentElement.classList.contains("active")
        ) {
          other.parentElement.classList.remove("active");
          other.setAttribute("aria-expanded", "false");
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      const panel = this.nextElementSibling;
      const item = this.parentElement;
      const isActive = item.classList.toggle("active");

      this.setAttribute("aria-expanded", isActive);
      panel.style.maxHeight = isActive ? panel.scrollHeight + "px" : null;
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
       1. SMOOTH SCROLL REVEAL (Intersection Observer)
       ========================================================================== */
  // Target all elements that have the smooth-reveal class
  const animatedElements = document.querySelectorAll(".smooth-reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    {
      root: null,
      threshold: 0.15, // Trigger when 15% visible
      rootMargin: "0px 0px -50px 0px",
    },
  );

  animatedElements.forEach((el) => {
    revealObserver.observe(el);
  });

  /* ==========================================================================
       2. NUMBER COUNTER ANIMATION
       ========================================================================== */
  const counters = document.querySelectorAll(".counter");
  const animationSpeed = 200; // Lower number = faster counting

  const runCounter = (counter) => {
    const updateCount = () => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText;

      // Calculate increment based on target
      const increment = target / animationSpeed;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 10); // Run every 10ms
      } else {
        counter.innerText = target; // Lock exactly to the target number
      }
    };
    updateCount();
  };

  // Use Intersection Observer so it only counts when the user sees it
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          runCounter(counter);
          observer.unobserve(counter); // Stop observing so it doesn't recount
        }
      });
    },
    {
      root: null,
      threshold: 0.5, // Wait until the stats block is 50% visible
      rootMargin: "0px",
    },
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });

  /* ==========================================================================
       3. THEME TOGGLE (DARK/LIGHT MODE)
       ========================================================================== */
  const themeToggle = document.getElementById("themeToggle");
  const rootHtml = document.documentElement;
  const toggleIcon = themeToggle
    ? themeToggle.querySelector(".toggle-icon")
    : null;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    rootHtml.setAttribute("data-theme", savedTheme);
    if (toggleIcon)
      toggleIcon.textContent = savedTheme === "dark" ? "☀️" : "🌙";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = rootHtml.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      rootHtml.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      if (toggleIcon)
        toggleIcon.textContent = newTheme === "dark" ? "☀️" : "🌙";
    });
  }

  /* ==========================================================================
       4. FAQ ACCORDION LOGIC (If needed globally)
       ========================================================================== */
  const accordions = document.querySelectorAll(".accordion-header");
  accordions.forEach((accordion) => {
    accordion.addEventListener("click", function () {
      // Close others
      accordions.forEach((other) => {
        if (
          other !== this &&
          other.parentElement.classList.contains("active")
        ) {
          other.parentElement.classList.remove("active");
          other.setAttribute("aria-expanded", "false");
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      const panel = this.nextElementSibling;
      const item = this.parentElement;
      const isActive = item.classList.toggle("active");

      this.setAttribute("aria-expanded", isActive);
      panel.style.maxHeight = isActive ? panel.scrollHeight + "px" : null;
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const popupOverlay = document.getElementById("travel-popup-overlay");
  const closePopupBtn = document.getElementById("close-travel-popup");
  const leadForm = document.getElementById("travel-lead-form");

  // APPEAR INSTANTLY: Trigger active state immediately on DOM load
  popupOverlay.classList.add("is-visible");

  function closeTravelPopup() {
    popupOverlay.classList.remove("is-visible");
  }

  // Close Actions
  closePopupBtn.addEventListener("click", closeTravelPopup);

  popupOverlay.addEventListener("click", function (e) {
    if (e.target === popupOverlay) {
      closeTravelPopup();
    }
  });

  // Form Submissions
  leadForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      firstName: document.getElementById("popup-firstname").value,
      phone: document.getElementById("popup-phone").value,
      city: document.getElementById("popup-city").value,
      email: document.getElementById("popup-email").value,
    };

    console.log("Malaysia Travel Lead Captured:", formData);

    // UI Confirmation Success Animation
    const formContainer = document.querySelector(".travel-popup-form-side");
    formContainer.style.opacity = "0";
    formContainer.style.transition = "opacity 0.3s ease";

    setTimeout(function () {
      formContainer.innerHTML = `
                <div style="text-align: center; margin: auto; padding: 40px 0;">
                    <div style="font-size: 60px; color: #e45d16; margin-bottom: 15px;">✓</div>
                    <h2 style="color: #222; margin-bottom: 10px; font-family: Arial, sans-serif;">Enquiry Received!</h2>
                    <p style="color: #555; font-size: 14px; font-family: Arial, sans-serif; line-height: 1.5;">
                        Thank you for reaching out to Malee Hospitality.<br>Our destination expert will contact you shortly.
                    </p>
                </div>
            `;
      formContainer.style.opacity = "1";
    }, 300);

    // Terminate container display completely after user visual confirmation
    setTimeout(closeTravelPopup, 2800);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const targetSection = document.getElementById("legacy-adventure-section");

  // Configure structural reveal tracking triggers
  const revealOptions = {
    root: null, // Tracks relative to browser viewport bounds
    threshold: 0.12, // Fires safely when 12% of the component becomes visible
    border: "0px",
  };

  const sectionObserver = new IntersectionObserver(function (
    entries,
    observer,
  ) {
    entries.forEach((entry) => {
      // Check if element has successfully crossed into viewport thresholds
      if (entry.isIntersecting) {
        // Add class to trigger the CSS transition loading animation
        entry.target.classList.add("is-loaded");

        // Stop observing once loaded so animation only runs once
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  // Turn tracking sensors ON
  if (targetSection) {
    sectionObserver.observe(targetSection);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const track = document.getElementById("reviews-track");
  const prevBtn = document.getElementById("prev-review-btn");
  const nextBtn = document.getElementById("next-review-btn");
  const section = document.getElementById("google-reviews-section");

  let currentIndex = 0;

  function getCardsInView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }

  function updateSliderPosition() {
    const cards = document.querySelectorAll(".mh-review-card");
    const totalCards = cards.length;
    const cardsInView = getCardsInView();
    const maxIndex = totalCards - cardsInView;

    // Boundaries confirmation guards
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    // Calculate card element gaps dynamically
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 24; // Corresponds with track layout gap values from CSS

    const computeOffset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${computeOffset}px)`;
  }

  // Interactive Trigger Bindings
  nextBtn.addEventListener("click", function () {
    const cardsInView = getCardsInView();
    const totalCards = document.querySelectorAll(".mh-review-card").length;
    if (currentIndex < totalCards - cardsInView) {
      currentIndex++;
      updateSliderPosition();
    }
  });

  prevBtn.addEventListener("click", function () {
    if (currentIndex > 0) {
      currentIndex--;
      updateSliderPosition();
    }
  });

  // Resize listeners to keep card alignment intact
  window.addEventListener("resize", updateSliderPosition);

  // --- Reuse Scroll Reveal Observer Logic ---
  const reviewObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-loaded");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  if (section) {
    reviewObserver.observe(section);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const track = document.getElementById("reviews-track");
  const prevBtn = document.getElementById("prev-review-btn");
  const nextBtn = document.getElementById("next-review-btn");
  const section = document.getElementById("google-reviews-section");

  let currentIndex = 0;
  let autoPlayTimer = null;
  const slideDuration = 4000; // Cycles every 4000ms (4 seconds)

  function getCardsInView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }

  function getMaxIndex() {
    const totalCards = document.querySelectorAll(".mh-review-card").length;
    return totalCards - getCardsInView();
  }

  function updateSliderPosition() {
    const cards = document.querySelectorAll(".mh-review-card");
    const maxIndex = getMaxIndex();

    // Keeps track alignment bound within proper limits
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 24; // Synchronized with CSS layout gaps

    const computeOffset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${computeOffset}px)`;
  }

  // Move to next slide function
  function slideNext() {
    const maxIndex = getMaxIndex();
    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0; // Seamlessly loops back to the beginning card
    }
    updateSliderPosition();
  }

  // Move to previous slide function
  function slidePrev() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = getMaxIndex(); // Loops back to the last available position
    }
    updateSliderPosition();
  }

  // --- Auto-Play Engine Management ---
  function startAutoPlay() {
    if (autoPlayTimer === null) {
      autoPlayTimer = setInterval(slideNext, slideDuration);
    }
  }

  function stopAutoPlay() {
    if (autoPlayTimer !== null) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  // Manual Arrow Click Events
  nextBtn.addEventListener("click", function () {
    stopAutoPlay();
    slideNext();
    startAutoPlay(); // Restarts the countdown timer after manual interaction
  });

  prevBtn.addEventListener("click", function () {
    stopAutoPlay();
    slidePrev();
    startAutoPlay();
  });

  // Smart UX: Pauses the slide cycle when the user hovers over the reviews to read them
  section.addEventListener("mouseenter", stopAutoPlay);
  section.addEventListener("mouseleave", startAutoPlay);

  // Initializations and window listeners
  window.addEventListener("resize", updateSliderPosition);
  startAutoPlay();

  // --- Scroll Reveal Intersection Observer ---
  const reviewObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-loaded");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  if (section) {
    reviewObserver.observe(section);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const track = document.getElementById("reviews-track");
  const prevBtn = document.getElementById("prev-review-btn");
  const nextBtn = document.getElementById("next-review-btn");
  const section = document.getElementById("google-reviews-section");

  let currentIndex = 0;
  let autoPlayTimer = null;
  const slideDuration = 4000; // Time step interval: 4 seconds

  function getCardsInView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }

  function getMaxIndex() {
    const totalCards = document.querySelectorAll(".mh-review-card").length;
    return totalCards - getCardsInView();
  }

  function updateSliderPosition() {
    const cards = document.querySelectorAll(".mh-review-card");
    const maxIndex = getMaxIndex();

    // Safety catch limits
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 24; // Matches layout styling gaps

    const computeOffset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${computeOffset}px)`;
  }

  // Next Slide Automation
  function slideNext() {
    const maxIndex = getMaxIndex();
    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0; // Infinite loop mechanism: Jumps back to slide 1
    }
    updateSliderPosition();
  }

  // Previous Slide Backstep
  function slidePrev() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = getMaxIndex(); // Infinite loop mechanism: Jumps to the end
    }
    updateSliderPosition();
  }

  // --- Active Auto-Play Loop Controls ---
  function startAutoPlay() {
    if (autoPlayTimer === null) {
      autoPlayTimer = setInterval(slideNext, slideDuration);
    }
  }

  function stopAutoPlay() {
    if (autoPlayTimer !== null) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  // Click Interactions (Instantly resets the timer loop)
  nextBtn.addEventListener("click", function () {
    stopAutoPlay();
    slideNext();
    startAutoPlay();
  });

  prevBtn.addEventListener("click", function () {
    stopAutoPlay();
    slidePrev();
    startAutoPlay();
  });

  // Pause on Mouse Hover
  section.addEventListener("mouseenter", stopAutoPlay);
  section.addEventListener("mouseleave", startAutoPlay);

  // Initializations
  window.addEventListener("resize", updateSliderPosition);
  startAutoPlay();

  // Scroll Reveal Observer
  const reviewObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-loaded");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  if (section) {
    reviewObserver.observe(section);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const triggerBtn = document.getElementById("dream-trip-trigger-btn");
  const modalOverlay = document.getElementById("dream-trip-popup-overlay");
  const closeModalBtn = document.getElementById("close-dream-modal");
  const plannerForm = document.getElementById("dream-trip-planner-form");

  // 1. Open Modal Window Action Trigger
  triggerBtn.addEventListener("click", function () {
    modalOverlay.classList.add("is-active");
    triggerBtn.style.visibility = "hidden"; // Hides floating button behind modal layer
  });

  // 2. Structural Closure functions
  function closeDreamModal() {
    modalOverlay.classList.remove("is-active");
    triggerBtn.style.visibility = "visible"; // Returns trigger button visibility safely
  }

  closeModalBtn.addEventListener("click", closeDreamModal);

  // 3. Close out layout box if overlay region is clicked
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      closeDreamModal();
    }
  });

  // 4. Form Submission Handling
  plannerForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevents default page reloading cycles

    // Form processing confirmation success visual handler
    const contentBox = document.querySelector(".dream-modal-form-side");
    contentBox.style.opacity = "0";
    contentBox.style.transition = "opacity 0.3s ease";

    setTimeout(function () {
      contentBox.innerHTML = `
                <div style="text-align: center; margin: auto; padding: 60px 0;">
                    <div style="font-size: 64px; color: #e45d16; margin-bottom: 20px;">✓</div>
                    <h2 style="color: #0b1a4a; margin-bottom: 12px; font-family: Arial, sans-serif;">Plan Registered!</h2>
                    <p style="color: #475569; font-size: 14px; font-family: Arial, sans-serif; line-height: 1.6;">
                        Thank you for sharing your destination outline.<br>Our holiday specialists will contact you with options shortly.
                    </p>
                </div>
            `;
      contentBox.style.opacity = "1";
    }, 300);

    // Closes out popup completely after confirmation notice displays
    setTimeout(closeDreamModal, 3000);
  });
});

/* ==========================================================================
   HERO SLIDER LOGIC WITH ZOOM RESETS
   ========================================================================== */
const slides = document.querySelectorAll(".slide");
const nextBtn = document.getElementById("nextSlide");
const prevBtn = document.getElementById("prevSlide");
const dotsContainer = document.getElementById("dotsContainer");

if (slides.length > 0) {
  let currentSlide = 0;
  let slideInterval;
  const intervalTime = 6500; // Time spent per slide view (6.5 seconds)

  // Build Navigation Dots
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  const updateSliderUI = () => {
    slides.forEach((slide) => {
      slide.classList.remove("active");

      // Instantly drop scaling back to 1 when a slide leaves the view
      const img = slide.querySelector(".slide-image-wrapper img");
      if (img) {
        img.style.transition = "none";
        img.style.transform = "scale(1)";
        img.offsetHeight; // Forces a browser layout layout recalculation
        img.style.transition = "";
      }
    });

    dots.forEach((dot) => dot.classList.remove("active"));

    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  };

  const nextSlide = () => {
    currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    updateSliderUI();
    resetInterval();
  };

  const prevSlide = () => {
    currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    updateSliderUI();
    resetInterval();
  };

  const goToSlide = (index) => {
    currentSlide = index;
    updateSliderUI();
    resetInterval();
  };

  const resetInterval = () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, intervalTime);
  };

  // Click Bindings
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);

  // Initial Engine Kickstart
  resetInterval();
}

// / COUONTER CODE FOR THE ----

document.addEventListener("DOMContentLoaded", () => {
  const stats = document.querySelectorAll(".mh-stat-number");
  const animationSpeed = 50; // Controls overall count velocity

  const runCounter = (element) => {
    const targetValue = +element.getAttribute("data-target");

    const update = () => {
      // Strip everything non-numeric to calculate current step raw integer
      const currentVal = +element.innerText.replace(/[^0-9]/g, "");
      const increment = Math.ceil(targetValue / animationSpeed);

      if (currentVal < targetValue) {
        const nextVal =
          currentVal + increment > targetValue
            ? targetValue
            : currentVal + increment;

        // Formats dynamically to regional format (e.g. 10,00,000)
        let formatted = nextVal.toLocaleString("en-IN");

        // Append "+" to all stats except "Years of Experience" (target 41)
        if (targetValue !== 41) {
          formatted += "+";
        }

        element.innerText = formatted;
        setTimeout(update, 30);
      } else {
        // Final fallback lock
        let finalFormatted = targetValue.toLocaleString("en-IN");
        element.innerText =
          targetValue === 41 ? finalFormatted : finalFormatted + "+";
      }
    };

    update();
  };

  // Trigger animations securely via IntersectionObserver
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("mh-reveal-active");
          stats.forEach((stat) => runCounter(stat));
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  const sectionElement = document.getElementById("legacy-adventure-section");
  if (sectionElement) revealObserver.observe(sectionElement);
});
