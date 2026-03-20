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
  const pickupUrl = 'https://order.redriverrestaurants.com/order/redrivercantina-richmond';
  const deliveryUrl = 'https://order.online/store/red-river-cantina-richmond-25078785/?delivery=true&hideModal=true';
  const modalMarkup = `
    <div class="order-modal" id="${ORDER_MODAL_ID}" aria-hidden="true" role="dialog" aria-labelledby="order-modal-title">
      <div class="order-modal__dialog" tabindex="-1">
        <button type="button" class="order-modal__close" data-modal-close aria-label="Close order options">×</button>
        <p class="order-modal__eyebrow">Richmond, Texas</p>
        <h2 class="order-modal__title" id="order-modal-title">Order Online</h2>
        <p class="order-modal__subtitle">Choose how you would like to enjoy Red River Cantina from our Richmond location.</p>
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

  // Party Room Modal
  const PARTY_MODAL_ID = 'party-modal';
  let partyLastFocusedElement = null;
  let partyKeydownHandler = null;

  const closePartyModal = () => {
    const modal = document.getElementById(PARTY_MODAL_ID);
    if (!modal) {
      return;
    }

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';

    document.removeEventListener('keydown', partyKeydownHandler);

    if (partyLastFocusedElement && typeof partyLastFocusedElement.focus === 'function') {
      partyLastFocusedElement.focus();
    }
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

  const openPartyModal = () => {
    const modal = document.getElementById(PARTY_MODAL_ID);
    if (!modal) {
      return;
    }

    partyLastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';

    const firstInput = modal.querySelector('input');
    window.requestAnimationFrame(() => {
      if (firstInput) {
        firstInput.focus();
      }
    });

    partyKeydownHandler = (event) => {
      if (event.key === 'Escape') {
        closePartyModal();
        return;
      }
      trapPartyFocus(event);
    };

    document.addEventListener('keydown', partyKeydownHandler);
  };

  // Party modal triggers
  const partyTriggers = document.querySelectorAll('[data-party-modal-trigger]');
  partyTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openPartyModal();
    });
  });

  // Party modal close handlers
  const partyModal = document.getElementById(PARTY_MODAL_ID);
  if (partyModal) {
    partyModal.addEventListener('click', (event) => {
      if (event.target === partyModal) {
        closePartyModal();
      }
    });

    partyModal.querySelectorAll('[data-party-modal-close]').forEach((closeButton) => {
      closeButton.addEventListener('click', closePartyModal);
    });
  }

  // Party Room form submission (Formspree)
  const partyForm = document.querySelector('form[data-party-form]');
  if (partyForm instanceof HTMLFormElement) {
    const submitButton = partyForm.querySelector('button[type="submit"]');
    const statusElement = partyForm.querySelector('.form-submit-status');

    const setPartyStatus = (type, message) => {
      if (!(statusElement instanceof HTMLElement)) {
        return;
      }

      statusElement.textContent = message;
      statusElement.classList.add('is-visible');
      statusElement.classList.remove('is-loading', 'is-success', 'is-error');

      if (type) {
        statusElement.classList.add(type);
      }
    };

    const resetPartyStatus = () => {
      if (!(statusElement instanceof HTMLElement)) {
        return;
      }

      statusElement.textContent = '';
      statusElement.classList.remove('is-visible', 'is-loading', 'is-success', 'is-error');
    };

    partyForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!partyForm.checkValidity()) {
        partyForm.reportValidity();
        return;
      }

      const action = partyForm.getAttribute('action');
      if (!action) {
        setPartyStatus('is-error', 'Unable to send right now. Please call us at 346-279-1192.');
        return;
      }

      const messageField = partyForm.querySelector('textarea[name="message"]');
      const messageText = messageField instanceof HTMLTextAreaElement ? messageField.value.trim() : '';
      if (messageText && messageText.length < 10) {
        setPartyStatus('is-error', 'Please add a bit more detail or leave the message blank.');
        if (messageField instanceof HTMLTextAreaElement) {
          messageField.focus();
        }
        return;
      }

      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = true;
      }
      setPartyStatus('is-loading', 'Sending your inquiry...');

      try {
        const formData = new FormData(partyForm);
        formData.set('_gotcha', '');

        const emailValue = formData.get('email');
        if (typeof emailValue === 'string' && emailValue.trim()) {
          formData.set('_replyto', emailValue.trim());
        }

        // Generate unique subject
        const name = formData.get('name') || '';
        const eventDate = formData.get('eventDate') || '';
        const timestamp = new Date().toISOString();
        let subject = 'Red River Cantina Party Room Inquiry';
        if (name) subject += ` - ${name}`;
        if (eventDate) subject += ` - ${eventDate}`;
        subject += ` - ${timestamp}`;
        formData.set('_subject', subject);

        formData.set('source_page', window.location.pathname);
        formData.set('submitted_at', new Date().toISOString());

        const response = await fetch(action, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Submission failed');
        }

        partyForm.reset();
        setPartyStatus('is-success', 'Thanks for contacting Red River BBQ about the Party Room. Our team will follow up shortly.');
      } catch (_error) {
        setPartyStatus('is-error', 'There was a problem sending your inquiry. Please try again or call us at 346-279-1192.');
      } finally {
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = false;
        }
      }
    });

    partyForm.addEventListener('input', resetPartyStatus);
  }

  // Catering Modal
  const CATERING_MODAL_ID = 'catering-modal';
  let cateringLastFocusedElement = null;
  let cateringKeydownHandler = null;

  const closeCateringModal = () => {
    const modal = document.getElementById(CATERING_MODAL_ID);
    if (!modal) {
      return;
    }

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';

    document.removeEventListener('keydown', cateringKeydownHandler);

    if (cateringLastFocusedElement && typeof cateringLastFocusedElement.focus === 'function') {
      cateringLastFocusedElement.focus();
    }
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

  const openCateringModal = () => {
    const modal = document.getElementById(CATERING_MODAL_ID);
    if (!modal) {
      return;
    }

    cateringLastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';

    const firstInput = modal.querySelector('input');
    window.requestAnimationFrame(() => {
      if (firstInput) {
        firstInput.focus();
      }
    });

    cateringKeydownHandler = (event) => {
      if (event.key === 'Escape') {
        closeCateringModal();
        return;
      }
      trapCateringFocus(event);
    };

    document.addEventListener('keydown', cateringKeydownHandler);
  };

  // Catering modal triggers
  const cateringTriggers = document.querySelectorAll('[data-catering-modal-trigger]');
  cateringTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openCateringModal();
    });
  });

  // Catering modal close handlers
  const cateringModal = document.getElementById(CATERING_MODAL_ID);
  if (cateringModal) {
    cateringModal.addEventListener('click', (event) => {
      if (event.target === cateringModal) {
        closeCateringModal();
      }
    });

    cateringModal.querySelectorAll('[data-catering-modal-close]').forEach((closeButton) => {
      closeButton.addEventListener('click', closeCateringModal);
    });
  }

  // Catering form submission (Formspree)
  const cateringForms = document.querySelectorAll('form[data-catering-form]');
  cateringForms.forEach((cateringForm) => {
    if (!(cateringForm instanceof HTMLFormElement)) {
      return;
    }

    const submitButton = cateringForm.querySelector('button[type="submit"]');
    const statusElement = cateringForm.querySelector('.form-submit-status');

    const setCateringStatus = (type, message) => {
      if (!(statusElement instanceof HTMLElement)) {
        return;
      }

      statusElement.textContent = message;
      statusElement.classList.add('is-visible');
      statusElement.classList.remove('is-loading', 'is-success', 'is-error');

      if (type) {
        statusElement.classList.add(type);
      }
    };

    const resetCateringStatus = () => {
      if (!(statusElement instanceof HTMLElement)) {
        return;
      }

      statusElement.textContent = '';
      statusElement.classList.remove('is-visible', 'is-loading', 'is-success', 'is-error');
    };

    cateringForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!cateringForm.checkValidity()) {
        cateringForm.reportValidity();
        return;
      }

      const emailField = cateringForm.querySelector('input[name="email"]');
      const confirmEmailField = cateringForm.querySelector('input[name="confirmEmail"]');
      if (
        emailField instanceof HTMLInputElement &&
        confirmEmailField instanceof HTMLInputElement &&
        emailField.value.trim() !== confirmEmailField.value.trim()
      ) {
        setCateringStatus('is-error', 'Email and Confirm Email must match.');
        confirmEmailField.focus();
        return;
      }

      const messageField = cateringForm.querySelector('textarea[name="message"]');
      const messageText = messageField instanceof HTMLTextAreaElement ? messageField.value.trim() : '';
      if (messageText.length < 10) {
        setCateringStatus('is-error', 'Please include a little more detail about your event.');
        if (messageField instanceof HTMLTextAreaElement) {
          messageField.focus();
        }
        return;
      }

      const action = cateringForm.getAttribute('action');
      if (!action) {
        setCateringStatus('is-error', 'Unable to send right now. Please call us at 346-279-1192.');
        return;
      }

      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = true;
      }
      setCateringStatus('is-loading', 'Sending your catering request...');

      try {
        const formData = new FormData(cateringForm);
        formData.set('_gotcha', '');

        const emailValue = formData.get('email');
        if (typeof emailValue === 'string' && emailValue.trim()) {
          formData.set('_replyto', emailValue.trim());
        }

        // Generate unique subject
        const firstName = formData.get('firstName') || '';
        const lastName = formData.get('lastName') || '';
        const name = formData.get('name') || '';
        const eventDate = formData.get('eventDate') || '';
        const timestamp = new Date().toISOString();
        let subject = 'Red River Cantina Catering Inquiry';
        if (firstName && lastName) {
          subject += ` - ${firstName} ${lastName}`;
        } else if (name) {
          subject += ` - ${name}`;
        }
        if (eventDate) subject += ` - ${eventDate}`;
        subject += ` - ${timestamp}`;
        formData.set('_subject', subject);

        formData.set('source_page', window.location.pathname);
        formData.set('submitted_at', new Date().toISOString());

        const response = await fetch(action, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Submission failed');
        }

        cateringForm.reset();
        setCateringStatus('is-success', 'Thanks for your catering request. Our team will follow up shortly.');
      } catch (_error) {
        setCateringStatus('is-error', 'There was a problem sending your request. Please try again or call us at 346-279-1192.');
      } finally {
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = false;
        }
      }
    });

    cateringForm.addEventListener('input', resetCateringStatus);
  });

  // Careers form submission (Formspree)
  const careersForm = document.querySelector('form[data-careers-form]');
  if (careersForm instanceof HTMLFormElement) {
    const submitButton = careersForm.querySelector('button[type="submit"]');
    const statusElement = careersForm.querySelector('.form-submit-status');

    const setCareersStatus = (type, message) => {
      if (!(statusElement instanceof HTMLElement)) {
        return;
      }

      statusElement.textContent = message;
      statusElement.classList.add('is-visible');
      statusElement.classList.remove('is-loading', 'is-success', 'is-error');

      if (type) {
        statusElement.classList.add(type);
      }
    };

    const resetCareersStatus = () => {
      if (!(statusElement instanceof HTMLElement)) {
        return;
      }

      statusElement.textContent = '';
      statusElement.classList.remove('is-visible', 'is-loading', 'is-success', 'is-error');
    };

    careersForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!careersForm.checkValidity()) {
        careersForm.reportValidity();
        return;
      }

      const action = careersForm.getAttribute('action');
      if (!action) {
        setCareersStatus('is-error', 'Unable to send right now. Please call us at 346-279-1192.');
        return;
      }

      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = true;
      }
      setCareersStatus('is-loading', 'Sending your application...');

      try {
        const formData = new FormData(careersForm);
        formData.set('_gotcha', '');

        const emailValue = formData.get('email');
        if (typeof emailValue === 'string' && emailValue.trim()) {
          formData.set('_replyto', emailValue.trim());
        }

        // Generate unique subject
        const firstName = formData.get('firstName') || '';
        const lastName = formData.get('lastName') || '';
        const name = formData.get('name') || '';
        const timestamp = new Date().toISOString();
        let subject = 'Red River Cantina Careers Application';
        if (firstName && lastName) {
          subject += ` - ${firstName} ${lastName}`;
        } else if (name) {
          subject += ` - ${name}`;
        }
        subject += ` - ${timestamp}`;
        formData.set('_subject', subject);

        formData.set('source_page', window.location.pathname);
        formData.set('submitted_at', new Date().toISOString());

        const response = await fetch(action, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Submission failed');
        }

        careersForm.reset();
        setCareersStatus('is-success', 'Thanks for applying to Red River Cantina. Our team will review your application and follow up.');
      } catch (_error) {
        setCareersStatus('is-error', 'There was a problem sending your application. Please try again or call us at 346-279-1192.');
      } finally {
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = false;
        }
      }
    });

    careersForm.addEventListener('input', resetCareersStatus);
  }

  // Community form submission (Formspree)
  const communityForm = document.querySelector('form[data-community-form]');
  if (communityForm instanceof HTMLFormElement) {
    const submitButton = communityForm.querySelector('button[type="submit"]');
    const statusElement = communityForm.querySelector('.form-submit-status');

    const setCommunityStatus = (type, message) => {
      if (!(statusElement instanceof HTMLElement)) {
        return;
      }

      statusElement.textContent = message;
      statusElement.classList.add('is-visible');
      statusElement.classList.remove('is-loading', 'is-success', 'is-error');

      if (type) {
        statusElement.classList.add(type);
      }
    };

    const resetCommunityStatus = () => {
      if (!(statusElement instanceof HTMLElement)) {
        return;
      }

      statusElement.textContent = '';
      statusElement.classList.remove('is-visible', 'is-loading', 'is-success', 'is-error');
    };

    communityForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!communityForm.checkValidity()) {
        communityForm.reportValidity();
        return;
      }

      const action = communityForm.getAttribute('action');
      if (!action) {
        setCommunityStatus('is-error', 'Unable to send right now. Please call us at 346-279-1192.');
        return;
      }

      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = true;
      }
      setCommunityStatus('is-loading', 'Sending your application...');

      try {
        const formData = new FormData(communityForm);
        formData.set('_gotcha', '');

        const emailValue = formData.get('contactEmail');
        if (typeof emailValue === 'string' && emailValue.trim()) {
          formData.set('_replyto', emailValue.trim());
        }

        // Generate unique subject
        const firstName = formData.get('firstName') || '';
        const lastName = formData.get('lastName') || '';
        const name = formData.get('name') || '';
        const timestamp = new Date().toISOString();
        let subject = 'Red River Cantina Community Spirit Night Application';
        if (firstName && lastName) {
          subject += ` - ${firstName} ${lastName}`;
        } else if (name) {
          subject += ` - ${name}`;
        }
        subject += ` - ${timestamp}`;
        formData.set('_subject', subject);

        formData.set('source_page', window.location.pathname);
        formData.set('submitted_at', new Date().toISOString());

        const response = await fetch(action, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Submission failed');
        }

        communityForm.reset();
        setCommunityStatus('is-success', 'Thanks for your Spirit Night application. Our team will follow up within two business days.');
      } catch (_error) {
        setCommunityStatus('is-error', 'There was a problem sending your application. Please try again or call us at 346-279-1192.');
      } finally {
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = false;
        }
      }
    });

    communityForm.addEventListener('input', resetCommunityStatus);
  }

  // Concerns Modal
  const CONCERNS_MODAL_ID = 'concerns-modal';
  let concernsLastFocusedElement = null;
  let concernsKeydownHandler = null;

  const closeConcernsModal = () => {
    const modal = document.getElementById(CONCERNS_MODAL_ID);
    if (!modal) {
      return;
    }

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';

    document.removeEventListener('keydown', concernsKeydownHandler);

    if (concernsLastFocusedElement && typeof concernsLastFocusedElement.focus === 'function') {
      concernsLastFocusedElement.focus();
    }
  };

  const trapConcernsFocus = (event) => {
    if (event.key !== 'Tab') {
      return;
    }

    const modal = document.getElementById(CONCERNS_MODAL_ID);
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

  const openConcernsModal = () => {
    const modal = document.getElementById(CONCERNS_MODAL_ID);
    if (!modal) {
      return;
    }

    concernsLastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';

    const firstInput = modal.querySelector('input');
    window.requestAnimationFrame(() => {
      if (firstInput) {
        firstInput.focus();
      }
    });

    concernsKeydownHandler = (event) => {
      if (event.key === 'Escape') {
        closeConcernsModal();
        return;
      }
      trapConcernsFocus(event);
    };

    document.addEventListener('keydown', concernsKeydownHandler);
  };

  // Concerns modal triggers
  const concernsTriggers = document.querySelectorAll('[data-concerns-modal-trigger]');
  concernsTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openConcernsModal();
    });
  });

  // Concerns modal close handlers
  const concernsModal = document.getElementById(CONCERNS_MODAL_ID);
  if (concernsModal) {
    concernsModal.addEventListener('click', (event) => {
      if (event.target === concernsModal) {
        closeConcernsModal();
      }
    });

    concernsModal.querySelectorAll('[data-concerns-modal-close]').forEach((closeButton) => {
      closeButton.addEventListener('click', closeConcernsModal);
    });
  }

  // Concerns form submission (Formspree)
  const concernsForm = document.querySelector('.concerns-modal__form');
  if (concernsForm instanceof HTMLFormElement) {
    const submitButton = concernsForm.querySelector('button[type="submit"]');
    const statusElement = concernsForm.querySelector('.concerns-modal__status');

    const setFormStatus = (type, message) => {
      if (!(statusElement instanceof HTMLElement)) {
        return;
      }

      statusElement.textContent = message;
      statusElement.classList.add('is-visible');
      statusElement.classList.remove('is-loading', 'is-success', 'is-error');

      if (type) {
        statusElement.classList.add(type);
      }
    };

    const resetFormStatus = () => {
      if (!(statusElement instanceof HTMLElement)) {
        return;
      }

      statusElement.textContent = '';
      statusElement.classList.remove('is-visible', 'is-loading', 'is-success', 'is-error');
    };

    concernsForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!concernsForm.checkValidity()) {
        concernsForm.reportValidity();
        return;
      }

      const action = concernsForm.getAttribute('action');
      if (!action) {
        setFormStatus('is-error', 'Unable to send right now. Please call us at (281) 277-5060.');
        return;
      }

      const messageField = concernsForm.querySelector('textarea[name="message"]');
      const messageText = messageField instanceof HTMLTextAreaElement ? messageField.value.trim() : '';
      if (messageText.length < 10) {
        setFormStatus('is-error', 'Please include a little more detail so we can help you quickly.');
        if (messageField instanceof HTMLTextAreaElement) {
          messageField.focus();
        }
        return;
      }

      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = true;
      }
      setFormStatus('is-loading', 'Sending your message...');

      try {
        const formData = new FormData(concernsForm);
        // Keep honeypot empty even if browser tools inject values.
        formData.set('_gotcha', '');
        const emailValue = formData.get('email');
        if (typeof emailValue === 'string' && emailValue.trim()) {
          formData.set('_replyto', emailValue.trim());
        }

        // Generate unique subject
        const name = formData.get('name') || '';
        const timestamp = new Date().toISOString();
        let subject = 'Red River Cantina Questions or Concerns';
        if (name) subject += ` - ${name}`;
        subject += ` - ${timestamp}`;
        formData.set('_subject', subject);

        formData.set('source_page', window.location.pathname);
        formData.set('submitted_at', new Date().toISOString());

        const response = await fetch(action, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Submission failed');
        }

        concernsForm.reset();
        setFormStatus('is-success', 'Thanks for contacting Red River Cantina. Our team will follow up shortly.');
      } catch (_error) {
        setFormStatus('is-error', 'There was a problem sending your message. Please try again or call us at (281) 277-5060.');
      } finally {
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = false;
        }
      }
    });

    concernsForm.addEventListener('input', resetFormStatus);
  }

  // Reservation Modal
  const RESERVATION_MODAL_ID = 'reservation-modal';
  let reservationLastFocused = null;

  const closeReservationModal = () => {
    const modal = document.getElementById(RESERVATION_MODAL_ID);
    if (!modal) return;

    modal.setAttribute('data-visible', 'false');
    modal.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';

    if (reservationLastFocused && typeof reservationLastFocused.focus === 'function') {
      reservationLastFocused.focus();
    }
  };

  const openReservationModal = () => {
    const modal = document.getElementById(RESERVATION_MODAL_ID);
    if (!modal) return;

    reservationLastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    modal.setAttribute('data-visible', 'true');
    modal.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';

    const firstInput = modal.querySelector('input, select, textarea');
    window.requestAnimationFrame(() => {
      if (firstInput) firstInput.focus();
    });
  };

  // Reservation modal triggers
  document.querySelectorAll('[data-reservation-open]').forEach((btn) => {
    btn.addEventListener('click', openReservationModal);
  });

  const reservationModal = document.getElementById(RESERVATION_MODAL_ID);
  if (reservationModal) {
    reservationModal.addEventListener('click', (event) => {
      if (event.target === reservationModal) {
        closeReservationModal();
      }
    });

    reservationModal.querySelectorAll('[data-reservation-close]').forEach((btn) => {
      btn.addEventListener('click', closeReservationModal);
    });
  }

  // Handle reservation form submission
  const reservationForm = document.getElementById('reservation-form');
  if (reservationForm) {
    reservationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(reservationForm);
      const messageDiv = document.getElementById('reservation-message');

      // Convert military time to standard time format
      const timeInput = reservationForm.querySelector('input[name="time"]');
      if (timeInput && timeInput.value) {
        const militaryTime = timeInput.value;
        const [hours, minutes] = militaryTime.split(':');
        const hour12 = hours % 12 || 12;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const standardTime = `${hour12}:${minutes} ${ampm}`;
        formData.set('time', standardTime);
      }

      // Generate unique subject
      const name = formData.get('name') || '';
      const date = formData.get('date') || '';
      const timestamp = new Date().toISOString();
      let subject = 'Red River Cantina Reservation Request';
      if (name) subject += ` - ${name}`;
      if (date) subject += ` - ${date}`;
      subject += ` - ${timestamp}`;
      formData.set('_subject', subject);

      messageDiv.textContent = 'Submitting your reservation...';
      messageDiv.setAttribute('data-visible', 'true');
      messageDiv.className = 'reservation-form__message reservation-form__message--info';

      try {
        const response = await fetch(reservationForm.action, {
          method: reservationForm.method,
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          messageDiv.textContent = 'Thank you! Your reservation request has been submitted. We will contact you shortly to confirm.';
          messageDiv.className = 'reservation-form__message reservation-form__message--success';
          reservationForm.reset();
          
          setTimeout(() => {
            closeReservationModal();
            setTimeout(() => {
              messageDiv.textContent = '';
              messageDiv.className = 'reservation-form__message';
              messageDiv.setAttribute('data-visible', 'false');
            }, 300);
          }, 3000);
        } else {
          // If fetch fails, try traditional form submission
          messageDiv.textContent = 'Redirecting to complete your reservation...';
          setTimeout(() => {
            reservationForm.target = '_blank';
            reservationForm.submit();
            messageDiv.textContent = 'Thank you! Your reservation form has been submitted. Please check the new tab and contact us at 346-279-1192 to confirm.';
            messageDiv.className = 'reservation-form__message reservation-form__message--success';
            setTimeout(closeReservationModal, 2000);
          }, 1000);
        }
      } catch (error) {
        console.error('Reservation form error:', error);
        // Fallback to traditional form submission
        messageDiv.textContent = 'Redirecting to complete your reservation...';
        setTimeout(() => {
          reservationForm.target = '_blank';
          reservationForm.submit();
          messageDiv.textContent = 'Thank you! Your reservation form has been submitted. Please check the new tab to confirm or call us at 346-279-1192.';
          messageDiv.className = 'reservation-form__message reservation-form__message--success';
          setTimeout(closeReservationModal, 2000);
        }, 1000);
      }
    });
  }

  // Handle ESC key to close reservation modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.getElementById(RESERVATION_MODAL_ID)?.getAttribute('data-visible') === 'true') {
        closeReservationModal();
      }
    }
  });
});
