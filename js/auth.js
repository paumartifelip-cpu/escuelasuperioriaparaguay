/* Autenticación sencilla del lado del cliente.
 * AVISO: al ser un sitio estático, esto es una barrera de acceso básica,
 * no seguridad real. Para protección real hace falta un servidor. */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'esia_auth_v1';
  // SHA-256 de las contraseñas válidas. Para añadir o quitar una: edita esta lista.
  var PASSWORD_HASHES = [
    '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
    '09dfc4a807d96623e89cd60f6475745dc4c2ff810516f6bd21cf2db5c60d8486',
    '080db1345b5f5746ccb69f3e7fc047dd8fcc8293f8c950889ae38e216b119e42'
  ];
  var PASSWORD_PLAIN_FALLBACK = '1234'; // solo si el navegador no soporta crypto.subtle

  function safeSession() {
    try { return global.sessionStorage; } catch (e) { return null; }
  }

  function sha256Hex(text) {
    var subtle = global.crypto && global.crypto.subtle;
    if (!subtle || !global.TextEncoder) return Promise.resolve(null);
    return subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return b.toString(16).padStart(2, '0');
      }).join('');
    }).catch(function () { return null; });
  }

  function check(password) {
    return sha256Hex(password).then(function (hex) {
      return hex === null ? password === PASSWORD_PLAIN_FALLBACK : PASSWORD_HASHES.indexOf(hex) !== -1;
    });
  }

  function login() {
    var s = safeSession();
    if (s) s.setItem(STORAGE_KEY, '1');
    // Respaldo si sessionStorage no está disponible: se pasa por nombre de ventana.
    else global.name = STORAGE_KEY;
  }

  function isLoggedIn() {
    var s = safeSession();
    return (s && s.getItem(STORAGE_KEY) === '1') || global.name === STORAGE_KEY;
  }

  function logout() {
    var s = safeSession();
    if (s) s.removeItem(STORAGE_KEY);
    if (global.name === STORAGE_KEY) global.name = '';
  }

  global.EsiaAuth = { check: check, login: login, logout: logout, isLoggedIn: isLoggedIn };
})(window);
