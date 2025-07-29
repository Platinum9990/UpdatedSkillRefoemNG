document.addEventListener('DOMContentLoaded', function() {
    
    // --- UNIVERSAL INITIALIZATIONS ---
    AOS.init({ once: true, duration: 800 });
    
    // --- HOMEPAGE-SPECIFIC LOGIC ---

    // Initialize Vanta.js only if the hero section exists
    const heroSection = document.getElementById('hero');
    if (heroSection && typeof VANTA !== 'undefined') {
        VANTA.NET({
            el: "#hero",
            mouseControls: true, touchControls: true, gyroControls: false,
            minHeight: 200.00, minWidth: 200.00,
            scale: 1.00, scaleMobile: 1.00,
            color: 0x60a5fa, backgroundColor: 0x172554,
            points: 12.00, maxDistance: 25.00, spacing: 18.00
        });
    }

    // Initialize Vanilla Tilt if any tilt cards exist on the page
    if (typeof VanillaTilt !== 'undefined' && document.querySelector('[data-tilt]')) {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 15, speed: 400, glare: true, "max-glare": 0.5
        });
    }

    // "View More" button logic for the homepage trainings section
    const viewMoreBtn = document.getElementById('view-more-btn');
    if (viewMoreBtn) {
        const hiddenCards = document.querySelectorAll('.training-card.hidden');
        viewMoreBtn.addEventListener('click', () => {
            hiddenCards.forEach(card => {
                card.classList.remove('hidden');
                card.classList.add('flex');
            });
            AOS.refreshHard();
            viewMoreBtn.style.display = 'none';
        });
    }

    // "View Requirements" toggle logic for the homepage training cards
    const reqsToggleButtons = document.querySelectorAll('.reqs-toggle-btn');
    reqsToggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const cardBody = button.closest('.p-6');
            if (!cardBody) return;
            const content = cardBody.querySelector('.reqs-content');
            if (!content) return;
            
            if (content.style.maxHeight) {
                button.textContent = 'View Requirements';
                content.style.maxHeight = null;
            } else {
                button.textContent = 'Hide Requirements';
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // --- CONTACT PAGE-SPECIFIC LOGIC ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you shortly.');
            this.reset();
        });
    }

    // --- PLANS PAGE-SPECIFIC LOGIC ---
    const tabTrainers = document.getElementById('tab-trainers');
    if (tabTrainers) {
        const tabOrgs = document.getElementById('tab-orgs');
        const plansTrainers = document.getElementById('plans-trainers');
        const plansOrgs = document.getElementById('plans-orgs');

        tabTrainers.addEventListener('click', () => {
            tabTrainers.classList.add('active');
            tabOrgs.classList.remove('active');
            plansTrainers.classList.remove('hidden');
            plansOrgs.classList.add('hidden');
        });

        tabOrgs.addEventListener('click', () => {
            tabOrgs.classList.add('active');
            tabTrainers.classList.remove('active');
            plansOrgs.classList.remove('hidden');
            plansTrainers.classList.add('hidden');
        });
    }
    
    // --- FIND TRAININGS PAGE-SPECIFIC LOGIC ---
    const trainingGrid = document.getElementById('training-grid');
    if (trainingGrid) {
        // --- FILTER BUTTONS LOGIC ---
        const categoryBtns = document.querySelectorAll('#category-filters .filter-btn');
        const costBtns = document.querySelectorAll('#cost-filters .filter-btn');
        let selectedCategory = 'All';
        let selectedCost = 'All';

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                categoryBtns.forEach(b => b.classList.remove('active', 'bg-primary-100', 'text-primary-700', 'dark:bg-primary-800', 'dark:text-primary-300'));
                this.classList.add('active', 'bg-primary-100', 'text-primary-700', 'dark:bg-primary-800', 'dark:text-primary-300');
                selectedCategory = this.textContent.trim();
                filterTrainings();
            });
        });

        costBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                costBtns.forEach(b => b.classList.remove('active', 'bg-primary-100', 'text-primary-700', 'dark:bg-primary-800', 'dark:text-primary-300'));
                this.classList.add('active', 'bg-primary-100', 'text-primary-700', 'dark:bg-primary-800', 'dark:text-primary-300');
                selectedCost = this.textContent.trim();
                filterTrainings();
            });
        });

        // --- SEARCH FORM LOGIC ---
        const searchForm = document.getElementById('search-form');
        const searchInput = document.getElementById('search-input');
        const dateInput = document.getElementById('date-range');

        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            filterTrainings();
        });

        dateInput.addEventListener('change', filterTrainings);

        // --- FILTER FUNCTION ---
        function filterTrainings() {
            const searchTerm = searchInput.value.trim().toLowerCase();
            const selectedDate = dateInput.value;
            const cards = document.querySelectorAll('.training-card');
            let anyVisible = false;

            cards.forEach(card => {
                let show = true;

                // CATEGORY (precise: use data-category attribute)
                if (selectedCategory !== 'All') {
                    const cardCategory = card.getAttribute('data-category');
                    show = show && cardCategory && cardCategory.toLowerCase() === selectedCategory.toLowerCase();
                }

                // COST (using data-cost attribute)
                if (selectedCost !== 'All') {
                    const cardCost = card.getAttribute('data-cost');
                    show = show && cardCost && cardCost.toLowerCase() === selectedCost.toLowerCase();
                }

                // SEARCH
                if (searchTerm) {
                    const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
                    const org = card.querySelector('p.text-sm.font-medium')?.textContent?.toLowerCase() || '';
                    show = show && (title.includes(searchTerm) || org.includes(searchTerm));
                }

                // DATE
                if (selectedDate) {
                    // Try to find the deadline in the card
                    const deadline = card.querySelector('.font-semibold.text-gray-800, .font-semibold.text-gray-200')?.textContent?.trim();
                    if (deadline && deadline !== 'Ongoing') {
                        let cardDate = new Date(deadline);
                        let filterDate = new Date(selectedDate);
                        if (isNaN(cardDate)) {
                            cardDate = new Date(Date.parse(deadline));
                        }
                        show = show && (cardDate >= filterDate);
                    }
                }

                card.style.display = show ? '' : 'none';
                if (show) anyVisible = true;
            });

            const noResults = document.getElementById('no-results');
            if (noResults) {
                noResults.classList.toggle('hidden', anyVisible);
            }
        }

        // --- REQUIREMENTS TOGGLE LOGIC ---
        document.querySelectorAll('.reqs-toggle-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const reqs = this.nextElementSibling;
                if (reqs) reqs.classList.toggle('hidden');
            });
        });
    }

    // --- UNIVERSAL LOGIC (for all pages) ---

    // Translation Logic
    const translations = {
        // ... your full translation object here ...
    };
    const translatePage = (lang) => { /* ... */ };
    const langSwitcher = document.getElementById('lang-switcher');
    const langSwitcherMobile = document.getElementById('lang-switcher-mobile');
    if (langSwitcher) {
        langSwitcher.addEventListener('change', (e) => {
            translatePage(e.target.value);
            if(langSwitcherMobile) langSwitcherMobile.value = e.target.value;
        });
    }
    if (langSwitcherMobile) {
         langSwitcherMobile.addEventListener('change', (e) => {
            translatePage(e.target.value);
            if(langSwitcher) langSwitcher.value = e.target.value;
        });
    }

    // Dark Mode Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const darkIcon = document.getElementById('theme-toggle-dark-icon');
        const lightIcon = document.getElementById('theme-toggle-light-icon');
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            lightIcon.classList.remove('hidden');
            document.documentElement.classList.add('dark');
        } else {
            darkIcon.classList.remove('hidden');
        }
        themeToggleBtn.addEventListener('click', function() {
            darkIcon.classList.toggle('hidden');
            lightIcon.classList.toggle('hidden');
            document.documentElement.classList.toggle('dark');
            const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            localStorage.setItem('color-theme', theme);
        });
    }

    // Spotlight effect for dark mode
    window.addEventListener('mousemove', e => {
        if(document.documentElement.classList.contains('dark')) {
            document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
        }
    });

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenuButton.addEventListener('click', () => { mobileMenu.classList.toggle('hidden'); });
    }
});

function generateToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('training-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const title = document.getElementById('training-title').value;
            const organizer = document.getElementById('organizer-name').value;
            const category = document.getElementById('category').value;
            const cost = document.querySelector('input[name="cost"]:checked')?.value || '';
            const location = document.getElementById('location').value;
            const deadline = document.getElementById('deadline').value;
            const link = document.getElementById('application-link').value;
            const requirements = document.getElementById('requirements').value.split('\n').filter(Boolean);

            // Generate a unique token
            const verificationToken = generateToken();

            // Save to pendingTrainings with the token
            const pending = JSON.parse(localStorage.getItem('pendingTrainings') || '[]');
            pending.push({ title, organizer, category, cost, location, deadline, link, requirements, verificationToken });
            localStorage.setItem('pendingTrainings', JSON.stringify(pending));

            // TODO: Send email to admin with the verification link
            const verificationLink = `4dm1n-v3r1fy.html?token=${verificationToken}`;
            console.log("Verification Link:", verificationLink); // For testing

            alert('Training submitted! You will receive a verification email shortly.');
            this.reset();
        });
    }
});
