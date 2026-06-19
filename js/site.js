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

  // Formulario de demo
  var form = document.getElementById('demoForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    Array.prototype.forEach.call(form.querySelectorAll('.row, label, input, select, button[type="submit"], h3'), function (el) {
      el.style.display = 'none';
    });
    document.getElementById('formOk').classList.add('show');
  });
})();
