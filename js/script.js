if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
    // Remove a âncora (#) do URL sem forçar um segundo recarregamento
    window.history.replaceState(null, null, window.location.pathname);
    
    // Como tirámos a âncora, temos de garantir que faz scroll para o topo 
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 0);
}

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
        
        // Limpar os tooltips ao fechar a janela
        document.querySelectorAll('.modal-info-btn').forEach(btn => {
            btn.classList.remove('active-tooltip');
        });
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

    // --- Modal Info Button Logic (Mobile Toggle) ---
    const infoBtns = document.querySelectorAll('.modal-info-btn');
    
    // Toggle ao clicar no botão
    infoBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que o clique se propague para o document
            this.classList.toggle('active-tooltip');
        });
    });

    // Fechar tooltip ao clicar em qualquer outro lado da página
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.modal-info-btn')) {
            infoBtns.forEach(btn => btn.classList.remove('active-tooltip'));
        }
    });

    // --- Language Translation Logic ---
    const translations = {
        en: {
            "overlay-about": "About",
            "overlay-skills": "Skills",
            "overlay-projects": "Projects",
            "overlay-contacts": "Contacts",
            "hero-title": "Hello, I am Francisco Pereira",
            "hero-subtitle": "Computer Engineering Student | Web Developer | Databases",
            "hero-btn-cv": "Download CV",
            "hero-btn-contact": "Get in touch",
            "about-heading": "About me",
            "about-text": "I am a final-year Computer Engineering student at Politécnico de Leiria with a deep fascination for web development and databases. My journey includes hands-on experience building integrated solutions, such as an e-commerce platform with a built-in stock management system developed during my internship. I specialize in bridging robust backend architectures with clean, responsive front-end interfaces. Driven by logical challenges and teamwork, I am constantly looking to learn, evolve, and build high-performance digital experiences.",
            "skills-heading": "Skills",
            "projects-heading": "Projects",
            "project-title-mrpizza": "Mr. Pizza - E-commerce Platform",
            "project-title-dianearbus": "Diane Arbus - Digital Catalog",
            "project-title-gest": "Gest - E-commerce & Stock Management",
            "project-title-ainet": "AINET - Laravel Full-Stack Platform",
            "project-title-dae": "DAE - Full-Stack Architecture & AI",
            "project-title-ti": "Smart Hotel - IoT Platform",
            "project-btn-view-more": "View More",
            "contacts-heading": "Contacts",
            "contact-title-email": "E-mail",
            "contact-title-linkedin": "Linkedin",
            "contact-title-github": "Github",
            "footer-text": "© 2026 Francisco Pereira • Built with HTML, CSS & JavaScript",
            "modal-btn-project": "View Project",
            "modal-btn-repo": "View Repository",
            "modal-desc-mrpizza": "E-commerce platform developed for the Mr. Pizza chain. The website allows customers to explore the full menu (pizzas, drinks, and desserts), place online orders with home delivery options, and provides a fluid and intuitive browsing experience.",
            "modal-feat-mrpizza-1": "Full product catalog (pizzas, drinks, and desserts).",
            "modal-feat-mrpizza-2": "Shopping cart and online ordering system.",
            "modal-feat-mrpizza-3": "Integrated home delivery option.",
            "modal-desc-dianearbus": "An interactive digital catalog dedicated to the work of photographer Diane Arbus. The project features a gallery of her photographic works, including self-portraits, accompanied by detailed descriptions that contextualize each piece.",
            "modal-feat-dianearbus-1": "Interactive gallery of photographs and self-portraits.",
            "modal-feat-dianearbus-2": "Informative sections with details and historical context of each work.",
            "modal-feat-dianearbus-3": "Minimalist design focused on the artistic viewing experience.",
            "modal-desc-gest": "Professional Aptitude Project developed in a corporate environment using the OutSystems Low-Code platform. The 'Gest' project consists of an integrated ecosystem that includes an e-commerce platform targeting the final consumer and a robust backoffice infrastructure for inventory management.",
            "modal-feat-gest-1": "Full-stack development on a Low-Code platform.",
            "modal-feat-gest-2": "Online store with product catalog and shopping cart system.",
            "modal-feat-gest-3": "Rel-time database synchronization and stock management.",
            "modal-desc-ainet": "Full-Stack project developed in a team as part of a university course, functioning as a hybrid Association and E-commerce platform. Built with the Laravel framework using the MVC architectural pattern and Vite on the frontend. The main technical focus is on relational database management and security.",
            "modal-feat-ainet-1": "Implementation of RBAC system with 3 strict access levels: Board, Employee, and Member.",
            "modal-feat-ainet-2": "Advanced protection and security of routes based on the authenticated user's type and privileges.",
            "modal-feat-ainet-3": "Complex relational management of Products, Categories, Orders, Shipping Costs, and Shopping Cart.",
            "modal-desc-dae": "Computer Engineering project focused on creating a robust and scalable full-stack architecture, with strong Separation of Concerns (SoC). The ecosystem stands out for its fully containerized infrastructure and the native integration of a locally running Artificial Intelligence model.",
            "modal-feat-dae-1": "100% containerized infrastructure via Docker (isolated mobile services, databases, and backend).",
            "modal-feat-dae-2": "Integration of local AI (LLaMA 3) into the ecosystem using Ollama.",
            "modal-feat-dae-3": "RBAC permission system with different access levels and a secure test environment with email interception (MailHog).",
            "modal-desc-ti": "Web platform for the Internet of Things (IoT) focused on monitoring sensors and hardware (Arduino/ESP32). It differentiates itself by architecting a 'Flat-File' API in pure PHP, without using SQL databases, ensuring lightweight, secure, and resilient communication with physical devices.",
            "modal-feat-ti-1": "Direct integration with hardware (sensors and webcam) via file system with protection against Path Traversal and injections.",
            "modal-feat-ti-2": "Dynamic dashboard with asynchronous updates (Fetch API/AJAX) without needing to refresh.",
            "modal-feat-ti-3": "Optimized architecture with DRY Principle and native pagination in log files.",
            "modal-feat-ti-4": "Reinforced security with data sanitization (htmlspecialchars) and robust authentication (password_hash).",
            "modal-tooltip-note": "Note: This project is hosted on a free server. If there have been no recent accesses, the server may take 1 to 2 minutes to start up on the first click. Thank you for your patience!"
        }
    };

    const ptTranslations = {};

    // Build PT translation map dynamically from index.html base content on load
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (!ptTranslations[key]) {
            ptTranslations[key] = el.innerHTML.trim();
        }
    });

    document.querySelectorAll('[data-translate-tooltip]').forEach(el => {
        const key = el.getAttribute('data-translate-tooltip');
        if (!ptTranslations[key]) {
            ptTranslations[key] = el.getAttribute('data-tooltip');
        }
    });

    // Set Language function
    function setLanguage(lang) {
        // Translation for standard text elements
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (lang === 'en') {
                if (translations.en[key]) {
                    el.innerHTML = translations.en[key];
                }
            } else {
                if (ptTranslations[key]) {
                    el.innerHTML = ptTranslations[key];
                }
            }
        });

        // Translation for elements with data-tooltip
        document.querySelectorAll('[data-translate-tooltip]').forEach(el => {
            const key = el.getAttribute('data-translate-tooltip');
            if (lang === 'en') {
                if (translations.en[key]) {
                    el.setAttribute('data-tooltip', translations.en[key]);
                }
            } else {
                if (ptTranslations[key]) {
                    el.setAttribute('data-tooltip', ptTranslations[key]);
                }
            }
        });

        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            if (lang === 'en') {
                metaDesc.setAttribute('content', 'Portfolio of Francisco Pereira, a Computer Engineering student focused on building high-performance web experiences.');
            } else {
                metaDesc.setAttribute('content', 'Portfólio de Francisco Pereira, estudante de Engenharia Informática focado em criar experiências web de alto desempenho.');
            }
        }

        // Update HTML lang tag
        document.documentElement.lang = lang === 'en' ? 'en' : 'pt-PT';

        // Update active class in seletor
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            const ptSpan = langToggle.querySelector('.lang-pt');
            const enSpan = langToggle.querySelector('.lang-en');
            if (lang === 'en') {
                ptSpan.classList.remove('active-lang');
                enSpan.classList.add('active-lang');
            } else {
                ptSpan.classList.add('active-lang');
                enSpan.classList.remove('active-lang');
            }
        }

        localStorage.setItem('language', lang);
    }

    // Lang Toggle event listener
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const currentLang = localStorage.getItem('language') || 'pt';
            const nextLang = currentLang === 'pt' ? 'en' : 'pt';
            setLanguage(nextLang);
        });
    }

    // Initialize saved language preference on page load
    const savedLang = localStorage.getItem('language') || 'pt';
    if (savedLang === 'en') {
        setLanguage('en');
    }

    // --- Active Link Scrollspy using IntersectionObserver ---
    const sections = document.querySelectorAll('section[id]');
    const scrollspyOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    };

    const scrollspyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                overlayLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active-link');
                    } else {
                        link.classList.remove('active-link');
                    }
                });
            }
        });
    }, scrollspyOptions);

    sections.forEach(section => scrollspyObserver.observe(section));
});
