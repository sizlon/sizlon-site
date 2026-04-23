(function () {
  const buttons = document.querySelectorAll('[data-lang-target]');
  const panels = document.querySelectorAll('[data-lang]');
  const labels = document.querySelectorAll('[data-label-ko][data-label-en]');
  const nav = document.querySelector('[data-site-nav]');
  const navToggle = document.querySelector('[data-site-nav-toggle]');
  const mobileQuery = window.matchMedia('(max-width: 640px)');

  function setNavOpen(open) {
    if (!nav || !navToggle) {
      return;
    }

    nav.classList.toggle('is-open', open);
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

  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      setNavOpen(!nav.classList.contains('is-open'));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileQuery.matches) {
          setNavOpen(false);
        }
      });
    });

    window.addEventListener('resize', () => {
      if (!mobileQuery.matches) {
        setNavOpen(false);
      }
    });
  }

  activate('ko');
})();
