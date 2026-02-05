const nav = document.querySelector('.nav');
const trigger = document.querySelector('.menu-trigger');
const megaMenu = document.querySelector('.mega-menu');
const items = document.querySelectorAll('.menu-left li');
const contents = document.querySelectorAll('.content');

// Toggle menu (guarded)
if (trigger) {
  // accessibility: expose as button
  trigger.setAttribute('role', 'button');
  trigger.setAttribute('tabindex', '0');
  trigger.setAttribute('aria-expanded', 'false');

  const toggleMenu = (e) => {
    e.stopPropagation();
    if (!nav) return;

    // Toggle then read state explicitly (avoids relying on toggle return value)
    nav.classList.toggle('open');
    const opened = nav.classList.contains('open');

    // keep aria attribute consistent (string values)
    trigger.setAttribute('aria-expanded', opened ? 'true' : 'false');

    // dispatch custom event with explicit opened state
    const ev = new CustomEvent('destination-clicked', { detail: { opened } });
    document.dispatchEvent(ev);
  };

  trigger.addEventListener('click', toggleMenu);

  // keyboard support: Enter / Space
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu(e);
    }
  });
}

// Optional: listen to the custom event (useful for debugging or other features)
document.addEventListener('destination-clicked', (e) => {
  console.log('destination-clicked event received', e.detail);
});

// Hover đổi content
if (items && items.length) {
  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      items.forEach(i => i.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      item.classList.add('active');
      const target = document.getElementById(item.dataset.target);
      if (target) target.classList.add('active');
    });
  });
}

// Click outside → đóng menu
document.addEventListener('click', (e) => {
  if (nav && !nav.contains(e.target)) {
    if (nav.classList.contains('open')) {
      nav.classList.remove('open');
      // keep aria in sync and notify listeners
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      const ev = new CustomEvent('destination-clicked', { detail: { opened: false, reason: 'outside-click' } });
      document.dispatchEvent(ev);
    }
  }
});

// ESC → đóng menu
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav && nav.classList.contains('open')) {
    nav.classList.remove('open');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    const ev = new CustomEvent('destination-clicked', { detail: { opened: false, reason: 'escape' } });
    document.dispatchEvent(ev);
  }
});

// Ngăn click trong menu làm đóng
if (megaMenu) {
  megaMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}