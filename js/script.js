document.addEventListener('DOMContentLoaded', () => {
    // --- Full-Screen Overlay Menu Logic ---
    const overlayMenu = document.getElementById('overlay-menu');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const overlayLinks = document.querySelectorAll('.overlay-link');

    function toggleMenu() {
        overlayMenu.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
        
        if (overlayMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    function closeMenu() {
        overlayMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburgerBtn.addEventListener('click', toggleMenu);

    overlayLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // --- Dark/Light Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    } else if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    // --- Modal Logic ---
    const btnsViewMore = document.querySelectorAll('.btn-view-more');
    const modals = document.querySelectorAll('.modal');
    const overlay = document.getElementById('modal-overlay');
    const closeBtns = document.querySelectorAll('.modal-close');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        modals.forEach(m => m.classList.remove('active'));
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    btnsViewMore.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // --- Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        const intersectingEntries = entries.filter(entry => entry.isIntersecting);
        
        intersectingEntries.forEach((entry, index) => {
            setTimeout(() => {
                entry.target.classList.add('is-visible');
            }, index * 100); 
            
            observer.unobserve(entry.target);
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // --- Staggered Skills Animation Logic ---
    const skillsGrid = document.getElementById('skills-grid-container');
    const skillCards = document.querySelectorAll('.skill-card');

    if (skillsGrid) {
        const skillsObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                skillCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('is-visible');
                    }, index * 100); // 100ms stagger for each skill card
                });
                skillsObserver.unobserve(skillsGrid);
            }
        }, {
            threshold: 0.1
        });
        
        skillsObserver.observe(skillsGrid);
    }
});
