document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');

      const isExpanded = mobileToggle.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Fecha o menu se o usuário clicar fora dele
  document.addEventListener('click', (event) => {
    const isClickInside = navMenu.contains(event.target) || mobileToggle.contains(event.target);
    
    if (!isClickInside && navMenu.classList.contains('active')) {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
});