
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
      try{ localStorage.setItem(storageKey, now); }catch(e){ /* ignore */ }
    });
  }
})();


const button = document.getElementById('but');
button.addEventListener('click', function() {
  console.log('Gheorghe Rosca');
});