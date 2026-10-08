(function () {
  'use strict';

  var COURSES = window.ESIA_COURSES;
  var WATCHED_KEY = 'esia_watched_v1';
  var LAST_KEY = 'esia_last_v1';

  /* ---------- Datos ---------- */
  var videos = [];
  var modulesById = {};
  var coursesById = {};
  COURSES.forEach(function (c) {
    coursesById[c.id] = c;
    c.n = COURSES.indexOf(c) + 1;
    c.videos = [];
    var n = 0;
    c.modules.forEach(function (m, mi) {
      m.n = mi + 1;
      modulesById[m.id] = { module: m, course: c };
      m.videos.forEach(function (v) {
        n += 1;
        var item = {
          id: v.id, title: v.title, n: n,
          moduleId: m.id, moduleN: m.n, moduleTitle: m.title,
          courseId: c.id, courseTitle: c.title
        };
        videos.push(item);
        c.videos.push(item);
      });
    });
  });
  var byId = {};
  videos.forEach(function (v) { byId[v.id] = v; });

  /* ---------- Progreso (localStorage tolerante a fallos) ---------- */
  var watched = {};
  try { watched = JSON.parse(localStorage.getItem(WATCHED_KEY)) || {}; } catch (e) { watched = {}; }
  function saveWatched() {
    try { localStorage.setItem(WATCHED_KEY, JSON.stringify(watched)); } catch (e) { /* sin almacenamiento */ }
  }
  function getLast() {
    try { var id = localStorage.getItem(LAST_KEY); return id && byId[id] ? byId[id] : null; } catch (e) { return null; }
  }
  function setLast(id) {
    try { localStorage.setItem(LAST_KEY, id); } catch (e) { /* sin almacenamiento */ }
  }
  function toggleWatched(id) {
    if (watched[id]) delete watched[id]; else watched[id] = 1;
    saveWatched();
  }

  /* ---------- Utilidades DOM ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var val = attrs[k];
      if (val === null || val === undefined || val === false) return;
      if (k === 'class') node.className = val;
      else if (k === 'text') node.textContent = val;
      else if (k.indexOf('on') === 0) node.addEventListener(k.slice(2), val);
      else node.setAttribute(k, val === true ? '' : val);
    });
    (children || []).forEach(function (c) {
      if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function normalize(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function thumbUrl(id) { return 'https://i.ytimg.com/vi/' + encodeURIComponent(id) + '/hqdefault.jpg'; }
  function embedUrl(id) {
    return 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?rel=0&modestbranding=1';
  }
  function watchLink(id) { return '#/watch/' + id; }

  var viewEl = document.getElementById('view');
  var sidebarEl = document.getElementById('sidebar');
  var backdropEl = document.getElementById('backdrop');
  var menuBtn = document.getElementById('menu-btn');
  var searchInput = document.getElementById('search');

  /* ---------- Progreso por curso / módulo ---------- */
  function stats(list) {
    var done = list.filter(function (v) { return watched[v.id]; }).length;
    return { done: done, total: list.length, pct: list.length ? Math.round((done / list.length) * 100) : 0 };
  }
  function moduleVideos(c, m) { return c.videos.filter(function (v) { return v.moduleId === m.id; }); }
  function nextLesson(c) {
    return c.videos.filter(function (v) { return !watched[v.id]; })[0] || null;
  }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  /* ---------- Componentes ---------- */
  function progressBlock(courseId) {
    return el('div', { class: 'progress-block' }, [
      el('div', { class: 'bar', role: 'presentation' }, [el('span', { class: 'js-bar', 'data-course': courseId })]),
      el('span', { class: 'js-ptext progress-text', 'data-course': courseId })
    ]);
  }

  /* Actualiza barras, contadores y menú tras marcar/desmarcar. */
  function refreshProgress() {
    COURSES.forEach(function (c) {
      var st = stats(c.videos);
      Array.prototype.forEach.call(document.querySelectorAll('.js-bar[data-course="' + c.id + '"]'), function (n) { n.style.width = st.pct + '%'; });
      Array.prototype.forEach.call(document.querySelectorAll('.js-ptext[data-course="' + c.id + '"]'), function (n) {
        n.textContent = st.done + ' de ' + st.total + ' lecciones · ' + st.pct + '%';
      });
      c.modules.forEach(function (m) {
        var ms = stats(moduleVideos(c, m));
        Array.prototype.forEach.call(document.querySelectorAll('.js-count[data-module="' + m.id + '"]'), function (n) {
          n.textContent = ms.done + '/' + ms.total;
          n.classList.toggle('complete', ms.done === ms.total);
        });
      });
    });
  }

  /* Botón de "visto" (círculo discreto) reutilizable. */
  function checkBtn(id) {
    var btn = el('button', { class: 'check', type: 'button', 'data-id': id });
    paintCheck(btn);
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleWatched(id);
      syncSeen(id);
    });
    return btn;
  }

  function paintCheck(btn) {
    var on = !!watched[btn.getAttribute('data-id')];
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'Marcar como no vista' : 'Marcar como vista');
    btn.setAttribute('title', on ? 'Vista · clic para desmarcar' : 'Marcar como vista');
  }

  function paintMainSeen(btn) {
    var on = !!watched[btn.getAttribute('data-id')];
    btn.className = 'btn seen-main ' + (on ? 'btn-ghost' : 'btn-secondary');
    btn.textContent = on ? '✓ Vista' : 'Marcar como vista';
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  /* Sincroniza todos los indicadores de una lección sin volver a pintar la vista. */
  function syncSeen(id) {
    var on = !!watched[id];
    Array.prototype.forEach.call(document.querySelectorAll('.check[data-id="' + id + '"]'), paintCheck);
    Array.prototype.forEach.call(document.querySelectorAll('.seen-main[data-id="' + id + '"]'), paintMainSeen);
    Array.prototype.forEach.call(document.querySelectorAll('[data-item="' + id + '"]'), function (n) { n.classList.toggle('seen', on); });
    refreshProgress();
    renderSidebar(currentRoute);
  }

  function thumb(id, cls) {
    var img = el('img', { src: thumbUrl(id), alt: '', loading: 'lazy', decoding: 'async' });
    img.addEventListener('error', function () { img.classList.add('thumb-fallback'); img.removeAttribute('src'); });
    return el('div', { class: 'thumb ' + (cls || '') }, [img]);
  }

  /* Fila de lección: número de paso, miniatura, título y marca de visto. */
  function lessonRow(v, opts) {
    opts = opts || {};
    return el('li', { class: 'lesson' + (watched[v.id] ? ' seen' : '') + (opts.current ? ' current' : ''), 'data-item': v.id }, [
      el('a', { class: 'lesson-link', href: watchLink(v.id), 'aria-current': opts.current ? 'true' : null }, [
        el('span', { class: 'step', 'aria-hidden': 'true', text: String(opts.stepLabel || v.n) }),
        opts.compact ? null : thumb(v.id, 'thumb-sm'),
        el('span', { class: 'lesson-text' }, [
          el('span', { class: 'lesson-title', text: v.title }),
          opts.sub ? el('span', { class: 'lesson-sub', text: opts.sub }) : null
        ])
      ]),
      checkBtn(v.id)
    ]);
  }

  function renderSidebar(route) {
    var activeVideo = route.name === 'watch' ? byId[route.id] : null;
    var activeCourse = activeVideo ? activeVideo.courseId : (route.course || null);
    var all = stats(videos);

    sidebarEl.textContent = '';
    var items = [navItem('', 'Mis cursos', '#/', route.name === 'home' && !route.course && !route.q)];
    items.push(el('p', { class: 'side-title', text: 'Cursos' }));
    COURSES.forEach(function (c) {
      var st = stats(c.videos);
      items.push(navItem(String(c.n), c.title, '#/curso/' + c.id, activeCourse === c.id, c.level + ' · ' + st.done + ' de ' + st.total + ' lecciones'));
    });
    items.push(el('p', { class: 'side-title', text: 'Tu progreso' }));
    items.push(el('div', { class: 'progress' }, [
      el('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(all.pct) }, [
        el('span', { style: 'width:' + all.pct + '%' })
      ]),
      el('p', { class: 'progress-text', text: all.done + ' de ' + all.total + ' lecciones (' + all.pct + '%)' })
    ]));
    items.push(el('button', { class: 'side-item side-logout', type: 'button', onclick: logout }, [
      el('span', { class: 'side-label', text: 'Cerrar sesión' })
    ]));
    sidebarEl.appendChild(el('nav', {}, items));
  }

  function navItem(icon, label, href, active, sub) {
    return el('a', { class: 'side-item' + (active ? ' active' : ''), href: href, 'aria-current': active ? 'page' : null }, [
      icon ? el('span', { class: 'side-num', 'aria-hidden': 'true', text: icon }) : null,
      el('span', { class: 'side-label' }, [
        el('span', { text: label }),
        sub ? el('small', { class: 'side-sub', text: sub }) : null
      ])
    ]);
  }

  /* ---------- Vistas ---------- */
  function renderHome(route) {
    if (route.q) { renderSearch(route); return; }

    var last = getLast();
    var blocks = [
      el('h1', { class: 'view-title', text: 'Mis cursos' }),
      el('p', { class: 'lead-line', text: 'Sigue los cursos en orden, del 1 al ' + COURSES.length + ': van de menos a más dificultad.' })
    ];

    if (last && !watched[last.id]) {
      blocks.push(el('a', { class: 'resume', href: watchLink(last.id) }, [
        thumb(last.id, 'thumb-sm'),
        el('span', { class: 'lesson-text' }, [
          el('span', { class: 'eyebrow', text: 'Continúa donde lo dejaste' }),
          el('span', { class: 'lesson-title', text: last.title }),
          el('span', { class: 'lesson-sub', text: last.courseTitle + ' · Módulo ' + last.moduleN })
        ]),
        el('span', { class: 'btn btn-primary', text: 'Continuar →' })
      ]));
    }

    blocks.push(el('div', { class: 'courses' }, COURSES.map(courseCard)));
    setView(blocks, 'Mis cursos');
    refreshProgress();
  }

  function courseCard(c) {
    var st = stats(c.videos);
    var next = nextLesson(c);
    var label = st.done === 0 ? 'Empezar curso' : (next ? 'Continuar' : 'Repasar');
    return el('article', { class: 'course-card' }, [
      el('p', { class: 'eyebrow', text: 'Curso ' + c.n + ' · ' + c.level }),
      el('h2', { class: 'course-title', text: c.title }),
      el('p', { class: 'course-desc', text: c.desc }),
      el('p', { class: 'course-meta', text: plural(c.modules.length, 'módulo', 'módulos') + ' · ' + plural(c.videos.length, 'lección', 'lecciones') }),
      progressBlock(c.id),
      el('div', { class: 'course-actions' }, [
        el('a', { class: 'btn btn-primary', href: watchLink((next || c.videos[0]).id), text: label }),
        el('a', { class: 'btn btn-ghost', href: '#/curso/' + c.id, text: 'Ver temario' })
      ])
    ]);
  }

  function renderCourse(courseId) {
    var c = coursesById[courseId];
    if (!c) { renderNotFound(); return; }
    var st = stats(c.videos);
    var next = nextLesson(c);

    var blocks = [
      el('a', { class: 'crumb', href: '#/', text: '← Mis cursos' }),
      el('header', { class: 'course-head' }, [
        el('div', {}, [
          el('p', { class: 'eyebrow', text: 'Curso ' + c.n + ' · ' + c.level }),
          el('h1', { class: 'view-title', text: c.title }),
          el('p', { class: 'course-desc', text: c.desc }),
          el('p', { class: 'course-meta', text: plural(c.modules.length, 'módulo', 'módulos') + ' · ' + plural(c.videos.length, 'lección', 'lecciones') }),
          progressBlock(c.id)
        ]),
        el('a', { class: 'btn btn-primary', href: watchLink((next || c.videos[0]).id), text: st.done === 0 ? 'Empezar curso' : (next ? 'Continuar →' : 'Repasar') })
      ])
    ];

    c.modules.forEach(function (m) {
      blocks.push(el('section', { class: 'module' }, [
        el('header', { class: 'module-head' }, [
          el('div', {}, [
            el('p', { class: 'eyebrow', text: 'Módulo ' + m.n }),
            el('h2', { class: 'module-title', text: m.title })
          ]),
          el('span', { class: 'count js-count', 'data-module': m.id })
        ]),
        el('ol', { class: 'lessons' }, moduleVideos(c, m).map(function (v, i) {
          return lessonRow(v);
        }))
      ]));
    });

    setView(blocks, c.title);
    refreshProgress();
  }

  function renderSearch(route) {
    var query = normalize(route.q);
    var list = videos.filter(function (v) {
      return normalize(v.title + ' ' + v.moduleTitle + ' ' + v.courseTitle).indexOf(query) !== -1;
    });
    var heading = 'Resultados para “' + route.q + '”';
    var body = list.length
      ? el('ol', { class: 'lessons lessons-flat' }, list.map(function (v) {
          return lessonRow(v, { sub: v.courseTitle + ' · Módulo ' + v.moduleN });
        }))
      : el('div', { class: 'empty' }, [
          el('p', { class: 'empty-icon', text: '🔎' }),
          el('p', { text: 'No hay lecciones que coincidan con tu búsqueda.' })
        ]);
    setView([el('h1', { class: 'view-title', text: heading }), body], heading, route.live);
  }

  function renderWatch(id) {
    var v = byId[id];
    if (!v) { renderNotFound(); return; }
    setLast(v.id);
    var c = coursesById[v.courseId];
    var idx = c.videos.indexOf(v);
    var prev = c.videos[idx - 1];
    var next = c.videos[idx + 1];

    var iframe = el('iframe', {
      src: embedUrl(v.id), title: v.title, loading: 'lazy',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      referrerpolicy: 'strict-origin-when-cross-origin', allowfullscreen: true
    });

    var seenBtn = el('button', { type: 'button', 'data-id': v.id });
    paintMainSeen(seenBtn);
    seenBtn.addEventListener('click', function () { toggleWatched(v.id); syncSeen(v.id); });

    var completeBtn = el('button', { class: 'btn btn-primary', type: 'button', text: next ? 'Completar y continuar →' : 'Completar curso ✓' });
    completeBtn.addEventListener('click', function () {
      if (!watched[v.id]) { toggleWatched(v.id); }
      window.location.hash = next ? watchLink(next.id) : '#/curso/' + c.id;
    });

    var main = el('section', { class: 'watch-main' }, [
      el('div', { class: 'player' }, [iframe]),
      el('p', { class: 'eyebrow', text: 'Curso ' + c.n + ' · ' + c.title + ' · Módulo ' + v.moduleN + ': ' + v.moduleTitle }),
      el('h1', { class: 'watch-title', text: v.title }),
      el('p', { class: 'lesson-sub', text: 'Lección ' + v.n + ' de ' + c.videos.length }),
      el('div', { class: 'watch-actions' }, [
        completeBtn, seenBtn,
        el('a', { class: 'btn btn-ghost', href: 'https://www.youtube.com/watch?v=' + encodeURIComponent(v.id), target: '_blank', rel: 'noopener noreferrer', text: 'Ver en YouTube ↗' })
      ]),
      el('div', { class: 'watch-nav' }, [
        prev ? el('a', { class: 'nav-link', href: watchLink(prev.id) }, [el('small', { text: '← Anterior' }), el('span', { text: prev.title })]) : el('span'),
        next ? el('a', { class: 'nav-link nav-next', href: watchLink(next.id) }, [el('small', { text: 'Siguiente →' }), el('span', { text: next.title })]) : null
      ])
    ]);

    if (window.location.protocol === 'file:') {
      main.insertBefore(el('p', { class: 'file-warning', text: 'Si el vídeo muestra el error 153, abre la escuela desde http://127.0.0.1:8765 (doble clic en iniciar.command).' }), main.firstChild);
    }

    var syllabus = el('aside', { class: 'queue', 'aria-label': 'Temario del curso' }, [
      el('a', { class: 'crumb', href: '#/curso/' + c.id, text: '← Temario completo' }),
      el('h2', { class: 'queue-title', text: c.title }),
      progressBlock(c.id)
    ]);
    c.modules.forEach(function (m) {
      syllabus.appendChild(el('div', { class: 'queue-module' }, [
        el('span', { text: 'Módulo ' + m.n + ' · ' + m.title }),
        el('span', { class: 'count js-count', 'data-module': m.id })
      ]));
      syllabus.appendChild(el('ol', { class: 'lessons lessons-compact' }, moduleVideos(c, m).map(function (x) {
        return lessonRow(x, { compact: true, current: x.id === v.id });
      })));
    });

    setView([el('div', { class: 'watch' }, [main, syllabus])], v.title);
    refreshProgress();
  }

  function renderNotFound() {
    setView([
      el('div', { class: 'empty' }, [
        el('p', { class: 'empty-icon', text: '🤔' }),
        el('p', { text: 'No encontramos esa página.' }),
        el('a', { class: 'btn btn-primary', href: '#/', text: 'Volver al inicio' })
      ])
    ], 'No encontrado');
  }

  function setView(children, title, keepScroll) {
    viewEl.textContent = '';
    children.forEach(function (c) { viewEl.appendChild(c); });
    document.title = title + ' · ESIA Paraguay';
    if (!keepScroll) window.scrollTo(0, 0);
  }

  /* ---------- Router (hash) ---------- */
  var currentRoute = { name: 'home' };

  function parseRoute() {
    var hash = window.location.hash.replace(/^#\/?/, '');
    var parts = hash.split('/').map(decodeURIComponent);
    if (parts[0] === 'watch' && parts[1]) return { name: 'watch', id: parts[1] };
    if (parts[0] === 'curso' && parts[1]) return { name: 'course', course: parts[1] };
    if (parts[0] === 'modulo' && parts[1] && modulesById[parts[1]]) return { name: 'course', course: modulesById[parts[1]].course.id };
    if (parts[0] === 'buscar') return { name: 'home', q: parts.slice(1).join('/') };
    return { name: 'home' };
  }

  function draw(r) {
    if (r.name === 'watch') renderWatch(r.id);
    else if (r.name === 'course') renderCourse(r.course);
    else renderHome(r);
  }

  function route() {
    currentRoute = parseRoute();
    closeMenu();
    draw(currentRoute);
    renderSidebar(currentRoute);
    searchInput.value = currentRoute.q || '';
    searchForm.classList.toggle('has-value', searchInput.value.length > 0);
    viewEl.focus({ preventScroll: true });
  }

  /* ---------- Menú móvil ---------- */
  function openMenu() {
    document.body.classList.add('menu-open');
    backdropEl.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    document.body.classList.remove('menu-open');
    backdropEl.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', function () {
    if (window.matchMedia('(max-width: 1000px)').matches) {
      document.body.classList.contains('menu-open') ? closeMenu() : openMenu();
    } else {
      document.body.classList.toggle('sidebar-collapsed');
    }
  });
  backdropEl.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Búsqueda y salida ---------- */
  document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var q = searchInput.value.trim();
    window.location.hash = q ? '#/buscar/' + encodeURIComponent(q) : '#/';
  });

  var searchForm = document.getElementById('search-form');
  function syncClear() { searchForm.classList.toggle('has-value', searchInput.value.length > 0); }
  /* Filtrado en vivo: se actualiza la lista en cada pulsación, sin perder el foco. */
  searchInput.addEventListener('input', function () {
    syncClear();
    var q = searchInput.value.trim();
    currentRoute = { name: 'home', q: q || undefined, live: true };
    try { history.replaceState(null, '', q ? '#/buscar/' + encodeURIComponent(q) : '#/'); } catch (e) { /* file:// restringido */ }
    if (q) renderHome(currentRoute); else renderHome({ name: 'home' });
    renderSidebar(currentRoute);
    closeMenu();
  });
  document.getElementById('search-clear').addEventListener('click', function () {
    searchInput.value = '';
    searchInput.focus();
    searchInput.dispatchEvent(new Event('input'));
  });

  function logout() {
    EsiaAuth.logout();
    window.location.replace('index.html');
  }
  document.getElementById('logout-btn').addEventListener('click', logout);

  window.addEventListener('hashchange', route);
  route();
})();
