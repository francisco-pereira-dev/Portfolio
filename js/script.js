/**
 * Portfólio de Francisco Pereira
 * Ficheiro de Script Principal (JavaScript Vanilla)
 * 
 * Este ficheiro gere a interatividade do portfólio, incluindo o alternador de idiomas (PT/EN),
 * o tema (Claro/Escuro), a exibição de janelas modais com gestão de acessibilidade (foco),
 * as animações de scroll assíncronas e o destaque ativo de secções (Scrollspy).
 */

// --- Gestão de Recarregamento de Página ---
// Deteta se o utilizador recarregou a página. Se sim, remove a âncora (#) do URL
// para evitar que o browser faça scroll automático para uma secção intermédia,
// forçando o reposicionamento suave no topo da página.
if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
    window.history.replaceState(null, null, window.location.pathname);
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 0);
}

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lógica do Menu de Navegação Overlay (Ecrã Inteiro) ---
    // Seleção dos elementos DOM associados ao menu de sobreposição e ao botão hamburger.
    const overlayMenu = document.getElementById('overlay-menu');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const overlayLinks = document.querySelectorAll('.overlay-link');

    /**
     * Alterna o estado de visibilidade do menu overlay e do ícone hamburger.
     * Bloqueia o scroll da página principal quando o menu está visível.
     */
    function toggleMenu() {
        overlayMenu.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
        
        if (overlayMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    /**
     * Fecha o menu overlay de forma explícita e restaura o scroll da página.
     */
    function closeMenu() {
        overlayMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Registo de escutas de eventos para cliques no botão hamburger e nos links do menu.
    hamburgerBtn.addEventListener('click', toggleMenu);
    overlayLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // --- Lógica do Alternador de Temas (Dark/Light Mode) ---
    // Seleção do botão e aplicação inicial do tema guardado nas preferências locais (localStorage).
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

    // Escuta de evento para alternar o tema entre claro e escuro.
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

    // --- Lógica do Sistema de Modais (Visualização de Detalhes dos Projetos) ---
    // Seleção dos botões de abertura, fecho, overlay escuro e gestão de acessibilidade de teclado.
    const btnsViewMore = document.querySelectorAll('.btn-view-more');
    const modals = document.querySelectorAll('.modal');
    const overlay = document.getElementById('modal-overlay');
    const closeBtns = document.querySelectorAll('.modal-close');
    
    // Variável para guardar o último elemento focado antes da abertura da modal (WCAG Focus Restoration).
    let lastFocusedElement = null;

    /**
     * Abre uma janela modal específica, bloqueia o scroll e gere o foco do teclado.
     * @param {string} modalId - O identificador único da modal no DOM.
     */
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            lastFocusedElement = document.activeElement; // Salva o elemento com foco atual
            modal.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Move o foco para o botão de fecho para facilitar a navegação por teclado (A11y)
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                setTimeout(() => closeBtn.focus(), 50); // Pequeno atraso para alinhamento com a transição CSS
            }
        }
    }

    /**
     * Fecha todas as janelas modais ativas, limpa tooltips e restaura o foco anterior.
     */
    function closeModal() {
        modals.forEach(m => m.classList.remove('active'));
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove o estado ativo dos balões informativos (tooltips) nas modais
        document.querySelectorAll('.modal-info-btn').forEach(btn => {
            btn.classList.remove('active-tooltip');
        });

        // Restaura o foco ao botão que iniciou a ação de visualização (A11y)
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    }

    // Registo de escutas de eventos para os botões "Ver Mais", botões de fecho e overlay.
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

    // Fecha a modal ativa quando a tecla "Escape" é premida.
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // --- Animações de Revelação Dinâmica no Scroll (Reveal CSS) ---
    // Configuração do IntersectionObserver para aplicar animações de transição suaves
    // à medida que os elementos entram na área de visualização (viewport).
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // O gatilho dispara quando 10% do elemento está visível
    };

    const observer = new IntersectionObserver((entries) => {
        const intersectingEntries = entries.filter(entry => entry.isIntersecting);
        
        intersectingEntries.forEach((entry, index) => {
            // Aplica um atraso incremental (stagger) para efeitos mais orgânicos
            setTimeout(() => {
                entry.target.classList.add('is-visible');
            }, index * 100); 
            
            // Cancela a observação após o elemento ficar visível para poupar recursos
            observer.unobserve(entry.target);
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // --- Animações Sequenciais na Grelha de Competências (Skills Stagger) ---
    // Efeito de revelação em cascata aplicado especificamente aos cartões de competências.
    const skillsGrid = document.getElementById('skills-grid-container');
    const skillCards = document.querySelectorAll('.skill-card');

    if (skillsGrid) {
        const skillsObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                skillCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('is-visible');
                    }, index * 100);
                });
                skillsObserver.unobserve(skillsGrid);
            }
        }, {
            threshold: 0.1
        });
        
        skillsObserver.observe(skillsGrid);
    }

    // --- Balões Informativos nas Modais (Tooltip em Mobile) ---
    // Gere a visualização de explicações contextuais nas modais através de toques em mobile.
    const infoBtns = document.querySelectorAll('.modal-info-btn');
    
    infoBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Evita a propagação do clique para o document
            this.classList.toggle('active-tooltip');
        });
    });

    // Fecha os balões informativos se o utilizador clicar fora dos mesmos.
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.modal-info-btn')) {
            infoBtns.forEach(btn => btn.classList.remove('active-tooltip'));
        }
    });

    // --- Lógica do Sistema Integrado de Tradução (PT-PT / EN) ---
    // Dicionário contendo todos os termos e strings traduzidos para Inglês.
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
            "modal-feat-gest-3": "Real-time database synchronization and stock management.",
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

    // Objeto vazio para guardar dinamicamente as strings base em Português (PT-PT)
    const ptTranslations = {};

    // Mapeia e armazena os conteúdos originais em Português presentes no HTML (data-translate)
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (!ptTranslations[key]) {
            ptTranslations[key] = el.innerHTML.trim();
        }
    });

    // Mapeia e armazena os atributos de ajuda (data-tooltip) originais em Português
    document.querySelectorAll('[data-translate-tooltip]').forEach(el => {
        const key = el.getAttribute('data-translate-tooltip');
        if (!ptTranslations[key]) {
            ptTranslations[key] = el.getAttribute('data-tooltip');
        }
    });

    /**
     * Traduz dinamicamente os conteúdos da página web para o idioma selecionado.
     * @param {string} lang - Código do idioma de destino ('en' ou 'pt').
     */
    function setLanguage(lang) {
        // Atualiza textos baseados em atributos data-translate
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

        // Atualiza os balões de ajuda contextuais (tooltips)
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

        // Atualiza os metadados de descrição da página (SEO)
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            if (lang === 'en') {
                metaDesc.setAttribute('content', 'Portfolio of Francisco Pereira, a Computer Engineering student focused on building high-performance web experiences.');
            } else {
                metaDesc.setAttribute('content', 'Portfólio de Francisco Pereira, estudante de Engenharia Informática focado em criar experiências web de alto desempenho.');
            }
        }

        // Altera a meta tag de idioma do documento HTML
        document.documentElement.lang = lang === 'en' ? 'en' : 'pt-PT';

        // Atualiza as etiquetas textuais de acessibilidade dos botões da navbar (A11y)
        const hamburgerBtn = document.getElementById('hamburger-btn');
        if (hamburgerBtn) {
            hamburgerBtn.setAttribute('aria-label', lang === 'en' ? 'Toggle Menu' : 'Alternar Menu');
        }
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', lang === 'en' ? 'Toggle Dark/Light Mode' : 'Alternar Modo Escuro/Claro');
        }

        // Atualiza o estado visual e destaque das opções no seletor de idiomas (PT/EN)
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

        // Guarda a preferência linguística nas configurações locais do browser
        localStorage.setItem('language', lang);
    }

    // Regista o clique do seletor para comutar o idioma ativo
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const currentLang = localStorage.getItem('language') || 'pt';
            const nextLang = currentLang === 'pt' ? 'en' : 'pt';
            setLanguage(nextLang);
        });
    }

    // Inicia e carrega o idioma de preferência do utilizador no arranque
    const savedLang = localStorage.getItem('language') || 'pt';
    if (savedLang === 'en') {
        setLanguage('en');
    }

    // --- Observador Scrollspy para Destaque de Ligações Ativas (Menu Overlay) ---
    // Observa o scroll da página e aplica um brilho suave à opção de menu cuja secção está no ecrã.
    const sections = document.querySelectorAll('section[id]');
    const scrollspyOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // Foco calibrado nos 20% centrais do ecrã
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
