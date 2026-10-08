/* YouTube no reproduce vídeos incrustados desde file:// (error 153).
 * Si se abre como archivo y el servidor local está activo, reenvía a http://localhost. */
(function () {
  'use strict';
  if (location.protocol !== 'file:') return;

  var ORIGIN = 'http://127.0.0.1:8765';
  var path = location.pathname.split('/').pop() || 'index.html';
  var probe = new Image();
  probe.onload = function () { location.replace(ORIGIN + '/' + path + location.hash); };
  probe.src = ORIGIN + '/assets/favicon.svg?probe=' + Date.now();
})();
