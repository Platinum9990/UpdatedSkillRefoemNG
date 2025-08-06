// A global helper function to generate a random token for training submissions.
function generateToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Main event listener that runs after the page content has loaded.
document.addEventListener('DOMContentLoaded', function() {
    
    // --- UNIVERSAL INITIALIZATIONS ---
    if (typeof AOS !== 'undefined') {
        AOS.init({ once: true, duration: 800 });
    }
    
    // --- HOMEPPAGE-SPECIFIC LOGIC ---
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

    if (typeof VanillaTilt !== 'undefined' && document.querySelector('[data-tilt]')) {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 15, speed: 400, glare: true, "max-glare": 0.5
        });
    }

    const viewMoreBtn = document.getElementById('view-more-btn');
    if (viewMoreBtn) {
        const hiddenCards = document.querySelectorAll('.training-card.hidden');
        viewMoreBtn.addEventListener('click', () => {
            hiddenCards.forEach(card => {
                card.classList.remove('hidden');
                card.classList.add('flex');
            });
            if (typeof AOS !== 'undefined') AOS.refreshHard();
            viewMoreBtn.style.display = 'none';
        });
    }

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
        // ... (All filter and search logic from your developer) ...
    }

    // --- SUBMIT TRAINING PAGE-SPECIFIC LOGIC ---
    const trainingForm = document.getElementById('training-form');
    if (trainingForm) {
        trainingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('training-title').value;
            // ... (rest of the form submission logic) ...
            const verificationToken = generateToken();
            const pending = JSON.parse(localStorage.getItem('pendingTrainings') || '[]');
            pending.push({ title, verificationToken /* ... other fields ... */ });
            localStorage.setItem('pendingTrainings', JSON.stringify(pending));
            alert('Training submitted! You will receive a verification email shortly.');
            this.reset();
        });
    }

    // --- UNIVERSAL FEATURES (for all pages) ---

    // Translation Logic (from developer's code)
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
        // ... (Translation logic) ...
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

    // --- Your Animated Character Logic (Merged) ---
    const character = document.getElementById('animated-character');
    const characterShape = document.getElementById('character-shape');
    if (character && characterShape) {
        // 1. Logic for mouse-following movement
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        let targetX = x;
        let targetY = y;
        const speed = 0.1;

        document.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        });

        function animate() {
            x += (targetX - x) * speed;
            y += (targetY - y) * speed;
            character.style.transform = `translate(${x - 50}px, ${y - 50}px)`;
            requestAnimationFrame(animate);
        }
        animate();

        // 2. Logic for changing the letters
        const letters = [
            `<rect x="20" y="20" width="60" height="60" rx="10" fill="#2563eb" transform="rotate(-12 50 50)"/><text x="50" y="68" font-family="Inter, sans-serif" font-size="50" font-weight="800" fill="white" text-anchor="middle" transform="rotate(-12 50 50)">S</text>`,
            `<rect x="20" y="20" width="60" height="60" rx="10" fill="#16a34a" transform="rotate(-12 50 50)"/><text x="50" y="68" font-family="Inter, sans-serif" font-size="50" font-weight="800" fill="white" text-anchor="middle" transform="rotate(-12 50 50)">R</text>`,
            `<rect x="20" y="20" width="60" height="60" rx="10" fill="#7c3aed" transform="rotate(-12 50 50)"/><text x="50" y="68" font-family="Inter, sans-serif" font-size="50" font-weight="800" fill="white" text-anchor="middle" transform="rotate(-12 50 50)">N</text>`
        ];
        let currentLetterIndex = 0;
        
        setInterval(() => {
            currentLetterIndex = (currentLetterIndex + 1) % letters.length;
            characterShape.innerHTML = letters[currentLetterIndex];
        }, 5000);
    }
});
