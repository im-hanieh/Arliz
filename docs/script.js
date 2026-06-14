;(function () {
  'use strict';

  const REPO = 'papyrxis/Arliz';
  const GH = 'https://api.github.com';

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  function fmt(n) {
    if (typeof n !== 'number') return '—';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  }

  const Theme = {
    key: 'arliz-theme',
    current: 'dark',

    init() {
      const saved = localStorage.getItem(this.key);
      const sys = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      this.apply(saved || sys);

      const btn = $('#theme-toggle');
      if (btn) btn.addEventListener('click', () => this.toggle());
    },

    apply(t) {
      this.current = t;
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem(this.key, t);

      const icon = $('#theme-icon');
      if (icon) icon.textContent = t === 'dark' ? '☀' : '◑';

      const btn = $('#theme-toggle');
      if (btn) btn.setAttribute('aria-label', `Switch to ${t === 'dark' ? 'light' : 'dark'} mode`);
    },

    toggle() {
      this.apply(this.current === 'dark' ? 'light' : 'dark');
    }
  };

  const Progress = {
    bar: null,
    init() {
      this.bar = $('#scroll-progress');
      if (!this.bar) return;

      window.addEventListener('scroll', () => {
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const pct = height > 0 ? (window.scrollY / height) * 100 : 0;
        this.bar.style.width = Math.min(pct, 100) + '%';
      }, { passive: true });
    }
  };

  const Nav = {
    el: null,
    last: 0,
    ticking: false,
    mobileOpen: false,

    init() {
      this.el = $('.nav');
      if (!this.el) return;

      window.addEventListener('scroll', () => {
        if (!this.ticking) {
          requestAnimationFrame(() => {
            this.onScroll();
            this.ticking = false;
          });
          this.ticking = true;
        }
      }, { passive: true });

      window.addEventListener('scroll', () => this.highlightLinks(), { passive: true });

      const ham = $('#hamburger');
      const menu = $('#mobile-nav');
      if (ham && menu) {
        ham.addEventListener('click', () => {
          this.mobileOpen = !this.mobileOpen;
          menu.classList.toggle('open', this.mobileOpen);
          ham.setAttribute('aria-expanded', this.mobileOpen);
        });

        $$('.nav-link', menu).forEach(link => {
          link.addEventListener('click', () => {
            this.mobileOpen = false;
            menu.classList.remove('open');
            ham.setAttribute('aria-expanded', 'false');
          });
        });
      }

      $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          const href = a.getAttribute('href');
          const target = href ? $(href) : null;
          if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
          }
        });
      });

      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && this.mobileOpen) {
          this.mobileOpen = false;
          const menuEl = $('#mobile-nav');
          const hamEl = $('#hamburger');
          if (menuEl) menuEl.classList.remove('open');
          if (hamEl) hamEl.setAttribute('aria-expanded', 'false');
        }
      });
    },

    onScroll() {
      const y = window.scrollY;
      if (y > 120) {
        this.el.classList.toggle('hide', y > this.last);
      } else {
        this.el.classList.remove('hide');
      }
      this.last = y;

      const btt = $('#btt');
      if (btt) btt.classList.toggle('show', y > 400);
    },

    highlightLinks() {
      const sections = $$('section[id]');
      const mid = window.scrollY + window.innerHeight / 3;
      let active = '';

      sections.forEach(section => {
        if (section.offsetTop <= mid) active = '#' + section.id;
      });

      $$('.nav-link[href^="#"]').forEach(link => {
        link.classList.toggle('on', link.getAttribute('href') === active);
      });
    }
  };

  const BTT = {
    init() {
      const btn = $('#btt');
      if (btn) btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  };

  const Anim = {
    init() {
      if (!('IntersectionObserver' in window)) {
        $$('.fade-up').forEach(el => el.classList.add('in'));
        return;
      }

      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

      $$('.fade-up').forEach(el => obs.observe(el));
    }
  };

  const GHApi = {
    async fetchRepo() {
      try {
        const res = await fetch(`${GH}/repos/${REPO}`);
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    },

    async fetchContributors() {
      try {
        const res = await fetch(`${GH}/repos/${REPO}/contributors?per_page=30`);
        if (!res.ok) return [];
        return await res.json();
      } catch {
        return [];
      }
    },

    async fetchUserBio(login) {
      try {
        const res = await fetch(`${GH}/users/${login}`);
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    },

    async init() {
      const [repo, contributors] = await Promise.all([
        this.fetchRepo(),
        this.fetchContributors()
      ]);

      if (repo) this.renderRepoStats(repo);
      if (contributors.length) await this.renderContributors(contributors);
    },

    renderRepoStats(repo) {
      const stats = {
        '#stat-stars': repo.stargazers_count,
        '#stat-forks': repo.forks_count,
        '#stat-issues': repo.open_issues_count,
        '#stat-watchers': repo.subscribers_count,
        '#hero-stars': repo.stargazers_count
      };

      Object.entries(stats).forEach(([selector, value]) => {
        const el = $(selector);
        if (!el) return;
        el.textContent = fmt(value);
        el.classList.remove('loading-pulse');
      });
    },

    async renderContributors(list) {
      const container = $('#contributors-grid');
      if (!container) return;

      const top = list.slice(0, 12);
      const users = await Promise.all(top.map(c => this.fetchUserBio(c.login)));
      container.innerHTML = '';

      top.forEach((contrib, i) => {
        const user = users[i];
        const isAuthor = contrib.login === 'm-mdy-m';
        const name = user?.name || contrib.login;
        const bio = isAuthor
          ? 'Backend engineer and open-source developer. Author of ARLIZ. CS student.'
          : (user?.bio || 'Open source contributor to the ARLIZ project.');
        const role = isAuthor ? 'Author & Maintainer' : 'Contributor';
        const initials = name.charAt(0).toUpperCase();

        const card = document.createElement('div');
        card.className = 'contrib-card fade-up' + (isAuthor ? ' main-author' : '') + ' d' + Math.min(i + 1, 6);
        card.innerHTML = `
          <div class="contrib-top">
            <div class="contrib-av" data-login="${contrib.login}">
              <span class="contrib-init">${initials}</span>
            </div>
            <div>
              <div class="contrib-name">
                ${name}${isAuthor ? ' <span class="author-badge">AUTHOR</span>' : ''}
              </div>
              <div class="contrib-role">${role}</div>
            </div>
          </div>
          <p class="contrib-bio">${bio}</p>
          <div class="contrib-links">
            <a href="https://github.com/${contrib.login}" class="c-link" target="_blank" rel="noopener" aria-label="GitHub profile of ${name}">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              @${contrib.login}
            </a>
            ${contrib.contributions ? `<span class="c-link" style="cursor:default">${contrib.contributions} commits</span>` : ''}
          </div>
        `;

        container.appendChild(card);

        const av = card.querySelector('.contrib-av');
        const img = new Image();
        img.src = `https://avatars.githubusercontent.com/u/${contrib.id}?v=4&s=96`;
        img.alt = name;
        img.loading = 'lazy';
        img.addEventListener('load', () => {
          const span = av.querySelector('.contrib-init');
          if (span) span.remove();
          av.appendChild(img);
        });
      });

      if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.08 });

        $$('.contrib-card.fade-up').forEach(el => obs.observe(el));
      } else {
        $$('.contrib-card.fade-up').forEach(el => el.classList.add('in'));
      }
    }
  };

  function boot() {
    Theme.init();
    Progress.init();
    Nav.init();
    BTT.init();
    Anim.init();
    GHApi.init();
  }

  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();