/* Tema claro/oscuro. Se carga en <head> para evitar parpadeos. */
(function () {
  'use strict';

  var KEY = 'esia_theme_v1';
  var root = document.documentElement;

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function systemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  function current() { return root.getAttribute('data-theme') || 'dark'; }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#ffffff' : '#242527');
    var btn = document.getElementById('theme-btn');
    if (btn) {
      var dark = theme === 'dark';
      btn.setAttribute('aria-checked', dark ? 'true' : 'false');
      btn.setAttribute('title', dark ? 'Modo oscuro activado' : 'Modo claro activado');
      var knob = btn.querySelector('.switch-knob');
      if (knob) knob.textContent = dark ? '🌙' : '☀️';
    }
  }

  function toggle() {
    var next = current() === 'light' ? 'dark' : 'light';
    try { localStorage.setItem(KEY, next); } catch (e) { /* sin almacenamiento */ }
    apply(next);
  }

  apply(stored() || systemTheme());

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-btn');
    if (btn) btn.addEventListener('click', toggle);
    apply(current());
  });
})();
