/* =========================================================
   LaNPs — 交互脚本（原生 JavaScript，无任何依赖）
   包含：导航状态 / 移动端菜单 / 滚动揭示 / 数字滚动
        / 阅读进度 / 当前区块高亮
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

  /* ---------- 9. 页脚年份 ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 10. 首屏初始化 ---------- */
  onScrollNav();
  onScrollProgress();
  syncActiveLink();
})();
