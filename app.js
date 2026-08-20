/* DentaFlow — sitio comercial: interacciones del cliente */
(function () {
  'use strict';

  // ---- Toast ----
  var toastEl = document.getElementById('toast');
  var toastTimer = null;
  function toast(msg, ok) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.style.borderColor = ok ? 'rgba(52,211,153,0.6)' : 'rgba(34,211,238,0.4)';
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 3800);
  }

  // ---- Año en footer ----
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ---- Nav móvil ----
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () { navLinks.classList.toggle('open'); });
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') navLinks.classList.remove('open');
    });
  }

  // ---- FAQ acordeón ----
  var faq = document.getElementById('faqList');
  if (faq) {
    faq.addEventListener('click', function (e) {
      var q = e.target.closest('.faq-q');
      if (!q) return;
      var item = q.parentElement;
      var ans = item.querySelector('.faq-a');
      var open = item.classList.toggle('open');
      ans.style.maxHeight = open ? (ans.scrollHeight + 'px') : '0px';
    });
  }

  // ---- Scroll reveal ----
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { obs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // ---- Lead desde botones de plan ----
  document.querySelectorAll('[data-lead]').forEach(function (b) {
    b.addEventListener('click', function () {
      var plan = b.getAttribute('data-lead');
      var sel = document.querySelector('#contact select[name="plan_interest"]');
      if (sel) sel.value = plan;
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      toast('Plan "' + plan + '" seleccionado — complétanos tus datos abajo 👇', true);
    });
  });

  // ---- Enviar formulario de contacto ----
  // VERSION ESTATICA (sin backend Node): usa Formsubmit.co para recibir leads por email.
  // CAMBIA EL EMAIL POR EL DE CONTACTO REAL de tu clínica/producto.
  var CONTACT_EMAIL = 'consultas@dentaflow.es'; // <-- EDITA AQUI
  var FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/' + CONTACT_EMAIL;

  var leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = leadForm.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Enviando…';
      var fd = new FormData(leadForm);
      fd.append('_subject', 'Nuevo lead DentaFlow');
      fd.append('_captcha', 'false');
      fetch(FORMSUBMIT_ENDPOINT, { method: 'POST', body: fd })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (res) {
          btn.disabled = false; btn.textContent = 'Enviar mensaje';
          if (res.success) {
            leadForm.reset();
            toast('¡Gracias! Te contactaremos pronto.', true);
          } else {
            toast('No se pudo enviar. Inténtalo de nuevo.', false);
          }
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = 'Enviar mensaje';
          toast('Error de red. Inténtalo más tarde.', false);
        });
    });
  }

  // ---- Newsletter ----
  var newsForm = document.getElementById('newsForm');
  if (newsForm) {
    newsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = newsForm.querySelector('input[name="email"]').value;
      var fd = new FormData();
      fd.append('email', email);
      fd.append('_subject', 'Nueva suscripción newsletter DentaFlow');
      fd.append('_captcha', 'false');
      fetch(FORMSUBMIT_ENDPOINT, { method: 'POST', body: fd })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (res) {
          if (res.success) { newsForm.reset(); toast('¡Suscrito!', true); }
          else toast('No se pudo suscribir.', false);
        })
        .catch(function () { toast('Error de red.', false); });
    });
  }
})();
