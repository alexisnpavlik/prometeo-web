// Prometeo — interacciones
(function () {
  // Nav: fondo al scrollear
  var nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menú móvil
  var burger = document.getElementById('navBurger');
  var links = document.getElementById('navLinks');
  burger.addEventListener('click', function () {
    links.classList.toggle('open');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') links.classList.remove('open');
  });

  // Aparición al scrollear — IO con respaldo por scroll (nunca dejar contenido oculto)
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  function revealCheck() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    revealEls = revealEls.filter(function (el) {
      if (el.getBoundingClientRect().top < vh - 40) {
        el.classList.add('in');
        return false;
      }
      return true;
    });
  }

  var revealTimer = null;
  function onRevealScroll() {
    if (!revealEls.length) return;
    revealCheck();
    if (revealTimer) return;
    revealTimer = setTimeout(function () {
      revealTimer = null;
      revealCheck();
    }, 120);
  }
  window.addEventListener('scroll', onRevealScroll, { passive: true });
  window.addEventListener('resize', onRevealScroll, { passive: true });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Chequeo inicial (lo visible aparece sin necesidad de scroll ni IO)
  revealCheck();
  setTimeout(revealCheck, 400);

  // Formulario de demo — envío real vía Web3Forms
  var form = document.getElementById('demoForm');
  var btn = document.getElementById('formSubmit');
  var err = document.getElementById('formErr');
  var btnLabel = btn.textContent;

  function showSuccess() {
    Array.prototype.forEach.call(form.querySelectorAll('.row, label, input, select, button[type="submit"], h3, .form-err'), function (el) {
      el.style.display = 'none';
    });
    document.getElementById('formOk').classList.add('show');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    err.classList.remove('show');

    // En producción el deploy reemplaza el placeholder por el secret.
    // En local se toma de localStorage: localStorage.setItem('w3fkey','...')
    var keyField = form.querySelector('input[name="access_key"]');
    if (keyField.value === '__WEB3FORMS_KEY__') {
      var devKey = window.localStorage && localStorage.getItem('w3fkey');
      if (!devKey) {
        console.warn('[Prometeo] Sin access key. Para probar en local: localStorage.setItem("w3fkey","tu-key") y recargá.');
        err.classList.add('show');
        return;
      }
      keyField.value = devKey;
    }

    btn.disabled = true;
    btn.textContent = 'Enviando…';

    fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          showSuccess();
        } else {
          throw new Error(data.message || 'error');
        }
      })
      .catch(function () {
        err.classList.add('show');
        btn.disabled = false;
        btn.textContent = btnLabel;
      });
  });
})();
