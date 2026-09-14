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
 * página de case study). Entrou o botão de copiar o email.
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

  // --- Copiar o email ---
  // Um mailto: num computador sem cliente de email configurado não faz nada.
  // O botão copia o endereço e confirma durante 2 segundos numa região
  // aria-live, para o leitor de ecrã também ouvir a confirmação.
  document.querySelectorAll('.copy-email').forEach((btn) => {
    const estado = btn.parentElement.querySelector('.copy-status');
    let temporizador;
    btn.addEventListener('click', async () => {
      const copiado = await copiar(btn.getAttribute('data-email'));
      if (!copiado || !estado) return;
      estado.textContent = btn.getAttribute('data-feito');
      clearTimeout(temporizador);
      temporizador = setTimeout(() => {
        estado.textContent = '';
      }, 2000);
    });
  });
});

/**
 * Copia texto para a área de transferência. A Clipboard API precisa de HTTPS
 * (ou localhost); sem ela, recorre ao método antigo com uma área de texto
 * temporária. Devolve se conseguiu.
 */
async function copiar(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch (e) {
    /* sem Clipboard API ou sem permissão: tenta o método antigo */
  }
  const campo = document.createElement('textarea');
  campo.value = texto;
  campo.setAttribute('readonly', '');
  campo.style.position = 'fixed';
  campo.style.opacity = '0';
  document.body.appendChild(campo);
  campo.select();
  let copiado = false;
  try {
    copiado = document.execCommand('copy');
  } catch (e) {
    copiado = false;
  }
  campo.remove();
  return copiado;
}
