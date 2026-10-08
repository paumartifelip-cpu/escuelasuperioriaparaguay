(function () {
  'use strict';

  var form = document.getElementById('gate-form');
  var input = document.getElementById('password');
  var errorEl = document.getElementById('gate-error');
  var toggle = document.getElementById('toggle-pass');
  var card = document.querySelector('.intro-card');
  var MAX_ATTEMPTS = 5;
  var LOCK_MS = 15000;
  var attempts = 0;
  var lockedUntil = 0;

  document.getElementById('year').textContent = new Date().getFullYear();

  if (EsiaAuth.isLoggedIn()) {
    window.location.replace('escuela.html');
    return;
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
    input.setAttribute('aria-invalid', 'true');
    card.classList.remove('shake');
    void card.offsetWidth; // reinicia la animación
    card.classList.add('shake');
  }

  function clearError() {
    errorEl.hidden = true;
    input.removeAttribute('aria-invalid');
  }

  toggle.addEventListener('click', function () {
    var show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    toggle.textContent = show ? 'Ocultar' : 'Mostrar';
    toggle.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
  });

  input.addEventListener('input', clearError);

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var now = Date.now();
    if (now < lockedUntil) {
      showError('Demasiados intentos. Espera ' + Math.ceil((lockedUntil - now) / 1000) + ' s.');
      return;
    }

    var value = input.value.trim();
    if (!value) {
      showError('Introduce la contraseña.');
      return;
    }

    EsiaAuth.check(value).then(function (ok) {
      if (ok) {
        EsiaAuth.login();
        window.location.assign('escuela.html');
        return;
      }
      attempts += 1;
      if (attempts >= MAX_ATTEMPTS) {
        attempts = 0;
        lockedUntil = Date.now() + LOCK_MS;
        showError('Demasiados intentos. Espera ' + LOCK_MS / 1000 + ' s.');
      } else {
        showError('Contraseña incorrecta.');
      }
      input.select();
    });
  });
})();
