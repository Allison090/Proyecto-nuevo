/**
 * ==============================================================================
 * PORTAFOLIO WEB PERSONAL - SCRIPT GLOBAL (js/main.js)
 * Cargado en todas las páginas para controlar:
 *  1. Menú móvil (abrir/cerrar e interactividad accesibilidad)
 *  2. Detección automática del enlace activo de la barra de navegación
 *  3. Inserción dinámica del año en curso en el pie de página
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de funciones globales
  initMobileMenu();
  setActiveNavLink();
  setCurrentYear();
});

/**
 * 1. Menú móvil interactivo
 * Permite abrir y cerrar el menú desplegable en pantallas pequeñas
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!menuToggle || !navMenu) return;

  // Alterna el estado abierto/cerrado al hacer clic en el botón hamburguesa
  menuToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Cierra el menú al hacer clic en cualquiera de los enlaces de navegación
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Cierra el menú si el usuario hace clic fuera del menú o del botón
  document.addEventListener('click', (event) => {
    if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

/**
 * 2. Enlace Activo Automático
 * Examina la ruta actual (pathname) y aplica la clase .active al enlace correspondiente
 */
function setActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  if (!navLinks.length) return;

  // Obtiene el nombre del archivo actual (por defecto 'index.html' si es raíz '/')
  const currentPath = window.location.pathname;
  let currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);

  if (currentPage === '' || currentPage === '/') {
    currentPage = 'index.html';
  }

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute('href');
    // Si el href del enlace coincide con la página actual, lo marcamos activo
    if (linkHref === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * 3. Año dinámico en el Footer
 * Inserta el año actual para que nunca quede desactualizado
 */
function setCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
