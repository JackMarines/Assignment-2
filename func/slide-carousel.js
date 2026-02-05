  // Drag-to-scroll carousel with snap-to-center and center-card highlighting
// Shows 3 cards at a time on wide screens, single card on small screens

document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  const cards = carousel.querySelectorAll('.card');
  if (cards.length === 0) return;

  // Pointer drag with momentum
  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let lastX = 0;
  let lastTime = 0;
  let velocity = 0;
  let momentum = null;

  carousel.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return; // Only left mouse button
    isDown = true;
    carousel.classList.add('dragging');
    startX = e.clientX;
    startScroll = carousel.scrollLeft;
    lastX = e.clientX;
    lastTime = Date.now();
    if (momentum) clearInterval(momentum);
    carousel.setPointerCapture(e.pointerId);

    
  });

  carousel.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    carousel.scrollLeft = startScroll - dx;
    
    // Calculate velocity
    const now = Date.now();
    const timeDelta = now - lastTime;
    if (timeDelta > 0) {
      velocity = (lastX - e.clientX) / timeDelta;
    }
    lastX = e.clientX;
    lastTime = now;
  });

  const endDrag = (e) => {
    if (!isDown) return;
    isDown = false;
    carousel.classList.remove('dragging');
    
    // Apply momentum
    if (Math.abs(velocity) > 0.1) {
      let currentVelocity = velocity;
      if (momentum) clearInterval(momentum);
      momentum = setInterval(() => {
        currentVelocity *= 0.95; // Friction
        carousel.scrollLeft += currentVelocity;
        if (Math.abs(currentVelocity) < 0.1) {
          clearInterval(momentum);
          snapToCenter();
        }
      }, 16);
    } else {
      snapToCenter();
    }
  };

  carousel.addEventListener('pointerup', endDrag);
  carousel.addEventListener('pointercancel', endDrag);
  carousel.addEventListener('pointerleave', endDrag);

  // Wheel -> horizontal
  carousel.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      carousel.scrollLeft += e.deltaY;
    }
  }, { passive: false });

  // Snap to nearest card
  function snapToCenter() {
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    let closest = null;
    let closestDist = Infinity;
    cards.forEach(card => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < closestDist) { closestDist = dist; closest = card; }
    });
    if (closest) {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      let left = closest.offsetLeft - (carousel.clientWidth - closest.offsetWidth) / 2;
      left = Math.max(0, Math.min(left, maxScroll)); // Clamp between 0 and maxScroll
      carousel.scrollTo({ left, behavior: 'smooth' });
      setTimeout(updateCenterClass, 300);
    }
  }

  // Highlight center card
  function updateCenterClass() {
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    let closest = null;
    let closestDist = Infinity;
    
    cards.forEach(card => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - center);
      
      if (dist < closestDist) {
        closestDist = dist;
        closest = card;
      }
    });
    
    // Only highlight the closest card to center
    cards.forEach(card => {
      if (card === closest) {
        card.classList.add('is-center');
      } else {
        card.classList.remove('is-center');
      }
    });
  }

  // Debounce snapping after scroll
  let scrollTimer;
  carousel.addEventListener('scroll', () => {
    updateCenterClass();
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => snapToCenter(), 100);
  });

  // keyboard support
  carousel.tabIndex = 0;
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      moveByDirection(1);
    } else if (e.key === 'ArrowLeft') {
      moveByDirection(-1);
    }
  });

  function moveByDirection(dir) {
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    const arr = Array.from(cards);
    if (dir > 0) {
      for (let i = 0; i < arr.length; i++) {
        const c = arr[i];
        if (c.offsetLeft + c.offsetWidth / 2 > center) { carousel.scrollTo({ left: Math.max(0, c.offsetLeft - (carousel.clientWidth - c.offsetWidth)/2), behavior: 'smooth' }); break; }
      }
    } else {
      for (let i = arr.length - 1; i >= 0; i--) {
        const c = arr[i];
        if (c.offsetLeft + c.offsetWidth / 2 < center) { carousel.scrollTo({ left: Math.max(0, c.offsetLeft - (carousel.clientWidth - c.offsetWidth)/2), behavior: 'smooth' }); break; }
      }
    }
  }

  // init
  setTimeout(() => { snapToCenter(); updateCenterClass(); }, 100);
  window.addEventListener('resize', () => setTimeout(() => { snapToCenter(); updateCenterClass(); }, 120));
});
