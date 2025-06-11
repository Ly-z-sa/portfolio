document.addEventListener('DOMContentLoaded', () => {
    // Animate footer on scroll into view
    const footer = document.getElementById('site-footer');
    if (footer) {
        setTimeout(() => {
            footer.classList.remove('opacity-0', 'translate-y-6');
            footer.classList.add('opacity-100', 'translate-y-0');
        }, 300);
    }

    /* Magic Line underline animation for navbar */
    const nav = document.querySelector('nav');
    const magicLine = document.getElementById('magic-line');
    const navLinksArr = Array.from(document.querySelectorAll('.nav-link'));

    function moveMagicLineTo(link) {
        if (!link || !nav || !magicLine) return; // Add null checks for robustness
        const navRect = nav.getBoundingClientRect();
        const textSpan = link.querySelector('.magic-text') || link;
        const textRect = textSpan.getBoundingClientRect();
        const left = textRect.left - navRect.left;
        const width = textRect.width;

        // Animate left first, then width for smoother effect
        magicLine.style.transition = 'left 0.25s cubic-bezier(.4,0,.2,1)';
        magicLine.style.left = `${left}px`;

        setTimeout(() => {
            magicLine.style.transition = 'width 0.25s cubic-bezier(.4,0,.2,1)';
            magicLine.style.width = `${width}px`;
        }, 120); // Adjust delay for best feel
    }

    function updateMagicLine() {
        const active = document.querySelector('.nav-link.active-nav');
        moveMagicLineTo(active);
    }

    // Move on click (let ScrollSpy handle .active-nav)
    navLinksArr.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(updateMagicLine, 10); // Wait for ScrollSpy to update .active-nav
        });
    });

    // Toggle mobile menu and icons
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('icon-hamburger');
    const closeIcon = document.getElementById('icon-close');

    if (mobileMenuButton && mobileMenu && hamburgerIcon && closeIcon) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            hamburgerIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });

        // Close menu when a link is clicked
        const mobileMenuLinks = mobileMenu.getElementsByTagName('a');
        for (let link of mobileMenuLinks) {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                hamburgerIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            });
        }
    }

    // Show contact form on button click
    const showContactBtn = document.getElementById('show-contact-form');
    const contactFormContainer = document.getElementById('contact-form-container');

    if (showContactBtn && contactFormContainer) {
        showContactBtn.addEventListener('click', () => {
            contactFormContainer.classList.remove('hidden');
            showContactBtn.classList.add('hidden');
        });
    }

    // Handle Formspree AJAX submission and show success message
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = new FormData(contactForm);
            const action = contactForm.getAttribute('action');
            try {
                const response = await fetch(action, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                if (response.ok) {
                    contactForm.reset();
                    if (contactFormContainer) contactFormContainer.classList.add('hidden');
                    if (formSuccess) formSuccess.classList.remove('hidden');
                } else {
                    alert('Oops! There was a problem submitting your form.');
                }
            } catch (error) {
                alert('Oops! There was a problem submitting your form.');
            }
        });
    }

    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 60
    });

    // ScrollSpy for navigation
    const sections = ['home', 'about', 'academics', 'projects', 'volunteering', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link');

    function onScroll() {
        let scrollPos = window.scrollY + 120; // adjust offset for fixed header
        let current = '';
        for (let id of sections) {
            const section = document.getElementById(id);
            // Check if section exists and is in view
            if (section && section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
                current = id;
            }
        }
        navLinks.forEach(link => {
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active-nav');
            } else {
                link.classList.remove('active-nav');
            }
        });
        updateMagicLine(); // Call magic line update after active class is set
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', onScroll);
    
    // Ensure initial state is set correctly on load and resize
    window.addEventListener('load', () => {
        onScroll(); // Set active class and magic line on initial load
    });
    window.addEventListener('resize', updateMagicLine); // Only update magic line on resize

    // Prevent right-click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
});
