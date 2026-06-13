/**
 * ARLIZ — Main JavaScript
 * Navigation, theme, animations, interactivity
 */

;(function () {
  'use strict';

  // =========================================
  // DOM READY
  // =========================================

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // =========================================
  // THEME MANAGEMENT
  // =========================================

  const ThemeManager = {
    key: 'arliz-theme',

    get() {
      return localStorage.getItem(this.key) ||
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    },

    set(theme) {
      localStorage.setItem(this.key, theme);
      document.documentElement.setAttribute('data-theme', theme);
      this.updateToggle(theme);
    },

    toggle() {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      this.set(current === 'dark' ? 'light' : 'dark');
    },

    updateToggle(theme) {
      const btn = document.getElementById('theme-toggle');
      if (!btn) return;
      const icon = btn.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '☀' : '◑';
      }
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    },

    init() {
      const theme = this.get();
      document.documentElement.setAttribute('data-theme', theme);
      const btn = document.getElementById('theme-toggle');
      if (btn) {
        btn.addEventListener('click', () => this.toggle());
        this.updateToggle(theme);
      }
    }
  };

  // =========================================
  // SCROLL PROGRESS
  // =========================================

  const ScrollProgress = {
    bar: null,

    update() {
      if (!this.bar) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      this.bar.style.width = pct + '%';
    },

    init() {
      this.bar = document.getElementById('scroll-progress');
      if (this.bar) {
        window.addEventListener('scroll', () => this.update(), { passive: true });
        this.update();
      }
    }
  };

  // =========================================
  // NAVIGATION
  // =========================================

  const Navigation = {
    nav: null,
    lastScrollY: 0,
    ticking: false,
    mobileOpen: false,

    handleScroll() {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.updateNavVisibility();
          this.updateActiveSection();
          this.ticking = false;
        });
        this.ticking = true;
      }
    },

    updateNavVisibility() {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) {
        if (currentScrollY > this.lastScrollY) {
          this.nav.classList.add('hidden');
        } else {
          this.nav.classList.remove('hidden');
        }
      } else {
        this.nav.classList.remove('hidden');
      }
      this.lastScrollY = currentScrollY;
    },

    updateActiveSection() {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
      const scrollMid = window.scrollY + window.innerHeight / 3;

      let active = '';
      sections.forEach(section => {
        if (section.offsetTop <= scrollMid) {
          active = '#' + section.id;
        }
      });

      navLinks.forEach(link => {
        if (link.getAttribute('href') === active) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    },

    initMobileMenu() {
      const hamburger = document.getElementById('nav-hamburger');
      const mobileMenu = document.getElementById('nav-mobile');
      if (!hamburger || !mobileMenu) return;

      hamburger.addEventListener('click', () => {
        this.mobileOpen = !this.mobileOpen;
        mobileMenu.classList.toggle('open', this.mobileOpen);
        hamburger.setAttribute('aria-expanded', this.mobileOpen);
      });

      mobileMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          this.mobileOpen = false;
          mobileMenu.classList.remove('open');
          hamburger.setAttribute('aria-expanded', false);
        });
      });
    },

    initSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
          const target = document.querySelector(anchor.getAttribute('href'));
          if (target) {
            e.preventDefault();
            const top = target.offsetTop - 80;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        });
      });
    },

    init() {
      this.nav = document.querySelector('.nav');
      if (!this.nav) return;
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
      this.initMobileMenu();
      this.initSmoothScroll();
    }
  };

  // =========================================
  // INTERSECTION OBSERVER ANIMATIONS
  // =========================================

  const Animations = {
    observer: null,

    init() {
      if (!('IntersectionObserver' in window)) {
        // Fallback: just show everything
        document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
        return;
      }

      this.observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              this.observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      document.querySelectorAll('.fade-in').forEach(el => this.observer.observe(el));
    }
  };

  // =========================================
  // BACK TO TOP
  // =========================================

  const BackToTop = {
    btn: null,

    init() {
      this.btn = document.getElementById('back-to-top');
      if (!this.btn) return;

      window.addEventListener('scroll', () => {
        this.btn.classList.toggle('visible', window.scrollY > 400);
      }, { passive: true });

      this.btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  // =========================================
  // PARTS ACCORDION
  // =========================================

  const PartsAccordion = {
    init() {
      document.querySelectorAll('.part-header').forEach(header => {
        header.addEventListener('click', () => {
          const card = header.closest('.part-card');
          const isExpanded = card.classList.contains('expanded');

          // Close all
          document.querySelectorAll('.part-card').forEach(c => c.classList.remove('expanded'));

          // Toggle current
          if (!isExpanded) {
            card.classList.add('expanded');
          }
        });
      });

      // Part tab filtering
      document.querySelectorAll('.part-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.part-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          const filter = tab.dataset.filter;
          document.querySelectorAll('.part-card').forEach(card => {
            if (filter === 'all' || card.dataset.part === filter) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }
  };

  // =========================================
  // HERO ANIMATIONS
  // =========================================

  const Hero = {
    initAcronymHover() {
      document.querySelectorAll('.hero-acronym-item').forEach(item => {
        const letter = item.querySelector('.hero-acronym-letter');
        const word = item.querySelector('.hero-acronym-word');
        if (!letter || !word) return;

        item.addEventListener('mouseenter', () => {
          letter.style.background = 'var(--copper)';
          letter.style.color = 'var(--bg-deep)';
          word.style.color = 'var(--copper-light)';
        });

        item.addEventListener('mouseleave', () => {
          letter.style.background = '';
          letter.style.color = '';
          word.style.color = '';
        });
      });
    },

    init() {
      this.initAcronymHover();
    }
  };

  // =========================================
  // CONTRIBUTOR CARD LAZY IMAGES
  // =========================================

  const Contributors = {
    init() {
      // Lazy-load GitHub avatars
      document.querySelectorAll('[data-github-avatar]').forEach(container => {
        const username = container.dataset.githubAvatar;
        if (!username) return;

        const img = document.createElement('img');
        img.src = `https://github.com/${username}.png?size=96`;
        img.alt = username;
        img.loading = 'lazy';
        img.onerror = () => {
          img.remove(); // fallback to initials
        };
        container.appendChild(img);
      });
    }
  };

  // =========================================
  // ACTIVE TOC HIGHLIGHTING
  // =========================================

  const TOC = {
    init() {
      // If there's a table of contents sidebar, highlight active item
      const tocLinks = document.querySelectorAll('.toc-link');
      if (!tocLinks.length) return;

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            const id = entry.target.id;
            const link = document.querySelector(`.toc-link[href="#${id}"]`);
            if (link) {
              link.classList.toggle('active', entry.isIntersecting);
            }
          });
        },
        { threshold: 0.5 }
      );

      document.querySelectorAll('section[id], h2[id], h3[id]').forEach(el => {
        observer.observe(el);
      });
    }
  };

  // =========================================
  // KEYBOARD NAV
  // =========================================

  const KeyboardNav = {
    init() {
      document.addEventListener('keydown', e => {
        // Escape closes mobile nav
        if (e.key === 'Escape') {
          const mobileMenu = document.getElementById('nav-mobile');
          if (mobileMenu && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
          }
        }
      });
    }
  };

  // =========================================
  // COPY CODE SNIPPETS (utility)
  // =========================================

  const CodeCopy = {
    init() {
      document.querySelectorAll('.code-block').forEach(block => {
        const btn = document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.textContent = 'copy';
        btn.addEventListener('click', () => {
          const code = block.querySelector('code');
          if (!code) return;
          navigator.clipboard.writeText(code.textContent).then(() => {
            btn.textContent = 'copied!';
            setTimeout(() => { btn.textContent = 'copy'; }, 2000);
          }).catch(() => {});
        });
        block.style.position = 'relative';
        block.appendChild(btn);
      });
    }
  };

  // =========================================
  // INITIALIZATION
  // =========================================

  ready(() => {
    ThemeManager.init();
    ScrollProgress.init();
    Navigation.init();
    Animations.init();
    BackToTop.init();
    PartsAccordion.init();
    Hero.init();
    Contributors.init();
    TOC.init();
    KeyboardNav.init();
    CodeCopy.init();

    // Mark body as JS-loaded
    document.body.classList.add('js-loaded');
  });

})();