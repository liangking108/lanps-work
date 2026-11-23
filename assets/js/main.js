/* =========================================================
   LaNPs — 交互脚本（原生 JavaScript，无任何依赖）
   包含：导航状态 / 移动端菜单 / 滚动揭示 / 数字滚动
        / 阅读进度 / 当前区块高亮 / 指针视差 / 作品图集
   ========================================================= */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 导航滚动态 ---------- */
  var nav = document.getElementById('nav');

  function onScrollNav() {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  /* ---------- 2. 移动端菜单 ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  function closeMenu() {
    if (!links || !toggle) return;
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '打开菜单');
  }

  function openMenu() {
    if (!links || !toggle) return;
    links.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', '关闭菜单');
  }

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.contains('is-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // 点击任一导航项后收起菜单
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    // Esc 关闭
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- 3. 滚动揭示（Intersection Observer） ---------- */
  var revealItems = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    // 不支持或用户要求减少动效 → 直接全部显示
    revealItems.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target); // 只播一次
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    revealItems.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- 4. 数字滚动 ---------- */
  var counters = document.querySelectorAll('[data-count]');

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';

    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    var duration = 1200;
    var start = null;

    function step(now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCounter);
    } else {
      var countObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            runCounter(entry.target);
            countObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach(function (el) {
        countObserver.observe(el);
      });
    }
  }

  /* ---------- 5. 阅读进度条 ---------- */
  var bar = document.getElementById('progressBar');

  function onScrollProgress() {
    if (!bar) return;
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - window.innerHeight;
    var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    bar.style.width = Math.min(ratio * 100, 100) + '%';
  }

  /* ---------- 6. 当前区块高亮 ---------- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main section[id]')
  );
  var navAnchors = Array.prototype.slice.call(
    document.querySelectorAll('[data-nav]')
  );

  function syncActiveLink() {
    if (!sections.length || !navAnchors.length) return;
    var offset = window.innerHeight * 0.32;
    var currentId = '';

    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= offset) {
        currentId = section.id;
      }
    });

    navAnchors.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      a.classList.toggle('is-active', href === '#' + currentId);
    });
  }

  /* ---------- 7. 合并滚动事件（rAF 节流） ---------- */
  var ticking = false;

  window.addEventListener(
    'scroll',
    function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        onScrollNav();
        onScrollProgress();
        syncActiveLink();
        ticking = false;
      });
    },
    { passive: true }
  );


  /* ---------- 7.5 首屏入场与精密指针交互 ---------- */
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var hero = document.querySelector('.hero');

  if (hero) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        hero.classList.add('is-ready');
      });
    });
  }

  if (hero && finePointer.matches && !reduceMotion) {
    var heroRect = null;
    var heroFrame = 0;
    var heroPointer = { x: 0, y: 0 };

    function renderHeroPointer() {
      hero.classList.add('is-pointer');
      hero.style.setProperty('--glow-x', (heroPointer.x * 16).toFixed(2) + 'px');
      hero.style.setProperty('--glow-y', (heroPointer.y * 12).toFixed(2) + 'px');
      hero.style.setProperty('--grid-x', (heroPointer.x * -8).toFixed(2) + 'px');
      hero.style.setProperty('--grid-y', (heroPointer.y * -8).toFixed(2) + 'px');
      heroFrame = 0;
    }

    hero.addEventListener('pointermove', function (e) {
      if (!heroRect) heroRect = hero.getBoundingClientRect();
      heroPointer.x = Math.max(-1, Math.min(1, ((e.clientX - heroRect.left) / heroRect.width - 0.5) * 2));
      heroPointer.y = Math.max(-1, Math.min(1, ((e.clientY - heroRect.top) / heroRect.height - 0.5) * 2));
      if (!heroFrame) heroFrame = requestAnimationFrame(renderHeroPointer);
    });

    hero.addEventListener('pointerleave', function () {
      hero.classList.remove('is-pointer');
      hero.style.setProperty('--glow-x', '0px');
      hero.style.setProperty('--glow-y', '0px');
      hero.style.setProperty('--grid-x', '0px');
      hero.style.setProperty('--grid-y', '0px');
    });

    window.addEventListener('resize', function () {
      heroRect = null;
    }, { passive: true });
  }

  var tiltCards = document.querySelectorAll('[data-tilt]');

  if (finePointer.matches && !reduceMotion) {
    tiltCards.forEach(function (card) {
      var frame = 0;
      var pointer = { x: 0, y: 0 };
      var cardRect = null;

      function renderTilt() {
        card.style.setProperty('--tilt-x', (-pointer.y * 1.25).toFixed(2) + 'deg');
        card.style.setProperty('--tilt-y', (pointer.x * 1.25).toFixed(2) + 'deg');
        card.style.setProperty('--mx', ((pointer.x + 1) * 50).toFixed(1) + '%');
        card.style.setProperty('--my', ((pointer.y + 1) * 50).toFixed(1) + '%');
        card.style.setProperty('--mark-x', (pointer.x * 8).toFixed(1) + 'px');
        card.style.setProperty('--mark-y', (pointer.y * 5).toFixed(1) + 'px');
        frame = 0;
      }

      card.addEventListener('pointermove', function (e) {
        if (!cardRect) cardRect = card.getBoundingClientRect();
        pointer.x = Math.max(-1, Math.min(1, ((e.clientX - cardRect.left) / cardRect.width) * 2 - 1));
        pointer.y = Math.max(-1, Math.min(1, ((e.clientY - cardRect.top) / cardRect.height) * 2 - 1));
        if (!frame) frame = requestAnimationFrame(renderTilt);
      });

      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '50%');
        card.style.setProperty('--mark-x', '0px');
        card.style.setProperty('--mark-y', '0px');
      });

      window.addEventListener('resize', function () {
        cardRect = null;
      }, { passive: true });
    });
  }

  var desktopQuery = window.matchMedia('(min-width: 721px)');
  function handleDesktopResize(e) {
    if (e.matches) closeMenu();
  }
  if (typeof desktopQuery.addEventListener === 'function') {
    desktopQuery.addEventListener('change', handleDesktopResize);
  } else if (typeof desktopQuery.addListener === 'function') {
    desktopQuery.addListener(handleDesktopResize);
  }
  /* ---------- 8. 邮箱一键复制 ---------- */
  var copyBtn = document.querySelector('[data-copy-email]');

  function flashCopied(btn) {
    var original = btn.textContent;
    btn.textContent = '已复制';
    btn.classList.add('is-copied');
    window.setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove('is-copied');
    }, 1800);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-copy-email') || '';

      function fallback() {
        // 兼容非 HTTPS / 老浏览器：临时 textarea + execCommand
        var ta = document.createElement('textarea');
        ta.value = email;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); flashCopied(copyBtn); } catch (e) {}
        document.body.removeChild(ta);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function () {
          flashCopied(copyBtn);
        }).catch(fallback);
      } else {
        fallback();
      }
    });
  }

  /* ---------- 9.5 作品图集（多作品） ---------- */
  var gallery = document.getElementById('gallery');
  var galleryImage = document.getElementById('galleryImage');
  var galleryCaption = document.getElementById('galleryCaption');
  var galleryThumbs = document.getElementById('galleryThumbs');
  var gallerySets = {
    tongxin: {
      title: '同心茶事',
      items: [
        { src: 'assets/img/works/tongxin-main.webp', label: '主视觉 · 茶席全景' },
        { src: 'assets/img/works/tongxin-top.webp', label: '同心双盘 · 俯视' },
        { src: 'assets/img/works/tongxin-cups.webp', label: '双杯对饮 · 釉色对照' },
        { src: 'assets/img/works/tongxin-scene.webp', label: '低角度 · 茶席氛围' },
        { src: 'assets/img/works/tongxin-sheet.webp', label: '九图套图 · 总览' }
      ]
    },
    chuxiang: {
      title: '触香',
      items: [
        { src: 'assets/img/works/chuxiang-main.webp', label: '主视觉 · 三支线香' },
        { src: 'assets/img/works/chuxiang-top.webp', label: '俯视 · 三个插孔' },
        { src: 'assets/img/works/chuxiang-scene.webp', label: '场景 · 暖光石台' },
        { src: 'assets/img/works/chuxiang-explode.webp', label: '内部结构 · 爆炸图' },
        { src: 'assets/img/works/chuxiang-board.webp', label: '设计展示页 · A3' }
      ]
    }
  };
  var activeSet = gallerySets.tongxin;
  var galleryIndex = 0;
  var lastFocused = null;

  function renderGallery() {
    if (!galleryImage || !galleryCaption || !galleryThumbs) return;
    var item = activeSet.items[galleryIndex];
    galleryImage.src = item.src;
    galleryImage.alt = activeSet.title + '：' + item.label;
    galleryCaption.textContent =
      activeSet.title + ' · ' + item.label + '  ·  ' +
      (galleryIndex + 1) + ' / ' + activeSet.items.length;

    var thumbs = galleryThumbs.querySelectorAll('button');
    thumbs.forEach(function (thumb, i) {
      var isActive = i === galleryIndex;
      thumb.classList.toggle('is-active', isActive);
      thumb.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  }

  function buildThumbnails() {
    if (!galleryThumbs) return;
    galleryThumbs.innerHTML = '';
    activeSet.items.forEach(function (item, i) {
      var thumb = document.createElement('button');
      var image = document.createElement('img');
      thumb.type = 'button';
      thumb.setAttribute('aria-label', '查看：' + item.label);
      image.src = item.src;
      image.alt = '';
      thumb.appendChild(image);
      (function (index) {
        thumb.addEventListener('click', function () {
          galleryIndex = index;
          renderGallery();
        });
      })(i);
      galleryThumbs.appendChild(thumb);
    });
  }

  function openGallery(name, trigger) {
    if (!gallery) return;
    var set = gallerySets[name];
    if (!set) return;
    activeSet = set;
    galleryIndex = 0;
    lastFocused = trigger || document.activeElement;
    if (gallery.getAttribute('aria-label')) {
      gallery.setAttribute('aria-label', set.title + '作品图集');
    }
    buildThumbnails();
    gallery.hidden = false;
    document.body.style.overflow = 'hidden';
    renderGallery();
    var close = gallery.querySelector('[data-gallery-close]');
    if (close) close.focus();
  }

  function closeGallery() {
    if (!gallery || gallery.hidden) return;
    gallery.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function stepGallery(delta) {
    galleryIndex = (galleryIndex + delta + activeSet.items.length) % activeSet.items.length;
    renderGallery();
  }

  if (gallery && galleryThumbs) {
    var openBtns = document.querySelectorAll('[data-gallery-open]');
    openBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        openGallery(btn.getAttribute('data-gallery-open'), btn);
      });
    });

    var closeBtn = gallery.querySelector('[data-gallery-close]');
    var prevBtn = gallery.querySelector('[data-gallery-prev]');
    var nextBtn = gallery.querySelector('[data-gallery-next]');

    if (closeBtn) closeBtn.addEventListener('click', closeGallery);
    if (prevBtn) prevBtn.addEventListener('click', function () { stepGallery(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { stepGallery(1); });

    gallery.addEventListener('click', function (e) {
      if (e.target === gallery) closeGallery();
    });

    document.addEventListener('keydown', function (e) {
      if (gallery.hidden) return;
      if (e.key === 'Escape') closeGallery();
      if (e.key === 'ArrowLeft') stepGallery(-1);
      if (e.key === 'ArrowRight') stepGallery(1);
    });
  }

  /* ---------- 9. 页脚年份 ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 10. 首屏初始化 ---------- */
  onScrollNav();
  onScrollProgress();
  syncActiveLink();
})();
// ---------- Theme switch: Vibe default / dark workbench ----------
(function () {
  var key = 'lanps-theme';
  var link = document.getElementById('themeStyle');
  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'theme-toggle';
  toggle.textContent = 'Vibe';

  function setMetaColor(name) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', name === 'vibe' ? '#F8F9FC' : '#0B0D10');
  }

  function setToggle(name) {
    toggle.setAttribute('aria-pressed', name === 'vibe' ? 'true' : 'false');
    toggle.setAttribute('aria-label', name === 'vibe' ? '切换到深色工作台' : '切换到 Vibe 风格');
  }

  function apply(name, options) {
    if (!link) return;
    options = options || {};
    link.href = name === 'vibe' ? 'assets/css/vibe.css?v=2' : 'assets/css/style.css?v=3';
    document.documentElement.dataset.theme = name;
    setMetaColor(name);
    setToggle(name);
    if (options.save !== false) {
      try { localStorage.setItem(key, name); } catch (e) {}
    }
  }

  var saved = '';
  try { saved = localStorage.getItem(key) || ''; } catch (e) {}
  apply(saved === 'dark' ? 'dark' : 'vibe', { save: false });

  toggle.addEventListener('click', function () {
    var nextTheme = document.documentElement.dataset.theme === 'vibe' ? 'dark' : 'vibe';
    document.body.classList.add('theme-switching');
    apply(nextTheme);
    window.setTimeout(function () {
      document.body.classList.remove('theme-switching');
    }, 450);
  });

  window.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector('.nav__inner');
    if (nav) nav.appendChild(toggle);
  });
})();

// ---------- Step 1: hero pointer parallax (Vibe theme only) ----------
(function () {
  var hero = document.querySelector('.hero');
  var copy = document.querySelector('.hero__copy');
  var stage = document.querySelector('.hero__stage');
  if (!hero || !copy || !stage) return;

  var enabled = window.matchMedia('(min-width: 921px)').matches &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!enabled) return;

  var queued = false;
  var x = 0;
  var y = 0;

  function render() {
    var nx = x - 0.5;
    var ny = y - 0.5;
    copy.style.setProperty('--vibe-copy-x', (nx * -10).toFixed(2) + 'px');
    copy.style.setProperty('--vibe-copy-y', (ny * -7).toFixed(2) + 'px');
    stage.style.setProperty('--vibe-stage-x', (nx * 16).toFixed(2) + 'px');
    stage.style.setProperty('--vibe-stage-y', (ny * 11).toFixed(2) + 'px');
    queued = false;
  }

  hero.addEventListener('pointermove', function (event) {
    if (document.documentElement.dataset.theme !== 'vibe') return;
    var rect = hero.getBoundingClientRect();
    x = (event.clientX - rect.left) / rect.width;
    y = (event.clientY - rect.top) / rect.height;
    if (!queued) {
      queued = true;
      requestAnimationFrame(render);
    }
  }, { passive: true });

  hero.addEventListener('pointerleave', function () {
    x = 0.5;
    y = 0.5;
    requestAnimationFrame(render);
  });
})();

// ---------- Step 2: staggered scroll groups (Vibe theme only) ----------
(function () {
  if (!('IntersectionObserver' in window)) return;

  var groups = document.querySelectorAll('.timeline, .contact-grid');
  if (!groups.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });

  groups.forEach(function (group) {
    if (reduceMotion) {
      group.classList.add('is-visible');
    } else {
      observer.observe(group);
    }
  });
})();
