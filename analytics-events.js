(function () {
  'use strict';

  if (window.rrAnalytics) return;

  var BRAND = 'red_river_cantina';
  var path = window.location.pathname.toLowerCase();

  function locationId() {
    if (path.indexOf('/leaguecity/') === 0) return 'league_city';
    if (path.indexOf('/richmond/') === 0) return 'richmond';
    return 'brand_selector';
  }

  function cleanParams(params) {
    var allowed = ['brand', 'location_id', 'provider', 'form_type', 'menu_type', 'social_network'];
    var clean = {};
    allowed.forEach(function (key) {
      if (params && typeof params[key] === 'string' && params[key]) clean[key] = params[key].slice(0, 80);
    });
    clean.brand = BRAND;
    clean.location_id = clean.location_id || locationId();
    return clean;
  }

  function trackEvent(name, params) {
    var eventName = String(name || '').replace(/[^a-z0-9_]/g, '').slice(0, 40);
    if (!eventName) return;
    var clean = cleanParams(params);
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, clean);
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: eventName }, clean));
    }
  }

  function formType() {
    if (path.indexOf('career') !== -1) return 'career_application';
    if (path.indexOf('community') !== -1) return 'community_request';
    if (path.indexOf('party-room') !== -1) return 'party_room';
    if (path.indexOf('catering') !== -1) return 'catering';
    return 'contact';
  }

  function providerFor(url) {
    var host = url.hostname.toLowerCase();
    if (host.indexOf('toast') !== -1) return 'toast';
    if (host === 'order.redriverrestaurants.com') return 'toast';
    if (host === 'order.online') return 'order_online';
    if (host.indexOf('doordash') !== -1) return 'doordash';
    if (host.indexOf('google.') !== -1 || host.indexOf('goo.gl') !== -1) return 'google';
    if (host.indexOf('facebook') !== -1) return 'facebook';
    if (host.indexOf('instagram') !== -1) return 'instagram';
    if (host.indexOf('tock') !== -1) return 'tock';
    if (host.indexOf('opentable') !== -1) return 'opentable';
    if (host.indexOf('resy') !== -1) return 'resy';
    if (host.indexOf('yelp') !== -1) return 'yelp';
    return 'website';
  }

  function menuTypeFor(url) {
    var targetPath = url.pathname.toLowerCase();
    if (targetPath.indexOf('to-go') !== -1 || targetPath.indexOf('pickup') !== -1) return 'to_go';
    if (targetPath.indexOf('gluten') !== -1 || targetPath.indexOf('vegetarian') !== -1) return 'dietary';
    if (targetPath.indexOf('/bar') !== -1) return 'bar';
    return 'dine_in';
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (!href || href === '#' || href.indexOf('javascript:') === 0) return;

    if (href.indexOf('tel:') === 0) {
      trackEvent('click_phone', { provider: 'phone' });
      return;
    }

    var url;
    try { url = new URL(href, window.location.href); } catch (error) { return; }
    var host = url.hostname.toLowerCase();
    var targetPath = url.pathname.toLowerCase();
    var provider = providerFor(url);

    var isDirections = host === 'maps.app.goo.gl' || host === 'goo.gl' ||
      (host.indexOf('google.') !== -1 && (targetPath.indexOf('/maps') !== -1 || url.searchParams.has('destination')));

    if (isDirections) {
      trackEvent('click_directions', { provider: 'google' });
    } else if (host.indexOf('giftcard') !== -1 || targetPath.indexOf('giftcard') !== -1 || targetPath.indexOf('gift-card') !== -1) {
      trackEvent('click_gift_card', { provider: provider });
    } else if (targetPath.indexOf('marketing-signup') !== -1) {
      trackEvent('click_email_signup', { provider: provider });
    } else if (targetPath.indexOf('reward') !== -1) {
      trackEvent('click_rewards', { provider: provider });
    } else if (host.indexOf('facebook') !== -1 || host.indexOf('instagram') !== -1) {
      trackEvent('click_social', { provider: provider, social_network: provider });
    } else if (host.indexOf('tock') !== -1 || host.indexOf('opentable') !== -1 || host.indexOf('resy') !== -1 || targetPath.indexOf('waitlist') !== -1) {
      trackEvent('click_reservation', { provider: provider });
    } else if (host.indexOf('order.') === 0 || host.indexOf('doordash') !== -1 || targetPath.indexOf('/order') !== -1) {
      trackEvent('click_order', { provider: provider });
    } else if (targetPath.indexOf('career') !== -1) {
      trackEvent('click_careers', { provider: url.origin === window.location.origin ? 'website' : provider });
    } else if (targetPath.indexOf('menu') !== -1) {
      trackEvent('view_menu', { provider: url.origin === window.location.origin ? 'website' : provider, menu_type: menuTypeFor(url) });
    } else if (locationId() === 'brand_selector' && (targetPath.indexOf('/leaguecity/') === 0 || targetPath.indexOf('/richmond/') === 0)) {
      trackEvent('select_location', { location_id: targetPath.indexOf('/richmond/') === 0 ? 'richmond' : 'league_city', provider: 'website' });
    }
  });

  var originalFetch = window.fetch;
  if (typeof originalFetch === 'function') {
    window.fetch = function () {
      var args = arguments;
      var requestUrl = '';
      try { requestUrl = typeof args[0] === 'string' ? args[0] : args[0].url; } catch (error) {}
      var isFormspree = /https:\/\/formspree\.io\/f\//i.test(requestUrl);
      return originalFetch.apply(this, args).then(function (response) {
        if (isFormspree) {
          trackEvent(response.ok ? 'generate_lead' : 'form_error', {
            provider: 'formspree',
            form_type: formType()
          });
        }
        return response;
      }).catch(function (error) {
        if (isFormspree) trackEvent('form_error', { provider: 'formspree', form_type: formType() });
        throw error;
      });
    };
  }

  window.rrAnalytics = {
    trackEvent: trackEvent,
    trackLead: function (type, provider) { trackEvent('generate_lead', { form_type: type, provider: provider || 'website' }); },
    trackFormError: function (type, provider) { trackEvent('form_error', { form_type: type, provider: provider || 'website' }); }
  };
})();
