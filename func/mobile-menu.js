const menu = document.getElementById('mobileMenu');
const panels = document.querySelectorAll('.menu-panel');

let currentPanel = document.querySelector('[data-level="main"]');

function openMenu(){
  menu.classList.add('open');
}

function closeMenu(){
  menu.classList.remove('open');
  panels.forEach(p => {
    p.classList.remove('active','exit');
  });
  currentPanel = document.querySelector('[data-level="main"]');
  currentPanel.classList.add('active');
}

function showPanel(target){
  if(currentPanel){
    currentPanel.classList.add('exit');
    currentPanel.classList.remove('active');
  }

  const next = document.querySelector(`[data-level="${target}"]`);
  next.classList.remove('exit');
  next.classList.add('active');
  currentPanel = next;
}

/* OPEN SUB */
document.querySelectorAll('.has-child').forEach(item => {
  item.addEventListener('click', () => {
    showPanel(item.dataset.target);
  });
});

/* BACK */
document.querySelectorAll('.back').forEach(btn => {
  btn.addEventListener('click', () => {
    showPanel('main');
  });
});
