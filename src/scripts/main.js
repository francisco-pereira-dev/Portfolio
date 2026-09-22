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
 *
 * Fase 4: a cascata das competências e os balões "?" das modais saíram (as
 * competências deixaram de ser cartões e a nota de arranque a frio passou para a
 * página de case study).
 *
 * Fase 4.2a: o botão de copiar o email, acrescentado na fase 4, foi revertido.
 */

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // --- Menu overlay (ecrã inteiro) ---
  const overlayMenu = document.getElementById('overlay-menu');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const overlayLinks = document.querySelectorAll('.overlay-link');

  // Fase 5: com o menu aberto, tudo o que fica por trás dele é inert (sai da
  // ordem de tabulação e dos leitores de ecrã), exceto o cabeçalho, onde está o
  // botão que o fecha. O foco entra no primeiro link; Escape fecha e devolve o
  // foco ao botão (ver o keydown mais abaixo).
  const definirMenu = (aberto) => {
    overlayMenu.classList.toggle('active', aberto);
    hamburgerBtn.classList.toggle('active', aberto);
    hamburgerBtn.setAttribute('aria-expanded', String(aberto));
    document.body.style.overflow = aberto ? 'hidden' : '';
    for (const el of document.body.children) {
      if (el === overlayMenu || el.contains(hamburgerBtn) || el.tagName === 'SCRIPT') continue;
      el.inert = aberto;
    }
  };

  function toggleMenu() {
    const abrir = !overlayMenu.classList.contains('active');
    definirMenu(abrir);
    if (abrir) overlayMenu.querySelector('a')?.focus();
  }

  function closeMenu() {
    definirMenu(false);
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

  // --- Modais dos projetos sem case study ---
  // Abre-as o título da linha, um botão com data-modal. Os projetos com case
  // study ligam à sua página e não têm modal.
  const modalTriggers = document.querySelectorAll('[data-modal]');
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
      // Fase 5: o resto da página fica inert enquanto a modal está aberta, para o
      // foco não sair dela. Escape e o fundo continuam a fechá-la.
      for (const el of document.body.children) {
        if (el === modal || el === overlay || el.tagName === 'SCRIPT') continue;
        el.inert = true;
      }

      const closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 50);
      }
    }
  }

  function closeModal() {
    // Sem modal aberta não há nada a fazer. Nas páginas de case study não existe
    // fundo de modal, e o Escape dava um TypeError na consola.
    if (!document.querySelector('.modal.active')) return;

    modals.forEach((m) => m.classList.remove('active'));
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    for (const el of document.body.children) el.inert = false;

    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  modalTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal(btn.getAttribute('data-modal'));
    });
  });

  closeBtns.forEach((btn) => btn.addEventListener('click', closeModal));

  if (overlay) {
    overlay.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    // Fase 5: o Escape também fecha o menu, e o foco volta ao botão que o abriu.
    if (overlayMenu?.classList.contains('active')) {
      closeMenu();
      hamburgerBtn.focus();
      return;
    }
    closeModal();
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
          // Fase 5: a secção atual também fica marcada para tecnologia de apoio.
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active-link');
            link.setAttribute('aria-current', 'true');
          } else {
            link.classList.remove('active-link');
            link.removeAttribute('aria-current');
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

  // --- Voltar ao topo (fase 4.2b) ---
  // Aparece depois de o visitante passar a altura do hero. Nas páginas sem hero
  // (case studies), depois de uma altura de ecrã. Escondido, o CSS dá-lhe
  // visibility: hidden, e por isso sai da ordem de tabulação.
  const botaoTopo = document.getElementById('back-to-top');
  if (botaoTopo) {
    const hero = document.getElementById('hero');
    const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
    const atualizarTopo = () => {
      const limite = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
      botaoTopo.classList.toggle('is-visible', window.scrollY > limite);
    };
    window.addEventListener('scroll', atualizarTopo, { passive: true });
    window.addEventListener('resize', atualizarTopo);
    atualizarTopo();

    botaoTopo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduzirMovimento.matches ? 'auto' : 'smooth' });
      // No topo o botão desaparece; o foco passa ao primeiro controlo da página
      // em vez de se perder no documento.
      const primeiro = document.getElementById('hamburger-btn');
      if (primeiro) primeiro.focus({ preventScroll: true });
    });
  }

  // --- Botões de informação "?" nas linhas de projeto (fase 4.2d) ---
  // Um botão com aria-expanded e aria-controls abre e fecha o texto por baixo da
  // etiqueta. Fecha com Escape (e o foco volta ao botão), com clique fora, ou
  // ao clicar outra vez. Só um fica aberto de cada vez.
  const infoBtns = document.querySelectorAll('.info-btn');
  const fecharInfos = (exceto) => {
    infoBtns.forEach((btn) => {
      if (btn === exceto) return;
      btn.setAttribute('aria-expanded', 'false');
      const balao = document.getElementById(btn.getAttribute('aria-controls'));
      if (balao) balao.hidden = true;
    });
  };
  infoBtns.forEach((btn) => {
    const balao = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const abrir = btn.getAttribute('aria-expanded') !== 'true';
      fecharInfos(btn);
      btn.setAttribute('aria-expanded', String(abrir));
      if (balao) balao.hidden = !abrir;
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const aberto = [...infoBtns].find((btn) => btn.getAttribute('aria-expanded') === 'true');
    if (!aberto) return;
    fecharInfos();
    aberto.focus();
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.info-btn, .info-balao')) fecharInfos();
  });
});

