(function(){
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const storageKey = 'site-theme';

  function applyTheme(theme){
    if(theme === 'dark'){
      root.setAttribute('data-theme','dark');
    } else {
      root.removeAttribute('data-theme');
    }
    if(toggle){
      toggle.textContent = theme === 'dark' ? '🌙' : '🌞';
      toggle.setAttribute('aria-pressed', theme === 'dark');
    }
  }

  function currentStored(){
    try{ return localStorage.getItem(storageKey); }catch(e){ return null; }
  }

  const stored = currentStored();
  if(stored){
    applyTheme(stored);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  if(toggle){
    toggle.addEventListener('click', function(){
      const now = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(now);
      try{ localStorage.setItem(storageKey, now); }catch(e){  }
    });
  }

  function runEntrance() {
    const targets = document.querySelectorAll('.page, .about-page, .contact-container');
    if(!targets || targets.length === 0) return;

    window.setTimeout(() => {
      targets.forEach(el => el.classList.add('loaded'));
    }, 80);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runEntrance);
  } else {
    runEntrance();
  }
})();


const CATEGORIES = ['shirts', 'pants', 'shoes'];

function doSearch(query) {
  if (!query) return;
  const q = query.trim().toLowerCase();

  
  const matched = CATEGORIES.find(cat => q.includes(cat) || cat.includes(q));

  if (matched) {
    
    window.location.href = 'Home.html?category=' + matched;
  } else {
    
    window.location.href = 'Home.html?search=' + encodeURIComponent(query.trim());
  }
}

const searchInput = document.getElementById('search-input');
const searchHint  = document.getElementById('search-hint');
const searchBtn   = searchInput && searchInput.closest('.search-box')
                      ? searchInput.closest('.search-box').querySelector('button')
                      : null;

if (searchInput) {
  
  searchInput.addEventListener('input', () => {
    if (searchHint) {
      if (searchInput.value.trim().length > 0) {
        searchHint.textContent = 'interested in ' + searchInput.value + ' polo shirt';
        searchHint.classList.add('visible');
      } else {
        searchHint.classList.remove('visible');
      }
    }
  });

  
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      doSearch(searchInput.value);
    }
  });
}


if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    doSearch(searchInput.value);
  });
}


const button = document.getElementById('but');
if (button) {
  button.addEventListener('click', function() {
    console.log('Gheorghe Rosca');
  });
}