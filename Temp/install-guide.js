/* Protocol Health · Install Guide animator
   Cycles steps for whichever install panel is active.
   - Each panel has a mockup with data-step + a list of .install-step[data-s]
   - Every STEP_MS we advance; on last step, hold then loop.
   - Pause if the modal is closed, restart when opened or tab switched. */

(function(){
  const STEP_MS = 2800;
  const HOLD_LAST_MS = 1600;

  const CAPTIONS = {
    android: ['Open in Chrome', 'Tap the ⋮ menu', 'Select Install app', 'Confirm install', 'Launches fullscreen'],
    ios:     ['Open in Safari', 'Tap the Share button', 'Add to Home Screen', 'Name it, tap Add', 'Launches fullscreen'],
    desktop: ['Open in Chrome/Edge', 'Spot the ⊕ icon', 'Click Install', 'Standalone app window'],
  };

  let timer = null;
  let currentTab = 'android';

  function panelFor(tab){
    return document.querySelector(`.install-panel[data-panel="${tab}"]`);
  }
  function mockFor(tab){
    const p = panelFor(tab); if(!p) return null;
    return p.querySelector('.ig-phone, .ig-browser');
  }

  function setStep(tab, n){
    const panel = panelFor(tab);
    const mock = mockFor(tab);
    if(!panel || !mock) return;
    const steps = panel.querySelectorAll('.install-step');
    const total = steps.length;
    const step = ((n - 1) % total + total) % total + 1;

    mock.setAttribute('data-step', step);

    steps.forEach(el => {
      const s = Number(el.dataset.s);
      el.classList.toggle('active', s === step);
      el.classList.toggle('past', s < step);
    });

    // Timeline + caption
    const fill = panel.querySelector('.ig-timeline-fill');
    if(fill) fill.style.width = `${(step / total) * 100}%`;
    const capN = panel.querySelector('.ig-cap-n');
    const capT = panel.querySelector('.ig-cap-t');
    if(capN) capN.textContent = step;
    if(capT) capT.textContent = (CAPTIONS[tab] && CAPTIONS[tab][step-1]) || '';
  }

  function start(tab){
    stop();
    currentTab = tab;
    const panel = panelFor(tab);
    if(!panel) return;
    const total = panel.querySelectorAll('.install-step').length;
    let s = 1;
    setStep(tab, s);

    const tick = () => {
      s += 1;
      const last = s > total;
      setStep(tab, last ? 1 : s);
      if(last) s = 1;
      const delay = (s === total) ? (STEP_MS + HOLD_LAST_MS) : STEP_MS;
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, STEP_MS);
  }

  function stop(){
    if(timer){ clearTimeout(timer); timer = null; }
  }

  // Hook into the existing modal open/close + tab switch
  const origOpen = window.openInstall;
  window.openInstall = function(){
    if(typeof origOpen === 'function') origOpen();
    // determine current tab
    const activeTab = document.querySelector('.install-tab.active');
    const tab = activeTab ? activeTab.dataset.tab : 'android';
    start(tab);
  };
  const origClose = window.closeInstall;
  window.closeInstall = function(){
    stop();
    if(typeof origClose === 'function') origClose();
  };
  const origSwitch = window.switchTab;
  window.switchTab = function(name){
    if(typeof origSwitch === 'function') origSwitch(name);
    start(name);
  };

  // Init default state for Android panel (so the first open shows step 1)
  document.addEventListener('DOMContentLoaded', () => {
    setStep('android', 1);
    setStep('ios', 1);
    setStep('desktop', 1);
  });
})();
