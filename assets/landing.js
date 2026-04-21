// ================================================================
// Protocol Health — Landing v2 · Interactions
// Nav scroll state, reveal-on-scroll, FAQ toggle, animated numbers,
// mini phone mock demo state cycling.
// ================================================================
(function(){

  // ─────── NAV scrolled state ───────
  const nav = document.querySelector('.nav');
  function onScroll(){
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─────── Reveal on scroll ───────
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(r => io.observe(r));

  // ─────── FAQ toggle ───────
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    q.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });

  // ─────── Animated stat counters ───────
  const statEls = document.querySelectorAll('[data-counter]');
  const counterIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const el = e.target;
        const target = parseFloat(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();
        function animate(now){
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
          if(p < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        counterIo.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  statEls.forEach(el => counterIo.observe(el));

  // ─────── Mini "today" checklist demo (auto-ticks) ───────
  const demoTodayItems = document.querySelectorAll('.demo-today .demo-item');
  if(demoTodayItems.length){
    let idx = 0;
    setInterval(() => {
      demoTodayItems.forEach(i => i.classList.remove('flash'));
      const el = demoTodayItems[idx % demoTodayItems.length];
      el.classList.add('done', 'flash');
      const bar = document.querySelector('.demo-today .demo-bar-fill');
      const pct = Math.min(((idx + 1) / demoTodayItems.length) * 100, 100);
      if(bar) bar.style.width = pct + '%';
      const pctEl = document.querySelector('.demo-today .demo-pct');
      if(pctEl) pctEl.textContent = Math.round(pct) + '%';
      idx++;
      if(idx > demoTodayItems.length + 1){
        idx = 0;
        demoTodayItems.forEach(i => i.classList.remove('done','flash'));
        if(bar) bar.style.width = '0%';
        if(pctEl) pctEl.textContent = '0%';
      }
    }, 1600);
  }

  // ─────── Weight chart animation (stroke-dashoffset) ───────
  const chartPath = document.querySelector('.demo-chart path.line');
  if(chartPath){
    const len = chartPath.getTotalLength();
    chartPath.style.strokeDasharray = len;
    chartPath.style.strokeDashoffset = len;
    const chartIo = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting){
          chartPath.style.transition = 'stroke-dashoffset 2s cubic-bezier(.7,.1,.3,1)';
          chartPath.style.strokeDashoffset = 0;
          chartIo.unobserve(chartPath);
        }
      });
    }, { threshold: 0.3 });
    chartIo.observe(chartPath);
  }

  // ─────── Calendar demo: shimmer current day ───────
  const today = document.querySelector('.demo-cal .cell.today');
  if(today){
    setInterval(() => {
      today.classList.toggle('pulse');
    }, 1500);
  }

  // ─────── Plan-card intensity bars — staggered entry ───────
  const planCards = document.querySelectorAll('.plan-card');
  const planIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.style.animation = 'planRise .6s both';
        planIo.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  planCards.forEach((c, i) => {
    c.style.animationDelay = (i * 0.08) + 's';
    planIo.observe(c);
  });

  // ─────── Tilt on hover for feature phones ───────
  document.querySelectorAll('.phone').forEach(phone => {
    const container = phone.closest('.f-visual');
    if(!container) return;
    container.addEventListener('mousemove', e => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      const reverse = phone.closest('.feature-row.reverse') ? -1 : 1;
      phone.style.transform =
        `rotateY(${-14 * reverse + x * 6}deg) rotateX(${6 - y * 6}deg)`;
    });
    container.addEventListener('mouseleave', () => {
      const reverse = phone.closest('.feature-row.reverse') ? -1 : 1;
      phone.style.transform = `rotateY(${-14 * reverse}deg) rotateX(6deg)`;
    });
  });

  // ─────── Parallax on floating chips ───────
  const chips = document.querySelectorAll('.chip-float');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    chips.forEach((c, i) => {
      const speed = 0.04 + (i % 3) * 0.02;
      c.style.setProperty('--parallax', (y * speed) + 'px');
    });
  }, { passive: true });

})();
