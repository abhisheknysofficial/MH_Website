/**
 * Malee Hospitality - Unified Application Interface Module
 * Refactored & Optimized: Duplicates Removed, Single DOMContentLoaded Wrapper
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
       1. PERSISTENT GLOBAL THEME LOGIC CONTROLLER
       ========================================================================== */
  const themeToggleBtn = document.getElementById("themeToggle");
  const rootHtml = document.documentElement;

  if (themeToggleBtn) {
    const toggleIcon = themeToggleBtn.querySelector(".toggle-icon");
    const currentSavedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    // Initial load match
    rootHtml.setAttribute("data-theme", currentSavedTheme);
    if (toggleIcon)
      toggleIcon.textContent = currentSavedTheme === "dark" ? "☀️" : "🌙";

    themeToggleBtn.addEventListener("click", () => {
      const currentActiveState = rootHtml.getAttribute("data-theme");
      const newTheme = currentActiveState === "dark" ? "light" : "dark";

      rootHtml.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      if (toggleIcon)
        toggleIcon.textContent = newTheme === "dark" ? "☀️" : "🌙";
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

        dropdown.classList.toggle("open", !isOpen);
        toggleButton.setAttribute("aria-expanded", !isOpen);
      });
    }
  });

  document.addEventListener("click", () => {
    dropdownContainers.forEach((dropdown) => {
      dropdown.classList.remove("open");
      const toggleButton = dropdown.querySelector(".dropdown-toggle");
      if (toggleButton) toggleButton.setAttribute("aria-expanded", "false");
    });
  });

  /* ==========================================================================
       3. CLIENT FAQ DYNAMIC HEIGHT ACCORDION LAYOUT
       ========================================================================== */
  const accordions = document.querySelectorAll(".accordion-header");

  accordions.forEach((accordion) => {
    accordion.addEventListener("click", function () {
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

  /* ==========================================================================
       4. CLIENT-SIDE SERVICE CATALOG FILTER SORTER (PILLS)
       ========================================================================== */
  const filterPills = document.querySelectorAll(".pill");
  const packageCards = document.querySelectorAll(".package-card");

  if (filterPills.length > 0 && packageCards.length > 0) {
    filterPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        filterPills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");

        const filterValue = pill.getAttribute("data-filter");

        packageCards.forEach((card) => {
          if (
            filterValue === "all" ||
            card.getAttribute("data-category") === filterValue
          ) {
            card.classList.remove("hidden", "force-hide-element");
            setTimeout(() => (card.style.opacity = "1"), 50);
          } else {
            card.style.opacity = "0";
            setTimeout(
              () => card.classList.add("hidden", "force-hide-element"),
              300,
            );
          }
        });
      });
    });
  }

  /* ==========================================================================
       5. PACKAGES TAB NAVIGATION SWITCH SYSTEM (DESTINATIONS)
       ========================================================================== */
  const destTabs = document.querySelectorAll(
    ".dest-tab, .destination-tabs-container .dest-tab",
  );
  const destPanels = document.querySelectorAll(
    ".destination-panel, .panels-grid-wrapper .destination-panel",
  );

  if (destTabs.length && destPanels.length) {
    destTabs.forEach((tab) => {
      tab.addEventListener("click", (event) => {
        event.preventDefault();

        destTabs.forEach((t) => t.classList.remove("active"));
        destPanels.forEach((p) => p.classList.remove("active"));

        tab.classList.add("active");

        const targetId = tab.getAttribute("data-target");
        const targetPanel = document.getElementById(targetId);

        if (targetPanel) {
          targetPanel.classList.add("active");
        }
      });
    });
  }

  /* ==========================================================================
       6. HERO SLIDER ENGINE (WITH AUTOPLAY & ZOOM RESET)
       ========================================================================== */
  const heroSlides = document.querySelectorAll(".slide");
  const nextBtn = document.getElementById("nextSlide");
  const prevBtn = document.getElementById("prevSlide");
  const dotsContainer = document.getElementById("dotsContainer");

  if (heroSlides.length > 0 && dotsContainer) {
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 6500;

    dotsContainer.innerHTML = ""; // Clear before populating
    heroSlides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.classList.add("dot");
      if (index === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".dot");

    const updateSliderUI = () => {
      heroSlides.forEach((slide) => {
        slide.classList.remove("active");
        const img = slide.querySelector(".slide-image-wrapper img");
        if (img) {
          img.style.transition = "none";
          img.style.transform = "scale(1)";
          img.offsetHeight; // Force layout recalculation
          img.style.transition = "";
        }
      });

      dots.forEach((dot) => dot.classList.remove("active"));
      heroSlides[currentSlide].classList.add("active");
      dots[currentSlide].classList.add("active");
    };

    const nextSlide = () => {
      currentSlide =
        currentSlide === heroSlides.length - 1 ? 0 : currentSlide + 1;
      updateSliderUI();
      resetInterval();
    };

    const prevSlide = () => {
      currentSlide =
        currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1;
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

    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
    resetInterval();
  }

  /* ==========================================================================
       7. FLUID MASONRY GALLERY SYSTEM & OVERLAY LIGHTBOX ENGINE
       ========================================================================== */
  const loadMoreBtn = document.getElementById("btnLoadMore");
  const galleryFilterButtons = document.querySelectorAll(".gallery-filter-btn");
  const allGalleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImg = document.getElementById("lightboxActiveImg");
  const lightboxCaption = document.getElementById("lightboxCaption");

  if (allGalleryItems.length > 0) {
    const itemsPerBatch = 4;
    const INITIAL_VISIBLE_COUNT = 12;
    let visibleCount = INITIAL_VISIBLE_COUNT;
    let currentGalleryFilter = "all";
    let dynamicActiveList = [];
    let currentImageIndex = 0;

    const updateGalleryLayoutState = () => {
      let matchCount = 0;
      allGalleryItems.forEach((item) => {
        const itemLocation = item.getAttribute("data-location");
        const matchesFilter =
          currentGalleryFilter === "all" ||
          itemLocation === currentGalleryFilter;

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

      const totalMatchingAvailable = Array.from(allGalleryItems).filter(
        (item) => {
          const loc = item.getAttribute("data-location");
          return currentGalleryFilter === "all" || loc === currentGalleryFilter;
        },
      ).length;

      if (loadMoreBtn) {
        const buttonWrapper = loadMoreBtn.parentElement;
        if (visibleCount >= totalMatchingAvailable) {
          loadMoreBtn.classList.add("force-hide-element");
          if (buttonWrapper?.classList.contains("load-more-container")) {
            buttonWrapper.classList.add("force-hide-element");
          }
        } else {
          loadMoreBtn.classList.remove("force-hide-element");
          if (buttonWrapper?.classList.contains("load-more-container")) {
            buttonWrapper.classList.remove("force-hide-element");
          }
        }
      }
    };

    galleryFilterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        galleryFilterButtons.forEach((btn) => btn.classList.remove("active"));
        e.currentTarget.classList.add("active");
        currentGalleryFilter = e.currentTarget.getAttribute("data-tag");
        visibleCount = INITIAL_VISIBLE_COUNT;
        updateGalleryLayoutState();
      });
    });

    loadMoreBtn?.addEventListener("click", () => {
      visibleCount += itemsPerBatch;
      updateGalleryLayoutState();
    });

    // Lightbox Logic
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
        if (currentImageIndex !== -1) openLightboxElement(clickedItem);
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
      if (currentImageIndex < 0)
        currentImageIndex = dynamicActiveList.length - 1;
      openLightboxElement(dynamicActiveList[currentImageIndex]);
    }

    document
      .getElementById("lightboxClose")
      ?.addEventListener("click", closeLightbox);
    document
      .getElementById("lightboxNext")
      ?.addEventListener("click", () => navigateLightbox(1));
    document
      .getElementById("lightboxPrev")
      ?.addEventListener("click", () => navigateLightbox(-1));

    lightbox?.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox?.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigateLightbox(1);
      if (e.key === "ArrowLeft") navigateLightbox(-1);
    });

    updateGalleryLayoutState();
  }

  /* ==========================================================================
       8. GOOGLE REVIEWS SLIDER (AUTOPLAY + INFINITE LOOP)
       ========================================================================== */
  const track = document.getElementById("reviews-track");
  const prevRevBtn = document.getElementById("prev-review-btn");
  const nextRevBtn = document.getElementById("next-review-btn");
  const reviewsSection = document.getElementById("google-reviews-section");

  if (track && prevRevBtn && nextRevBtn && reviewsSection) {
    let currentRevIndex = 0;
    let autoPlayTimer = null;
    const slideDuration = 2200;

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
      if (!cards.length) return;
      const maxIndex = getMaxIndex();

      if (currentRevIndex > maxIndex) currentRevIndex = maxIndex;
      if (currentRevIndex < 0) currentRevIndex = 0;

      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = 24;
      const computeOffset = currentRevIndex * (cardWidth + gap);
      track.style.transform = `translateX(-${computeOffset}px)`;
    }

    function slideNext() {
      const maxIndex = getMaxIndex();
      currentRevIndex = currentRevIndex < maxIndex ? currentRevIndex + 1 : 0;
      updateSliderPosition();
    }

    function slidePrev() {
      currentRevIndex =
        currentRevIndex > 0 ? currentRevIndex - 1 : getMaxIndex();
      updateSliderPosition();
    }

    function startAutoPlay() {
      if (autoPlayTimer === null)
        autoPlayTimer = setInterval(slideNext, slideDuration);
    }

    function stopAutoPlay() {
      if (autoPlayTimer !== null) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    nextRevBtn.addEventListener("click", () => {
      stopAutoPlay();
      slideNext();
      startAutoPlay();
    });
    prevRevBtn.addEventListener("click", () => {
      stopAutoPlay();
      slidePrev();
      startAutoPlay();
    });
    reviewsSection.addEventListener("mouseenter", stopAutoPlay);
    reviewsSection.addEventListener("mouseleave", startAutoPlay);

    window.addEventListener("resize", updateSliderPosition);
    startAutoPlay();
  }

  /* ==========================================================================
       9. SMOOTH SCROLL & REVEAL OBSERVERS
       ========================================================================== */
  const animatedElements = document.querySelectorAll(
    ".fade-in-up, .smooth-reveal, .package-card, .why-card, .about-content, .about-img-holder, .info-card, .social-card, .team-card",
  );

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible", "is-visible", "is-loaded");
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
  );

  animatedElements.forEach((el) => {
    el.classList.add("smooth-reveal");
    revealObserver.observe(el);
  });

  // Specifically observe the Legacy Adventure Section & Reviews Section
  const targetSection = document.getElementById("legacy-adventure-section");
  if (targetSection) revealObserver.observe(targetSection);
  if (reviewsSection) revealObserver.observe(reviewsSection);

  /* ==========================================================================
       10. NUMBER COUNTERS (.counter & .mh-stat-number)
       ========================================================================== */
  const runCounter = (element, isFormatted = false) => {
    const targetValue = +element.getAttribute("data-target");
    const animationSpeed = isFormatted ? 50 : 200;

    const updateCount = () => {
      const currentVal = isFormatted
        ? +element.innerText.replace(/[^0-9]/g, "")
        : +element.innerText;
      const increment = isFormatted
        ? Math.ceil(targetValue / animationSpeed)
        : targetValue / animationSpeed;

      if (currentVal < targetValue) {
        const nextVal =
          currentVal + increment > targetValue
            ? targetValue
            : currentVal + increment;

        if (isFormatted) {
          let formatted = Math.ceil(nextVal).toLocaleString("en-IN");
          if (targetValue !== 41) formatted += "+"; // Append "+" exception
          element.innerText = formatted;
          setTimeout(updateCount, 30);
        } else {
          element.innerText = Math.ceil(nextVal);
          setTimeout(updateCount, 10);
        }
      } else {
        if (isFormatted) {
          let finalFormatted = targetValue.toLocaleString("en-IN");
          element.innerText =
            targetValue === 41 ? finalFormatted : finalFormatted + "+";
        } else {
          element.innerText = targetValue;
        }
      }
    };
    updateCount();
  };

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const isFormatted = counter.classList.contains("mh-stat-number");

          if (isFormatted)
            counter.closest("section")?.classList.add("mh-reveal-active");

          runCounter(counter, isFormatted);
          observer.unobserve(counter);
        }
      });
    },
    { root: null, threshold: 0.5, rootMargin: "0px" },
  );

  document
    .querySelectorAll(".counter, .mh-stat-number")
    .forEach((c) => counterObserver.observe(c));

  /* ==========================================================================
       11. POPUPS: TRAVEL LEAD & DREAM TRIP PLANNER
       ========================================================================== */
  // Travel Popup (Delayed Load)
  const travelPopup = document.getElementById("travel-popup-overlay");
  const travelCloseBtn = document.getElementById("close-travel-popup");
  const travelForm = document.getElementById("travel-lead-form");

  if (travelPopup) {
    // 800 milliseconds = exactly 0.8 seconds delay
    setTimeout(() => travelPopup.classList.add("is-visible"), 800);

    const closeTravelPopup = () => travelPopup.classList.remove("is-visible");
    travelCloseBtn?.addEventListener("click", closeTravelPopup);
    travelPopup.addEventListener("click", (e) => {
      if (e.target === travelPopup) closeTravelPopup();
    });

    travelForm?.addEventListener("submit", function (e) {
      e.preventDefault();
      const formContainer = document.querySelector(".travel-popup-form-side");
      1;
      formContainer.style.opacity = "0";
      formContainer.style.transition = "opacity 0.3s ease";

      setTimeout(() => {
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
      setTimeout(closeTravelPopup, 2800);
    });
  }

  // Dream Trip Popup
  const dreamTriggerBtn = document.getElementById("dream-trip-trigger-btn");
  const dreamPopup = document.getElementById("dream-trip-popup-overlay");
  const dreamCloseBtn = document.getElementById("close-dream-modal");
  const dreamForm = document.getElementById("dream-trip-planner-form");

  if (dreamPopup && dreamTriggerBtn) {
    const closeDreamModal = () => {
      dreamPopup.classList.remove("is-active");
      dreamTriggerBtn.style.visibility = "visible";
    };

    dreamTriggerBtn.addEventListener("click", () => {
      dreamPopup.classList.add("is-active");
      dreamTriggerBtn.style.visibility = "hidden";
    });

    dreamCloseBtn?.addEventListener("click", closeDreamModal);
    dreamPopup.addEventListener("click", (e) => {
      if (e.target === dreamPopup) closeDreamModal();
    });

    dreamForm?.addEventListener("submit", function (e) {
      e.preventDefault();
      const contentBox = document.querySelector(".dream-modal-form-side");
      contentBox.style.opacity = "0";
      contentBox.style.transition = "opacity 0.3s ease";

      setTimeout(() => {
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
      setTimeout(closeDreamModal, 3000);
    });
  }

  /* ==========================================================================
       12. SECURE ENQUIRY FORM VALIDATION & EMAILJS DELIVERY
       ========================================================================== */
  const mainEnquiryForm = document.getElementById("enquiryForm");

  if (mainEnquiryForm) {
    if (typeof emailjs !== "undefined") emailjs.init("dv48oFXMnICc_HhMk");

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
});

document.addEventListener("DOMContentLoaded", () => {
  const floatingBtn = document.getElementById("floating-dream-btn");
  const overlay = document.getElementById("dream-trip-popup-overlay");
  const closeBtn = document.getElementById("close-dream-modal");

  // 1. Open Modal when floating button is clicked
  floatingBtn.addEventListener("click", () => {
    overlay.classList.add("is-active");
  });

  // 2. Close Modal when the "X" button is clicked
  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("is-active");
  });

  // 3. Optional: Close Modal when clicking outside of the popup content
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("is-active");
    }
  });
});

/////// Code for Packages Tabing --

document.addEventListener("DOMContentLoaded", () => {
  const floatingBtn = document.getElementById("floating-dream-btn");
  const overlay = document.getElementById("dream-trip-popup-overlay");
  const closeBtn = document.getElementById("close-dream-modal");

  // Only attach listeners if the elements actually exist on the current page
  if (floatingBtn && overlay) {
    floatingBtn.addEventListener("click", () => {
      overlay.classList.add("is-active");
    });
  }

  if (closeBtn && overlay) {
    closeBtn.addEventListener("click", () => {
      overlay.classList.remove("is-active");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("is-active");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // 1. Select all destination tabs and their corresponding panels
  const tabs = document.querySelectorAll(".dest-tab");
  const panels = document.querySelectorAll(".destination-panel");

  // Safety check: Only run if these elements actually exist on the page
  if (tabs.length === 0 || panels.length === 0) return;

  // 2. Attach a click listener to each tab
  tabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent any default button or link behavior

      // 3. Remove the 'active' class from ALL tabs and ALL panels
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));

      // 4. Add the 'active' class to the exact tab that was just clicked
      this.classList.add("active");

      // 5. Find the target ID from the clicked tab's data attribute
      const targetId = this.getAttribute("data-target");
      const targetPanel = document.getElementById(targetId);

      // 6. If the matching panel exists, make it active so it displays
      if (targetPanel) {
        targetPanel.classList.add("active");
      } else {
        console.warn(
          `Tab target missing: Panel with ID '${targetId}' was not found.`,
        );
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // 1. Select the packages and the button
  const cards = document.querySelectorAll(".flyer-card-container");
  const loadMoreBtn = document.getElementById("btnLoadPackage");

  // 2. Set your configuration
  let itemsToShow = 6; // Number of packages visible on initial load
  const itemsToLoad = 3; // Number of packages to reveal per click

  // 3. Initially hide extra packages
  cards.forEach((card, index) => {
    if (index >= itemsToShow) {
      card.classList.add("hidden-package");
    }
  });

  // 4. If there are 6 or fewer packages total, hide the "Load More" button immediately
  if (cards.length <= itemsToShow) {
    if (loadMoreBtn) loadMoreBtn.style.display = "none";
  }

  // 5. Handle the button click
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      // Find all packages that are currently hidden
      let currentlyHidden = document.querySelectorAll(
        ".flyer-card-container.hidden-package",
      );

      // Reveal the next batch
      for (let i = 0; i < itemsToLoad; i++) {
        if (currentlyHidden[i]) {
          currentlyHidden[i].classList.remove("hidden-package");
        }
      }

      // Check if there are any hidden packages left after this click
      currentlyHidden = document.querySelectorAll(
        ".flyer-card-container.hidden-package",
      );
      if (currentlyHidden.length === 0) {
        // If no more hidden items, hide the button
        loadMoreBtn.style.display = "none";
      }
    });
  }
});

//// Destination Page code ----

document.addEventListener("DOMContentLoaded", function () {
  const viewMoreBtn = document.getElementById("viewMoreBtn");
  const hiddenCards = document.querySelectorAll(".hidden-card");
  const btnText = viewMoreBtn.querySelector("span");
  const btnIcon = document.getElementById("viewMoreIcon");

  let isExpanded = false;

  viewMoreBtn.addEventListener("click", function () {
    isExpanded = !isExpanded;

    hiddenCards.forEach((card) => {
      if (isExpanded) {
        card.style.display = "flex"; // Use flex to maintain card internal layout
      } else {
        card.style.display = "none";
      }
    });

    if (isExpanded) {
      btnText.textContent = "View less";
      btnIcon.style.transform = "rotate(180deg)"; // Flips the chevron arrow up
    } else {
      btnText.textContent = "View more";
      btnIcon.style.transform = "rotate(0deg)"; // Flips it back down
    }
  });
});

// Delays the pop-up display by 6 seconds (6000 milliseconds)
window.addEventListener("load", () => {
  setTimeout(() => {
    const bookingModal = document.getElementById("dream-escape-modal");
    if (bookingModal) {
      bookingModal.style.display = "block"; // Or add a CSS class to trigger a fade-in
    }
  }, 6000);
});

/* --- JAVASCRIPT --- for Mobile View Menu bar */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const backdrop = document.querySelector(".body-backdrop");
  const body = document.body;

  // Only run mobile script logic if elements exist
  if (menuToggle && mobileNav && backdrop) {
    function toggleMenu() {
      // Check if we are currently in mobile view
      if (window.innerWidth <= 992) {
        menuToggle.classList.toggle("is-active");
        mobileNav.classList.toggle("is-open");
        backdrop.classList.toggle("is-visible");

        if (mobileNav.classList.contains("is-open")) {
          body.style.overflow = "hidden";
        } else {
          body.style.overflow = "";
        }
      }
    }

    menuToggle.addEventListener("click", toggleMenu);
    backdrop.addEventListener("click", toggleMenu);

    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (mobileNav.classList.contains("is-open")) {
          toggleMenu();
        }
      });
    });

    // Reset state if window is resized to desktop while menu is open
    window.addEventListener("resize", () => {
      if (window.innerWidth > 992 && mobileNav.classList.contains("is-open")) {
        menuToggle.classList.remove("is-active");
        mobileNav.classList.remove("is-open");
        backdrop.classList.remove("is-visible");
        body.style.overflow = "";
      }
    });
  }
});



/// Thailand Page Code ------------>
function openTab(evt, categoryName) {
  // Get all elements with class="tab-content" and hide them
  const tabContent = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
    tabContent[i].classList.remove("active");
  }

  // Get all elements with class="tab-btn" and remove the class "active"
  const tabLinks = document.getElementsByClassName("tab-btn");
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].classList.remove("active");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  const activeTab = document.getElementById(categoryName);
  activeTab.style.display = "block";
  activeTab.classList.add("active");
  evt.currentTarget.classList.add("active");
}

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});









