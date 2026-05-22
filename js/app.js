/**
 * Malee Hospitality - Unified Application Interface Module
 * Handles Global Dark Mode Framework, Dropdowns, Sorting Sorters, Dynamic Accordions,
 * Form Security Filters, EmailJS integration, and Lightbox Photo Galleries.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. PERSISTENT GLOBAL THEME LOGIC CONTROLLER
       ========================================================================== */
    const themeToggleBtn = document.getElementById('themeToggle');
    
    if (themeToggleBtn) {
        const toggleIcon = themeToggleBtn.querySelector('.toggle-icon');
        
        // Evaluate user environmental configurations or cache values
        const currentSavedTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Match initial view state elements
        if (currentSavedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (toggleIcon) toggleIcon.textContent = '☀️';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            if (toggleIcon) toggleIcon.textContent = '🌙';
        }

        themeToggleBtn.addEventListener('click', () => {
            const currentActiveState = document.documentElement.getAttribute('data-theme');
            
            if (currentActiveState === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                toggleIcon.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                toggleIcon.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    /* ==========================================================================
       2. INTERACTIVE NAVIGATION DROPDOWN ENGINE
       ========================================================================== */
    const dropdownContainers = document.querySelectorAll('.dropdown');

    dropdownContainers.forEach(dropdown => {
        const toggleButton = dropdown.querySelector('.dropdown-toggle');

        if (toggleButton) {
            toggleButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                
                const isOpen = dropdown.classList.contains('open');

                // Strip open tags from sibling dropdown containers
                dropdownContainers.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('open');
                        const activeBtn = otherDropdown.querySelector('.dropdown-toggle');
                        if (activeBtn) activeBtn.setAttribute('aria-expanded', 'false');
                    }
                });

                if (isOpen) {
                    dropdown.classList.remove('open');
                    toggleButton.setAttribute('aria-expanded', 'false');
                } else {
                    dropdown.classList.add('open');
                    toggleButton.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });

    // Close open menus automatically upon external view mutations
    document.addEventListener('click', () => {
        dropdownContainers.forEach(dropdown => {
            dropdown.classList.remove('open');
            const toggleButton = dropdown.querySelector('.dropdown-toggle');
            if (toggleButton) toggleButton.setAttribute('aria-expanded', 'false');
        });
    });

    /* ==========================================================================
       3. CLIENT-SIDE SERVICE CATALOG FILTER SORTER
       ========================================================================== */
    const filterPills = document.querySelectorAll('.pill');
    const catalogCards = document.querySelectorAll('.package-card');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const targetCategory = pill.getAttribute('data-filter');

            catalogCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (targetCategory === 'all' || cardCategory === targetCategory) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* ==========================================================================
       4. CLIENT FAQ DYNAMIC HEIGHT ACCORDION LAYOUT
       ========================================================================== */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            const currentPanel = currentItem.querySelector('.accordion-panel');
            const isActive = currentItem.classList.contains('active');

            // Collapse all structural panels down to zero layout bounds
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
                const headNode = item.querySelector('.accordion-header');
                const panelNode = item.querySelector('.accordion-panel');
                if (headNode) headNode.setAttribute('aria-expanded', 'false');
                if (panelNode) panelNode.style.maxHeight = null;
            });

            // Calculate exact bounding height variables and apply dynamically
            if (!isActive && currentPanel) {
                currentItem.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                currentPanel.style.maxHeight = currentPanel.scrollHeight + "px";
            }
        });
    });

    /* ==========================================================================
       5. SECURE ENQUIRY FORM VALIDATION & EMAILJS DELIVERY FILTER
       ========================================================================= */
    const mainEnquiryForm = document.getElementById('enquiryForm');

    if (mainEnquiryForm) {
        if (typeof emailjs !== 'undefined') {
            emailjs.init("dv48oFXMnICc_HhMk");
        }

        mainEnquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();

            let isFormValid = true;
            const requiredInputs = mainEnquiryForm.querySelectorAll('input[required], select[required]');

            requiredInputs.forEach(element => {
                element.style.borderColor = ""; 

                if (!element.value.trim() || (element.tagName === 'SELECT' && element.value === "")) {
                    isFormValid = false;
                    element.style.borderColor = "#E53E3E";
                }
                
                if (element.type === 'email' && element.value) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(element.value.trim())) {
                        isFormValid = false;
                        element.style.borderColor = "#E53E3E";
                    }
                }
            });

            if (!isFormValid) {
                alert('Please fill out all highlighted fields correctly.');
                return;
            }

            const submitBtn = mainEnquiryForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Enquiry 🚀';
            
            if (submitBtn) {
                submitBtn.innerHTML = 'Sending...';
                submitBtn.disabled = true;
            }

            if (typeof emailjs !== 'undefined') {
                emailjs.sendForm('service_lfn3pid', 'template_dvo7dzp', this)
                .then(() => {
                    alert('Enquiry sent successfully!');
                    mainEnquiryForm.reset();
                })
                .catch((error) => {
                    console.error(error);
                    alert('Failed to send enquiry.');
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                    }
                });
            } else {
                alert('Email transmission engine unavailable.');
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
    const loadMoreBtn = document.getElementById('btnLoadMore');
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    const allGalleryItems = document.querySelectorAll('.gallery-item');
    
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxActiveImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    const itemsPerBatch = 4; 
    const INITIAL_VISIBLE_COUNT = 12;
    let visibleCount = INITIAL_VISIBLE_COUNT;
    let currentActiveFilter = 'all';
    let dynamicActiveList = [];
    let currentImageIndex = 0;

    const updateGalleryLayoutState = () => {
        let matchCount = 0;

        allGalleryItems.forEach(item => {
            const itemLocation = item.getAttribute('data-location');
            const matchesFilter = (currentActiveFilter === 'all' || itemLocation === currentActiveFilter);

            if (matchesFilter) {
                matchCount++;
                if (matchCount <= visibleCount) {
                    item.classList.remove('hidden-batch');
                } else {
                    item.classList.add('hidden-batch');
                }
            } else {
                item.classList.add('hidden-batch');
            }
        });

        // Determine total items matching the filter
        const totalMatchingAvailable = Array.from(allGalleryItems).filter(item => {
            const loc = item.getAttribute('data-location');
            return currentActiveFilter === 'all' || loc === currentActiveFilter;
        }).length;

        // FIXED: Safely hide button container or element via CSS utility priority class overrides
        if (loadMoreBtn) {
            const buttonWrapper = loadMoreBtn.parentElement;
            if (visibleCount >= totalMatchingAvailable) {
                loadMoreBtn.classList.add('force-hide-element');
                if (buttonWrapper && buttonWrapper.classList.contains('load-more-container')) {
                    buttonWrapper.classList.add('force-hide-element');
                }
            } else {
                loadMoreBtn.classList.remove('force-hide-element');
                if (buttonWrapper && buttonWrapper.classList.contains('load-more-container')) {
                    buttonWrapper.classList.remove('force-hide-element');
                }
            }
        }
    };

    // Tab interaction triggers mapping logic patterns
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.currentTarget.classList.add('active');

            currentActiveFilter = e.currentTarget.getAttribute('data-tag');
            visibleCount = INITIAL_VISIBLE_COUNT; 
            updateGalleryLayoutState();
        });
    });

    // Pagination interactive bindings
    loadMoreBtn?.addEventListener('click', () => {
        visibleCount += itemsPerBatch;
        updateGalleryLayoutState();
    });

    // Lightbox Context Cache Builders
    function buildActiveArray() {
        dynamicActiveList = Array.from(allGalleryItems).filter(item => !item.classList.contains('hidden-batch'));
    }

    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid && lightbox && lightboxImg) {
        galleryGrid.addEventListener('click', (e) => {
            const clickedItem = e.target.closest('.gallery-item');
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
        const targetImg = item.querySelector('img');
        const targetSpan = item.querySelector('.item-overlay span');

        if (targetImg) lightboxImg.src = targetImg.src;
        if (lightboxCaption && targetSpan) lightboxCaption.textContent = targetSpan.textContent;
        
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        if (dynamicActiveList.length === 0) return;
        currentImageIndex += direction;
        
        if (currentImageIndex >= dynamicActiveList.length) currentImageIndex = 0;
        if (currentImageIndex < 0) currentImageIndex = dynamicActiveList.length - 1;
        
        openLightboxElement(dynamicActiveList[currentImageIndex]);
    }

    // Attach Lightbox Navigation Control Triggers
    const closeBtn = document.getElementById('lightboxClose');
    const nextBtn = document.getElementById('lightboxNext');
    const prevBtn = document.getElementById('lightboxPrev');

    closeBtn?.addEventListener('click', closeLightbox);
    nextBtn?.addEventListener('click', () => navigateLightbox(1));
    prevBtn?.addEventListener('click', () => navigateLightbox(-1));
    
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navigateLightbox(1);
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
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
        if(dots[index]) dots[index].classList.add("active");
      } else {
        slide.classList.remove("active");
        if(dots[index]) dots[index].classList.remove("active");
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
  if(nextBtn && prevBtn) {
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

  destTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // 1. Remove active state from all capsule indicators
      destTabs.forEach(t => t.classList.remove("active"));
      
      // 2. Hide all country destination layout panels
      destPanels.forEach(p => p.classList.remove("active"));

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

  destTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // 1. Clear active configuration flags from pill triggers
      destTabs.forEach(t => t.classList.remove("active"));
      
      // 2. Hide active flyer view segments
      destPanels.forEach(p => p.classList.remove("active"));

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

  destTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // 1. Clear active flags from tab options
      destTabs.forEach(t => t.classList.remove("active"));
      
      // 2. Hide active display sheet sets
      destPanels.forEach(p => p.classList.remove("active"));

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

  destTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // 1. Terminate styling flags across tab controllers
      destTabs.forEach(t => t.classList.remove("active"));
      
      // 2. Hide all layout grids safely from viewport render
      destPanels.forEach(p => p.classList.remove("active"));

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
  const tabTriggers = document.querySelectorAll(".destination-tabs-container .dest-tab");
  const panelSheets = document.querySelectorAll(".panels-grid-wrapper .destination-panel");

  if (!tabTriggers.length || !panelSheets.length) {
    console.warn("Malee Packages Engine Notice: Filter items missing from target viewport structural frames.");
    return;
  }

  tabTriggers.forEach(trigger => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();

      // 1. Terminate highlighted active markers across trigger keys
      tabTriggers.forEach(btn => btn.classList.remove("active"));
      
      // 2. Clear out visibility flags across all display panels completely
      panelSheets.forEach(panel => panel.classList.remove("active"));

      // 3. Mark the current click item action state as active view profile
      trigger.classList.add("active");

      // 4. Retrieve key token identifier context
      const targetedDataId = trigger.getAttribute("data-target");
      const activePanelElement = document.getElementById(targetedDataId);

      if (activePanelElement) {
        activePanelElement.classList.add("active");
      } else {
        console.error(`Malee Core Error: Target configuration sheet "${targetedDataId}" can not be found inside the DOM framework.`);
      }
    });
  });
});