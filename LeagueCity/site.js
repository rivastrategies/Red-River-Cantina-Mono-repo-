document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const menuClose = document.querySelector('.mobile-menu-close');
  const menuOverlay = document.querySelector('.mobile-menu-overlay');

  const openMenu = () => {
    if (!menuOverlay) {
      return;
    }
    menuOverlay.classList.add('active');
    body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    if (!menuOverlay) {
      return;
    }
    menuOverlay.classList.remove('active');
    body.style.overflow = '';
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', openMenu);
  }

  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  if (menuOverlay) {
    menuOverlay.querySelectorAll('.mobile-menu-item').forEach((item) => {
      item.addEventListener('click', closeMenu);
    });
  }

  const ORDER_MODAL_ID = 'order-modal';
  const pickupUrl = 'https://order.redriverrestaurants.com/order/redrivercantina';
  const deliveryUrl = 'https://order.online/store/red-river-cantina-league-city-582276?delivery=true&hideModal=true';
  const modalMarkup = `
    <div class="order-modal" id="${ORDER_MODAL_ID}" aria-hidden="true" role="dialog" aria-labelledby="order-modal-title">
      <div class="order-modal__dialog" tabindex="-1">
        <button type="button" class="order-modal__close" data-modal-close aria-label="Close order options">×</button>
        <p class="order-modal__eyebrow">League City, Texas</p>
        <h2 class="order-modal__title" id="order-modal-title">Order Online</h2>
        <p class="order-modal__subtitle">Choose how you would like to enjoy Red River Cantina from our League City location.</p>
        <div class="order-modal__actions">
          <a class="btn btn-modern order-modal__primary" href="${pickupUrl}" target="_blank" rel="noopener">Pickup</a>
          <a class="btn btn-outline" href="${deliveryUrl}" target="_blank" rel="noopener">Delivery</a>
        </div>
      </div>
    </div>
  `;

  let lastFocusedElement = null;
  let keydownHandler = null;

  const ensureModal = () => {
    let modal = document.getElementById(ORDER_MODAL_ID);
    if (modal) {
      return modal;
    }
    body.insertAdjacentHTML('beforeend', modalMarkup);
    modal = document.getElementById(ORDER_MODAL_ID);

    if (!modal) {
      return null;
    }

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    modal.querySelectorAll('[data-modal-close]').forEach((closeButton) => {
      closeButton.addEventListener('click', closeModal);
    });

    return modal;
  };

  const trapFocus = (event) => {
    if (event.key !== 'Tab') {
      return;
    }

    const modal = document.getElementById(ORDER_MODAL_ID);
    if (!modal || !modal.classList.contains('is-open')) {
      return;
    }

    const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(modal.querySelectorAll(focusableSelectors)).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));

    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const closeModal = () => {
    const modal = document.getElementById(ORDER_MODAL_ID);
    if (!modal) {
      return;
    }

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';

    document.removeEventListener('keydown', keydownHandler);

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  };

  const openModal = () => {
    const modal = ensureModal();
    if (!modal) {
      return;
    }

    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';

    const dialog = modal.querySelector('.order-modal__dialog');
    const primaryAction = modal.querySelector('.order-modal__primary');

    window.requestAnimationFrame(() => {
      (primaryAction || dialog).focus();
    });

    keydownHandler = (event) => {
      if (event.key === 'Escape') {
        closeModal();
        return;
      }
      trapFocus(event);
    };

    document.addEventListener('keydown', keydownHandler);
  };

  const orderTriggers = document.querySelectorAll('[data-order-modal-trigger]');
  orderTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openModal();
    });
  });

  // Management Contact Modal
  const MANAGEMENT_MODAL_ID = 'management-modal';
  let lastManagementFocusedElement = null;
  let managementKeydownHandler = null;

  const ensureManagementModal = () => {
    return document.getElementById(MANAGEMENT_MODAL_ID);
  };

  const trapManagementFocus = (event) => {
    if (event.key !== 'Tab') {
      return;
    }

    const modal = document.getElementById(MANAGEMENT_MODAL_ID);
    if (!modal || !modal.classList.contains('is-open')) {
      return;
    }

    const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(modal.querySelectorAll(focusableSelectors)).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));

    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const closeManagementModal = () => {
    const modal = document.getElementById(MANAGEMENT_MODAL_ID);
    if (!modal) {
      return;
    }

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';

    document.removeEventListener('keydown', managementKeydownHandler);

    if (lastManagementFocusedElement && typeof lastManagementFocusedElement.focus === 'function') {
      lastManagementFocusedElement.focus();
    }
  };

  const openManagementModal = () => {
    const modal = ensureManagementModal();
    if (!modal) {
      return;
    }

    lastManagementFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';

    const firstInput = modal.querySelector('input, textarea, button');
    if (firstInput) {
      setTimeout(() => {
        firstInput.focus();
      }, 50);
    }

    managementKeydownHandler = (event) => {
      if (event.key === 'Escape') {
        closeManagementModal();
        return;
      }
      trapManagementFocus(event);
    };

    document.addEventListener('keydown', managementKeydownHandler);

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeManagementModal();
      }
    });

    modal.querySelectorAll('[data-management-modal-close]').forEach((closeButton) => {
      closeButton.addEventListener('click', closeManagementModal);
    });
  };

  const managementTriggers = document.querySelectorAll('[data-management-modal-trigger]');
  managementTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openManagementModal();
    });
  });

  const getOrCreateFormStatus = (form) => {
    let statusEl = form.querySelector('.form-inline-message');
    if (statusEl) {
      return statusEl;
    }

    statusEl = document.createElement('div');
    statusEl.className = 'form-inline-message';
    statusEl.setAttribute('role', 'status');
    statusEl.setAttribute('aria-live', 'polite');
    statusEl.hidden = true;

    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitButton) {
      submitButton.insertAdjacentElement('beforebegin', statusEl);
    } else {
      form.appendChild(statusEl);
    }

    return statusEl;
  };

  const clearFormStatus = (form) => {
    const statusEl = form.querySelector('.form-inline-message');
    if (!statusEl) {
      return;
    }

    statusEl.hidden = true;
    statusEl.textContent = '';
    statusEl.classList.remove('is-success', 'is-error');
  };

  const showFormStatus = (form, type, message) => {
    const statusEl = getOrCreateFormStatus(form);
    statusEl.classList.remove('is-success', 'is-error');
    statusEl.classList.add(type === 'error' ? 'is-error' : 'is-success');
    statusEl.textContent = message;
    statusEl.hidden = false;
  };

  const managementForm = document.getElementById('managementContactForm');
  if (managementForm) {
    managementForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(managementForm);
      const submitButton = managementForm.querySelector('button[type="submit"]');
      const actionUrl = managementForm.getAttribute('action');
      clearFormStatus(managementForm);

      if (!actionUrl) {
        showFormStatus(managementForm, 'error', 'Unable to submit right now. Please try again in a moment.');
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        const response = await fetch(actionUrl, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Form submission failed');
        }

        showFormStatus(managementForm, 'success', 'Thanks for contacting Red River Cantina. Our team will follow up shortly.');
        managementForm.reset();
      } catch (error) {
        showFormStatus(managementForm, 'error', 'Sorry, we could not send your message right now. Please try again.');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  }

  // Party Room Modal
  const PARTY_MODAL_ID = 'party-modal';
  let lastPartyFocusedElement = null;
  let partyKeydownHandler = null;

  const ensurePartyModal = () => {
    return document.getElementById(PARTY_MODAL_ID);
  };

  const trapPartyFocus = (event) => {
    if (event.key !== 'Tab') {
      return;
    }

    const modal = document.getElementById(PARTY_MODAL_ID);
    if (!modal || !modal.classList.contains('is-open')) {
      return;
    }

    const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(modal.querySelectorAll(focusableSelectors)).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));

    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const closePartyModal = () => {
    const modal = document.getElementById(PARTY_MODAL_ID);
    if (!modal) {
      return;
    }

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';

    document.removeEventListener('keydown', partyKeydownHandler);

    if (lastPartyFocusedElement && typeof lastPartyFocusedElement.focus === 'function') {
      lastPartyFocusedElement.focus();
    }
  };

  const openPartyModal = () => {
    const modal = ensurePartyModal();
    if (!modal) {
      return;
    }

    lastPartyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';

    const dialog = modal.querySelector('.party-modal__dialog');
    if (dialog) {
      setTimeout(() => {
        dialog.focus();
      }, 50);
    }

    partyKeydownHandler = (event) => {
      if (event.key === 'Escape') {
        closePartyModal();
        return;
      }
      trapPartyFocus(event);
    };

    document.addEventListener('keydown', partyKeydownHandler);

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closePartyModal();
      }
    });

    modal.querySelectorAll('[data-party-modal-close]').forEach((closeButton) => {
      closeButton.addEventListener('click', closePartyModal);
    });
  };

  const partyTriggers = document.querySelectorAll('[data-party-modal-trigger]');
  partyTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openPartyModal();
    });
  });

  // Party Room Form Submission
  const partyRoomForm = document.getElementById('partyRoomInquiry');
  if (partyRoomForm) {
    partyRoomForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      clearFormStatus(partyRoomForm);
      
      const formData = new FormData(partyRoomForm);
      
      try {
        const response = await fetch(partyRoomForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          showFormStatus(
            partyRoomForm,
            'success',
            'Thanks for contacting Red River BBQ about the Party Room. Our team will follow up shortly.'
          );
          partyRoomForm.reset();
        } else {
          showFormStatus(partyRoomForm, 'error', 'There was a problem submitting your request. Please try again or call us directly.');
        }
      } catch (error) {
        showFormStatus(partyRoomForm, 'error', 'There was a problem submitting your request. Please try again or call us directly.');
      }
    });
  }

  // Catering Modal
  const CATERING_MODAL_ID = 'catering-modal';
  let lastCateringFocusedElement = null;
  let cateringKeydownHandler = null;

  const ensureCateringModal = () => {
    return document.getElementById(CATERING_MODAL_ID);
  };

  const trapCateringFocus = (event) => {
    if (event.key !== 'Tab') {
      return;
    }

    const modal = document.getElementById(CATERING_MODAL_ID);
    if (!modal || !modal.classList.contains('is-open')) {
      return;
    }

    const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(modal.querySelectorAll(focusableSelectors)).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));

    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const closeCateringModal = () => {
    const modal = document.getElementById(CATERING_MODAL_ID);
    if (!modal) {
      return;
    }

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';

    document.removeEventListener('keydown', cateringKeydownHandler);

    if (lastCateringFocusedElement && typeof lastCateringFocusedElement.focus === 'function') {
      lastCateringFocusedElement.focus();
    }
  };

  const openCateringModal = () => {
    const modal = ensureCateringModal();
    if (!modal) {
      return;
    }

    lastCateringFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';

    const dialog = modal.querySelector('.catering-modal__dialog');
    if (dialog) {
      setTimeout(() => {
        dialog.focus();
      }, 50);
    }

    cateringKeydownHandler = (event) => {
      if (event.key === 'Escape') {
        closeCateringModal();
        return;
      }
      trapCateringFocus(event);
    };

    document.addEventListener('keydown', cateringKeydownHandler);

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeCateringModal();
      }
    });

    modal.querySelectorAll('[data-catering-modal-close]').forEach((closeButton) => {
      closeButton.addEventListener('click', closeCateringModal);
    });
  };

  const cateringTriggers = document.querySelectorAll('[data-catering-modal-trigger]');
  cateringTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openCateringModal();
    });
  });

  // Catering Form Submission
  const cateringForm = document.getElementById('cateringInquiry');
  if (cateringForm) {
    cateringForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      clearFormStatus(cateringForm);
      
      const formData = new FormData(cateringForm);
      
      try {
        const response = await fetch(cateringForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          showFormStatus(cateringForm, 'success', 'Thanks for contacting Red River Cantina about catering. Our team will follow up shortly.');
          cateringForm.reset();
        } else {
          showFormStatus(cateringForm, 'error', 'There was a problem submitting your request. Please try again or call us directly.');
        }
      } catch (error) {
        showFormStatus(cateringForm, 'error', 'There was a problem submitting your request. Please try again or call us directly.');
      }
    });
  }

  const standardForms = document.querySelectorAll('.career-application-form');
  standardForms.forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      clearFormStatus(form);
      
      const formData = new FormData(form);
      
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          showFormStatus(form, 'success', 'Thanks for contacting Red River Cantina. Our team will follow up shortly.');
          form.reset();
        } else {
          showFormStatus(form, 'error', 'There was a problem submitting your application. Please try again or call us directly.');
        }
      } catch (error) {
        showFormStatus(form, 'error', 'There was a problem submitting your application. Please try again or call us directly.');
      }
    });
  });
});
