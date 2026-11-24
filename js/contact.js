/**
 * ==============================================================================
 * PORTAFOLIO WEB PERSONAL - SCRIPT DE CONTACTO (js/contact.js)
 * Cargado exclusivamente en contact.html para controlar:
 *  1. Copiar correo electrónico al portapapeles con retroalimentación visual
 *  2. Validación estricta de los campos del formulario en el cliente
 *  3. Envío directo por Correo (mailto:)
 *  4. Envío directo por WhatsApp (wa.me)
 * ==============================================================================
 */

// ==============================================================================
// CONFIGURACIÓN PERSONALIZABLE (Datos reales de Allison Yoza Menoscal)
// ==============================================================================
const CONTACT_CONFIG = {
  // Número de WhatsApp con código de país Ecuador (+593):
  whatsappPhone: "593987343691",

  // Correo electrónico personal
  email: "allisonyoza@hotmail.com"
};

document.addEventListener('DOMContentLoaded', () => {
  initCopyEmailButton();
  initContactForm();
});

/**
 * 1. Copiar correo al portapapeles
 */
function initCopyEmailButton() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  const originalText = copyBtn.textContent;

  copyBtn.addEventListener('click', async () => {
    const emailToCopy = CONTACT_CONFIG.email;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        // Método de respaldo para entornos locales o navegadores antiguos
        const tempInput = document.createElement('input');
        tempInput.value = emailToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      // Feedback visual temporal
      copyBtn.textContent = '¡Correo copiado!';
      copyBtn.classList.add('btn-primary');
      copyBtn.classList.remove('btn-outline');

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('btn-primary');
        copyBtn.classList.add('btn-outline');
      }, 2000);
    } catch (err) {
      console.error('Error al copiar el correo:', err);
      showFeedback('No se pudo copiar automáticamente. Correo: ' + emailToCopy, 'error');
    }
  });
}

/**
 * 2. Validación y envío del formulario (Correo y WhatsApp)
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');
  const feedbackContainer = document.getElementById('form-feedback');

  if (!form) return;

  // A. Envío por Correo Electrónico (evento submit del formulario)
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = getFormData();
    const validationError = validateFormData(data);

    if (validationError) {
      showFeedback(validationError, 'error');
      return;
    }

    // Construcción del enlace mailto:
    const subjectEncoded = encodeURIComponent(`[Portafolio] ${data.subject}`);
    const bodyContent = `Hola,\n\nHas recibido un nuevo mensaje desde tu Portafolio Web:\n\n` +
                        `• Nombre: ${data.name}\n` +
                        `• Correo: ${data.email}\n` +
                        `• Asunto: ${data.subject}\n\n` +
                        `Mensaje:\n${data.message}\n`;
    const bodyEncoded = encodeURIComponent(bodyContent);

    const mailtoUrl = `mailto:${CONTACT_CONFIG.email}?subject=${subjectEncoded}&body=${bodyEncoded}`;

    showFeedback('¡Validación exitosa! Abriendo tu gestor de correo predeterminado...', 'success');

    // Abre el cliente de correo
    window.location.href = mailtoUrl;
  });

  // B. Envío por WhatsApp (clic en botón dedicado)
  if (sendWhatsappBtn) {
    sendWhatsappBtn.addEventListener('click', () => {
      const data = getFormData();
      const validationError = validateFormData(data);

      if (validationError) {
        showFeedback(validationError, 'error');
        return;
      }

      // Construcción del mensaje para WhatsApp
      const whatsappText = `*¡Hola! Nuevo mensaje desde tu Portafolio:*\n\n` +
                           `👤 *Nombre:* ${data.name}\n` +
                           `✉️ *Correo:* ${data.email}\n` +
                           `📌 *Asunto:* ${data.subject}\n\n` +
                           `💬 *Mensaje:*\n${data.message}`;

      const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.whatsappPhone}?text=${encodeURIComponent(whatsappText)}`;

      showFeedback('¡Validación exitosa! Abriendo WhatsApp en una pestaña nueva...', 'success');

      // Abre WhatsApp en una nueva pestaña de forma segura
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  /**
   * Helper para extraer los datos limpios de los campos
   */
  function getFormData() {
    return {
      name: (document.getElementById('name')?.value || '').trim(),
      email: (document.getElementById('email')?.value || '').trim(),
      subject: (document.getElementById('subject')?.value || '').trim(),
      message: (document.getElementById('message')?.value || '').trim()
    };
  }

  /**
   * Validador de reglas de negocio
   * Retorna una cadena con el error o null si todo es válido
   */
  function validateFormData(data) {
    if (!data.name || data.name.length < 2) {
      return 'Por favor, escribe tu nombre completo (mínimo 2 caracteres).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      return 'Por favor, ingresa un correo electrónico válido (ejemplo: usuario@correo.com).';
    }

    if (!data.subject || data.subject.length < 3) {
      return 'Por favor, indica un asunto claro (mínimo 3 caracteres).';
    }

    if (!data.message || data.message.length < 10) {
      return 'Por favor, escribe un mensaje descriptivo (mínimo 10 caracteres).';
    }

    return null; // Todo válido
  }

  /**
   * Muestra mensajes de estado (éxito o error) en el contenedor de feedback
   */
  function showFeedback(message, type) {
    if (!feedbackContainer) return;

    feedbackContainer.textContent = message;
    feedbackContainer.className = ''; // Limpia clases previas
    feedbackContainer.classList.add(type); // 'success' o 'error'
    feedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
