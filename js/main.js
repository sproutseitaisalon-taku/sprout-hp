/**
 * 整体サロン Sprout — main.js
 * 実装: ジン
 *
 * 1. ヘッダー：スクロール時にスタイル変更
 * 2. ハンバーガーメニュー
 * 3. スクロールアニメーション（Intersection Observer）
 * 4. スムーズスクロール（アンカーリンク）
 * 5. ヘッダーの高さを考慮したスクロール調整
 */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. Header: スクロール検知
  ---------------------------------------------------------- */
  const header = document.getElementById('header');

  function handleHeaderScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // 初期状態

  /* ----------------------------------------------------------
     2. ハンバーガーメニュー
  ---------------------------------------------------------- */
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      // ボディのスクロール制御
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // ナビリンクをクリックしたらメニューを閉じる
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Escキーで閉じる
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ----------------------------------------------------------
     3. スクロールアニメーション（Intersection Observer）
  ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // 一度表示したら監視解除
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -48px 0px',
      }
    );

    revealElements.forEach(function (el, i) {
      // 同じセクション内のカードには順番に遅延をつける
      const siblings = el.parentElement.querySelectorAll('.reveal');
      if (siblings.length > 1) {
        const idx = Array.from(siblings).indexOf(el);
        el.style.transitionDelay = idx * 0.1 + 's';
      }
      revealObserver.observe(el);
    });
  } else {
    // Intersection Observer 非対応ブラウザは全表示
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ----------------------------------------------------------
     4. スムーズスクロール（ヘッダー高さ分オフセット）
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop    = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     5. ヒーローのスクロールインジケーター（ロール後に非表示）
  ---------------------------------------------------------- */
  const scrollIndicator = document.querySelector('.hero__scroll');

  if (scrollIndicator) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 80) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      } else {
        scrollIndicator.style.opacity = '';
        scrollIndicator.style.pointerEvents = '';
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     6. アクティブナビゲーション（現在のセクションをハイライト）
  ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.header__nav-list a[href^="#"]');

  if (sections.length > 0 && navLinks.length > 0) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.style.opacity = link.getAttribute('href') === '#' + id ? '1' : '';
            });
          }
        });
      },
      {
        rootMargin: '-40% 0px -55% 0px',
      }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

})();
