/**
 * Comportamento do portfólio.
 *
 * Portado de js/script.js. O que saiu, e porquê:
 *  - setLanguage(), translations.en e ptTranslations foram apagados. A tradução
 *    deixou de ser troca de innerHTML em runtime: cada língua é agora uma página
 *    estática gerada no build. O seletor de idioma é um link entre / e /en/.
 *  - A aplicação do tema guardado saiu daqui para um <script is:inline> no <head>,
 *    para não haver flash. Aqui fica só a alternância por clique.
 *  - O bloco de deteção de reload também está inline no <head>, para manter o
 *    momento de execução original (fora do DOMContentLoaded).
 */

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // --- Menu overlay (ecrã inteiro) ---
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

  if (hamburgerBtn && overlayMenu) {
    hamburgerBtn.addEventListener('click', toggleMenu);
    overlayLinks.forEach((link) => link.addEventListener('click', closeMenu));
  }

  // --- Alternador de tema ---
  // A classe vive em <html> (e não em <body>) para o script do <head> a poder
  // aplicar antes da primeira pintura.
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const eraEscuro = root.classList.contains('dark-mode');
      const novo = eraEscuro ? 'light' : 'dark';
      root.classList.remove('light-mode', 'dark-mode');
      root.classList.add(novo === 'dark' ? 'dark-mode' : 'light-mode');
      try {
        localStorage.setItem('theme', novo);
      } catch (e) {
        /* modo privado ou armazenamento bloqueado: o tema não persiste */
      }
    });
  }

  // --- Modais dos projetos ---
  const btnsViewMore = document.querySelectorAll('.btn-view-more');
  const modals = document.querySelectorAll('.modal');
  const overlay = document.getElementById('modal-overlay');
  const closeBtns = document.querySelectorAll('.modal-close');

  // Último elemento com foco antes de abrir a modal (restauro de foco, WCAG).
  let lastFocusedElement = null;

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      lastFocusedElement = document.activeElement;
      modal.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      const closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 50);
      }
    }
  }

  function closeModal() {
    modals.forEach((m) => m.classList.remove('active'));
    overlay.classList.remove('active');
    document.body.style.overflow = '';

    document.querySelectorAll('.modal-info-btn').forEach((btn) => {
      btn.classList.remove('active-tooltip');
    });

    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  btnsViewMore.forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal(btn.getAttribute('data-modal'));
    });
  });

  closeBtns.forEach((btn) => btn.addEventListener('click', closeModal));

  if (overlay) {
    overlay.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // --- Animações de revelação no scroll ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    const intersectingEntries = entries.filter((entry) => entry.isIntersecting);

    intersectingEntries.forEach((entry, index) => {
      setTimeout(() => {
        entry.target.classList.add('is-visible');
      }, index * 100);

      observer.unobserve(entry.target);
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // --- Cascata da grelha de competências ---
  const skillsGrid = document.getElementById('skills-grid-container');
  const skillCards = document.querySelectorAll('.skill-card');

  if (skillsGrid) {
    const skillsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          skillCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('is-visible');
            }, index * 100);
          });
          skillsObserver.unobserve(skillsGrid);
        }
      },
      { threshold: 0.1 }
    );

    skillsObserver.observe(skillsGrid);
  }

  // --- Balões informativos das modais (toque em mobile) ---
  const infoBtns = document.querySelectorAll('.modal-info-btn');

  infoBtns.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      this.classList.toggle('active-tooltip');
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.modal-info-btn')) {
      infoBtns.forEach((btn) => btn.classList.remove('active-tooltip'));
    }
  });

  // --- Scrollspy do menu overlay ---
  const sections = document.querySelectorAll('section[id]');
  const scrollspyOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0,
  };

  const scrollspyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        overlayLinks.forEach((link) => {
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active-link');
          } else {
            link.classList.remove('active-link');
          }
        });
      }
    });
  }, scrollspyOptions);

  sections.forEach((section) => scrollspyObserver.observe(section));

  // --- O seletor de idioma preserva a secção atual ---
  // Substitui o antigo setLanguage(): em vez de reescrever a página, navega para
  // a outra língua levando a âncora, para o visitante cair na mesma secção.
  const langLink = document.getElementById('lang-toggle');
  if (langLink) {
    const base = langLink.getAttribute('href');
    const sincronizarAncora = () => {
      langLink.setAttribute('href', base + window.location.hash);
    };
    sincronizarAncora();
    window.addEventListener('hashchange', sincronizarAncora);
    overlayLinks.forEach((link) => link.addEventListener('click', () => {
      // O clique só altera location.hash depois deste handler; adia uma volta.
      setTimeout(sincronizarAncora, 0);
    }));
  }
});
