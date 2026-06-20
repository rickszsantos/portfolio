// Fetches JSON data files and swaps all [data-i18n] elements in the DOM
 
const i18n = (() => {
  let currentLang = 'pt';
  let translations = {};
 
  async function load(lang) {
    const res = await fetch(`data/${lang}.json`);
    if (!res.ok) throw new Error(`Failed to load ${lang}.json`);
    return await res.json();
  }
 
  function resolve(obj, path) {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
  }
 
  function applyTranslations() {
    const t = translations;
 
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = resolve(t, key);
      if (value !== null) el.textContent = value;
    });
 
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const value = resolve(t, key);
      if (value !== null) el.setAttribute('placeholder', value);
    });
 
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const value = resolve(t, key);
      if (value !== null) el.setAttribute('aria-label', value);
    });
 
    // Render stack categories dynamically
    renderStack(t);
 
    // Render projects dynamically
    renderProjects(t);
 
    // Update lang toggle button
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = currentLang === 'pt' ? 'EN' : 'PT';
 
    document.documentElement.lang = currentLang;
  }
 
  function renderStack(t) {
    const container = document.getElementById('stack-grid');
    if (!container || !t.stack) return;
 
    const categories = t.stack.categories;
    const items = t.stack.items;
 
    container.innerHTML = Object.keys(categories).map(cat => `
      <div class="stack-category">
        <h3 class="stack-cat-label">${categories[cat]}</h3>
        <ul class="stack-list">
          ${(items[cat] || []).map(tech => `
            <li class="stack-badge">${tech}</li>
          `).join('')}
        </ul>
      </div>
    `).join('');
  }
 
  function renderProjects(t) {
    const container = document.getElementById('projects-grid');
    if (!container || !t.projects) return;
 
    const { items, labels } = t.projects;
 
    container.innerHTML = items.map(project => `
      <article class="project-card" data-id="${project.id}">
        <header class="project-header">
          <span class="project-status">${project.status}</span>
          <h3 class="project-name">${project.name}</h3>
          <p class="project-desc">${project.description}</p>
        </header>
        <div class="project-highlights">
          <span class="highlights-label">${labels.highlights}</span>
          <ul>
            ${project.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        </div>
        <footer class="project-footer">
          <div class="project-tech">
            ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
          <div class="project-links">
            <a href="${project.github}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              ${labels.github}
            </a>
            ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">${labels.demo} ↗</a>` : ''}
          </div>
        </footer>
      </article>
    `).join('');
  }
 
  async function setLang(lang) {
    translations = await load(lang);
    currentLang = lang;
    applyTranslations();
  }
 
  async function toggle() {
    await setLang(currentLang === 'pt' ? 'en' : 'pt');
  }
 
  async function init() {
    await setLang('pt');
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.addEventListener('click', toggle);
  }
 
  return { init, toggle, get: () => currentLang };
})();
 