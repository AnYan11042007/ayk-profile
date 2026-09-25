const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Mở menu' : 'Đóng menu');
  nav.classList.toggle('open', !isOpen);
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Mở menu');
  nav.classList.remove('open');
}));

document.querySelectorAll('.social-icon img, .other-icon img').forEach((img) => {
  img.addEventListener('error', () => { img.style.display = 'none'; });
});

const toast = document.querySelector('.copy-toast');
let toastTimer;
async function copyAccount(value) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const field = document.createElement('textarea');
    field.value = value;
    field.readOnly = true;
    field.style.cssText = 'position:fixed;left:-9999px;top:0;font-size:16px';
    document.body.appendChild(field);
    const previous = document.activeElement;
    field.select();
    field.setSelectionRange(0, value.length);
    let success = false;
    try { success = document.execCommand('copy'); } catch {}
    field.remove();
    previous?.focus({preventScroll:true});
    return success;
  }
}
document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy;
    const success = await copyAccount(value);
    toast.textContent = success ? 'Đã sao chép: ' + value : 'Chưa sao chép được. Bạn có thể chọn và sao chép mã trên thẻ.';
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
    button.classList.toggle('copied', success);
    setTimeout(() => button.classList.remove('copied'), 2200);
  });
});

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const targets = document.querySelectorAll('.about-grid, .contact-heading, .social-grid, .other-heading, .other-grid');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.08});
  targets.forEach((target) => { target.classList.add('reveal-ready'); observer.observe(target); });
  motionPreference.addEventListener('change', (event) => {
    if(event.matches){targets.forEach((target)=>target.classList.add('is-visible'));observer.disconnect();}
  });
}
