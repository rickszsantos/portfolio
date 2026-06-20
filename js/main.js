// main.js — navigation, scroll behavior, animations
 
const App = (() => {
 
  // ── Smooth scroll for nav links ──────────────────────────────
  function initNavLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile menu if open
        navMenu.classList.remove('open');
      });
    });
  }
 
  // ── Mobile nav toggle ────────────────────────────────────────
  const navMenu = document.getElementById('nav-menu') || { classList: { remove: () => {} } };
 
  function initMobileMenu() {
    const toggle = document.getElementById('nav-hamburger');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
  }
 
  // ── Active nav link on scroll ────────────────────────────────
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
 
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
 
    sections.forEach(s => observer.observe(s));
  }
 
  // ── Scroll-reveal animations ─────────────────────────────────
  function initReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
 
    elements.forEach(el => observer.observe(el));
  }
 
  // ── Sticky nav shadow on scroll ──────────────────────────────
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }
 
  // ── Hero typing effect (subtle, just the role) ───────────────
  function initTyping() {
    const el = document.getElementById('hero-role');
    if (!el) return;
    const text = el.textContent;
    el.textContent = '';
    el.style.opacity = '1';
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) clearInterval(interval);
    }, 55);
  }
 
  // ── Contact form (no-op, opens mailto) ──────────────────────
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value;
      const email = form.querySelector('[name="email"]').value;
      const msg = form.querySelector('[name="message"]').value;
      window.location.href = `mailto:carloshenriquesantospelegrini@gmail.com?subject=Portfolio - ${encodeURIComponent(name)}&body=${encodeURIComponent(msg)}%0A%0A${encodeURIComponent(email)}`;
    });
  }
 
  function init() {
    initNavLinks();
    initMobileMenu();
    initScrollSpy();
    initReveal();
    initNavScroll();
    initTyping();
    initContactForm();
  }
 
  return { init };
})();
 
document.addEventListener('DOMContentLoaded', () => {
  themeManager.init();
  App.init();
  i18n.init();
});
 