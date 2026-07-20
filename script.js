/*
================================================================
    ADHIRATHA FAMILY RESTAURANT (A/C) - INTERACTIVE SCRIPT
================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI features
    initStickyHeader();
    initMobileMenu();
    initSmoothScrolling();
    initActiveNavHighlighting();
    initScrollReveal();
    initStatsCounter();
    initMenuFilter();
    initTestimonialSlider();
    initBookingFormValidation();
    initBackToTop();
});

/* --------------------------------------------------
   1. STICKY HEADER
-------------------------------------------------- */
function initStickyHeader() {
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* --------------------------------------------------
   2. MOBILE SLIDE-OUT MENU
-------------------------------------------------- */
function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const closeBtn = document.querySelector('.mobile-menu-close');
    const menu = document.querySelector('.mobile-nav-menu');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function openMenu() {
        menu.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeMenu() {
        menu.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = 'auto'; // Restore background scrolling
    }

    toggleBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

/* --------------------------------------------------
   3. SMOOTH SCROLLING (With offset adjustment)
-------------------------------------------------- */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    const header = document.querySelector('.main-header');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty links or links that don't match elements
            if (href === '#' || !href.startsWith('#')) return;

            const targetElement = document.querySelector(href);
            if (!targetElement) return;

            e.preventDefault();

            // Calculate offset based on navbar height
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = targetPosition - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* --------------------------------------------------
   4. ACTIVE NAV LINK HIGHLIGHTING ON SCROLL
-------------------------------------------------- */
function initActiveNavHighlighting() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    const header = document.querySelector('.main-header');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + header.offsetHeight + 100; // Offset window scroll

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Toggle active class on nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* --------------------------------------------------
   5. SCROLL REVEAL ANIMATIONS (Intersection Observer)
-------------------------------------------------- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const observerOptions = {
        root: null,
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

/* --------------------------------------------------
   6. STATS COUNTER ANIMATION
-------------------------------------------------- */
function initStatsCounter() {
    const counters = document.querySelectorAll('.counter');
    
    const counterObserverOptions = {
        root: null,
        threshold: 0.5
    };

    const countUp = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const count = parseInt(counter.innerText, 10);
        
        // Speed scaling based on target size
        const increment = Math.ceil(target / 80); 
        const speed = Math.max(15, Math.min(60, 2000 / (target / increment)));

        if (count < target) {
            counter.innerText = Math.min(count + increment, target);
            setTimeout(() => countUp(counter), speed);
        } else {
            counter.innerText = target;
        }
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, counterObserverOptions);

    counters.forEach(counter => {
        counter.innerText = '0'; // Set default value
        counterObserver.observe(counter);
    });
}

/* --------------------------------------------------
   7. MENU CATEGORY FILTER
-------------------------------------------------- */
function initMenuFilter() {
    const filterButtons = document.querySelectorAll('.tab-btn');
    const menuItems = document.querySelectorAll('.menu-item-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active classes on tab buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            menuItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                // Hide with animations or show
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.classList.remove('hide');
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });
}

/* --------------------------------------------------
   8. TESTIMONIAL SLIDER
-------------------------------------------------- */
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        // Reset current slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Validate index boundaries
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Controls listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    // Dots listeners
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'), 10);
            showSlide(index);
            resetAutoSlide();
        });
    });

    // Auto-slide trigger
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000); // Shift every 5s
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Initialize slide and auto run
    showSlide(currentSlide);
    startAutoSlide();

    // Pause auto slide on hover
    const sliderContainer = document.querySelector('.slider-wrapper');
    sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
}

/* --------------------------------------------------
   9. BOOKING FORM VALIDATION & SUCCESS MODAL
-------------------------------------------------- */
function initBookingFormValidation() {
    const form = document.getElementById('tableBookingForm');
    const modal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    // Set minimum date picker values to Today's date
    const dateInput = document.getElementById('bookingDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Helper functions for validating fields
    function setError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorSpan = formGroup.querySelector('.error-msg');
        formGroup.classList.add('invalid');
        errorSpan.innerText = message;
    }

    function clearError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('invalid');
    }

    function validateName(input) {
        const value = input.value.trim();
        if (value === '') {
            setError(input, 'Name is required.');
            return false;
        } else if (value.length < 3) {
            setError(input, 'Name must be at least 3 letters.');
            return false;
        }
        clearError(input);
        return true;
    }

    function validatePhone(input) {
        const value = input.value.trim();
        // Indian phone numbers match regex: starts with 6-9 followed by 9 digits
        const phoneRegex = /^[6-9]\d{9}$/;
        if (value === '') {
            setError(input, 'Mobile number is required.');
            return false;
        } else if (!phoneRegex.test(value)) {
            setError(input, 'Enter a valid 10-digit mobile number.');
            return false;
        }
        clearError(input);
        return true;
    }

    function validateGuests(input) {
        const value = parseInt(input.value, 10);
        if (isNaN(value) || value < 1) {
            setError(input, 'Guests count must be at least 1.');
            return false;
        } else if (value > 25) {
            setError(input, 'Max online reservation is 25 guests.');
            return false;
        }
        clearError(input);
        return true;
    }

    function validateDate(input) {
        const value = input.value;
        if (value === '') {
            setError(input, 'Date selection is required.');
            return false;
        }
        
        const selectedDate = new Date(value);
        const currentDate = new Date();
        // Set times to midnight to only compare dates
        selectedDate.setHours(0,0,0,0);
        currentDate.setHours(0,0,0,0);

        if (selectedDate < currentDate) {
            setError(input, 'Please choose today or a future date.');
            return false;
        }
        clearError(input);
        return true;
    }

    function validateTime(input) {
        const value = input.value;
        if (value === '') {
            setError(input, 'Time selection is required.');
            return false;
        }

        const [hours, minutes] = value.split(':').map(Number);
        
        // Allowed dining hours: 11:00 AM (11:00) to 10:00 PM (22:00)
        if (hours < 11 || hours > 22 || (hours === 22 && minutes > 0)) {
            setError(input, 'Reservation is open between 11:00 AM - 10:00 PM.');
            return false;
        }
        clearError(input);
        return true;
    }

    // Live validation triggers on input changes
    form.querySelector('#bookingName').addEventListener('input', function() { validateName(this); });
    form.querySelector('#bookingPhone').addEventListener('input', function() { validatePhone(this); });
    form.querySelector('#bookingGuests').addEventListener('input', function() { validateGuests(this); });
    form.querySelector('#bookingDate').addEventListener('change', function() { validateDate(this); });
    form.querySelector('#bookingTime').addEventListener('change', function() { validateTime(this); });

    // Submit listener
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = form.querySelector('#bookingName');
        const phoneInput = form.querySelector('#bookingPhone');
        const guestsInput = form.querySelector('#bookingGuests');
        const dateInput = form.querySelector('#bookingDate');
        const timeInput = form.querySelector('#bookingTime');

        const isNameValid = validateName(nameInput);
        const isPhoneValid = validatePhone(phoneInput);
        const isGuestsValid = validateGuests(guestsInput);
        const isDateValid = validateDate(dateInput);
        const isTimeValid = validateTime(timeInput);

        if (isNameValid && isPhoneValid && isGuestsValid && isDateValid && isTimeValid) {
            // Form is fully validated!
            // Format Date for humans (e.g. DD-MM-YYYY)
            const dateParts = dateInput.value.split('-');
            const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            
            // Format Time (12-hour AM/PM format)
            let timeVal = timeInput.value;
            const [hours, minutes] = timeVal.split(':').map(Number);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            const formattedTime = `${displayHours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

            // Populate Success Modal text fields
            document.getElementById('modalCustomerName').innerText = nameInput.value.trim();
            document.getElementById('modalGuests').innerText = guestsInput.value;
            document.getElementById('modalDate').innerText = formattedDate;
            document.getElementById('modalTime').innerText = formattedTime;
            document.getElementById('modalPhone').innerText = phoneInput.value.trim();

            // Display success modal
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';

            // Reset the form values
            form.reset();
            // Re-apply tomorrow limit after form reset
            dateInput.setAttribute('min', today);
        }
    });

    // Close success popup modal triggers
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
    });
}

/* --------------------------------------------------
   10. BACK TO TOP BUTTON
-------------------------------------------------- */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
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
