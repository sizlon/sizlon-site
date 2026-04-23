(function () {
  const buttons = Array.from(document.querySelectorAll('[data-lang-target]'));
  const panels = Array.from(document.querySelectorAll('[data-lang]'));
  const labels = Array.from(document.querySelectorAll('[data-label-ko][data-label-en]'));
  const navs = Array.from(document.querySelectorAll('[data-site-nav]'));
  const backdrops = Array.from(document.querySelectorAll('[data-site-nav-backdrop]'));
  const navToggle = document.querySelector('[data-site-nav-toggle]');
  const mobileQuery = window.matchMedia('(max-width: 640px)');

  function bindMediaChange(query, handler) {
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', handler);
      return;
    }

    if (typeof query.addListener === 'function') {
      query.addListener(handler);
    }
  }

  function setNavOpen(open) {
    if (!navToggle) {
      return;
    }

    navs.forEach((nav) => {
      nav.classList.toggle('is-open', open);
    });
    backdrops.forEach((backdrop) => {
      backdrop.hidden = !open;
      backdrop.classList.toggle('is-open', open);
    });
    document.body.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function activate(lang) {
    buttons.forEach((button) => {
      const active = button.dataset.langTarget === lang;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.lang !== lang;
    });

    labels.forEach((node) => {
      node.textContent = lang === 'ko' ? node.dataset.labelKo : node.dataset.labelEn;
    });

    document.documentElement.lang = lang === 'ko' ? 'ko' : 'en';
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => activate(button.dataset.langTarget));
  });

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const open = navs.length > 0 && !navs[0].classList.contains('is-open');
      setNavOpen(open);
    });

    navs.forEach((nav) => {
      nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          if (mobileQuery.matches) {
            setNavOpen(false);
          }
        });
      });
    });

    backdrops.forEach((backdrop) => {
      backdrop.addEventListener('click', () => setNavOpen(false));
    });

    bindMediaChange(mobileQuery, (event) => {
      if (!event.matches) {
        setNavOpen(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setNavOpen(false);
      }
    });

    window.addEventListener('resize', () => {
      if (!mobileQuery.matches) {
        setNavOpen(false);
      }
    });
  }

  activate('ko');
})();
