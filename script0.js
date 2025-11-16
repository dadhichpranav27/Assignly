const __loaderStart = Date.now();
function hideLoaderGracefully(minVisibleMs = 1500) {
  const loader = document.querySelector('.loader_wrapper');
  if (!loader) return;

  const elapsed = Date.now() - __loaderStart;
  const remaining = Math.max(0, minVisibleMs - elapsed);

  setTimeout(() => {
    loader.classList.add('fade-out');
    loader.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'opacity') {
        loader.style.display = 'none';
      }
    });
  }, remaining);
}

window.addEventListener('load', () => {
  hideLoaderGracefully();

  const body = document.body;
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
  }
});

const loader = document.querySelector('.loader_wrapper'); // add this


  const toggle = document.getElementById("darkModeToggle");
  const body = document.body;
  const conta= document.querySelector('.container_body');
  // restore preference if saved
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  conta.classList.add('dark-mode');
  if(loader) loader.classList.add('dark-mode');
  toggle.checked = true;
}
  toggle.addEventListener("change", () => {
  if (toggle.checked) {
    body.classList.add("dark-mode");
    conta.classList.add('dark-mode');
    if(loader) loader.classList.add('dark-mode');
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("dark-mode");
    conta.classList.remove('dark-mode');
    if(loader) loader.classList.remove('dark-mode');
    localStorage.setItem("theme", "light");
  }
});

function showSidenav() {
  document.querySelector('.sidenav').classList.add('active');
}
function hideSidenav() {
  document.querySelector('.sidenav').classList.remove('active');
}


window.addEventListener("scroll", () => {
  document.querySelector("nav").classList.toggle("scrolled", window.scrollY > 10);
});


const sidenav = document.querySelector('.sidenav');
const overlay = document.querySelector('.overlay');
const menuBtn = document.querySelector('.menu_btn');

// Open sidenav
function showSidenav() {
  sidenav.classList.add('active');
  if (overlay) overlay.classList.add('active');
}

// Close sidenav
function hideSidenav() {
  sidenav.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}

// Event: Close sidenav when overlay is clicked
if (overlay) {
  overlay.addEventListener('click', hideSidenav);
}

// Stop clicks inside sidenav from closing it (optional)
sidenav.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Automatically close sidenav when any link inside it is clicked
const sidenavLinks = sidenav.querySelectorAll('a');
sidenavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hideSidenav();
  });
});

(function () {
  // config
  const MIN_VISIBLE_MS = 1700;         // minimum loader visible time (adjust if needed)
  const LOADER_FADE_MS = 800;          // must match your CSS transition: opacity 0.8s
  const loader = document.querySelector('.loader_wrapper');
  const logo = document.querySelector('.logo_ani');
  const startTimestamp = window.__loaderStart || performance.now();

  function startLogoAnimation() {
    if (!logo) return;
    logo.classList.add('start-logo');
  }

  function hideLoaderAndStartLogo() {
    if (!loader) {
      // no loader: start logo immediately
      startLogoAnimation();
      return;
    }

    const elapsed = performance.now() - startTimestamp;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    // wait remaining, then fade loader out and start logo when fade ends
    setTimeout(() => {
      loader.classList.add('fade-out');

      // when fade completes (opacity transition), remove loader and start logo
      loader.addEventListener('transitionend', function onEnd(e) {
        if (e.propertyName === 'opacity') {
          // optional: fully remove from document flow
          try { loader.style.display = 'none'; } catch (err) {}
          startLogoAnimation();
        }
      }, { once: true });
    }, remaining);
  }

  // Run when page fully loaded
  if (document.readyState === 'complete') {
    hideLoaderAndStartLogo();
  } else {
    window.addEventListener('load', hideLoaderAndStartLogo);
  }
})();