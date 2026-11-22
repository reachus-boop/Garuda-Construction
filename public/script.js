/* Terra & Timber — minimal progressive enhancement
   1. Scroll reveals (staggered)
   2. Header state + accessible mobile menu
   3. Footer year
*/
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var canonical = document.querySelector('link[rel="canonical"]');
  var analyticsReady = Promise.resolve(null);
  if (canonical && window.location.origin === new URL(canonical.href).origin && /^https:/.test(canonical.href)) {
    analyticsReady = fetch('/api/analytics-config', { credentials: 'omit' })
      .then(function (response) { return response.ok ? response.json() : null; })
      .then(function (config) {
        if (!config || !/^G-[A-Z0-9]+$/.test(config.measurementId)) return null;

        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', config.measurementId, {
          page_location: canonical.href,
          page_referrer: document.referrer ? new URL(document.referrer).origin : '',
          allow_google_signals: false,
          allow_ad_personalization_signals: false
        });

        var tag = document.createElement('script');
        tag.async = true;
        tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + config.measurementId;
        document.head.appendChild(tag);
        return gtag;
      })
      .catch(function () { return null; });
  }

  function trackAnalytics(eventName, params) {
    analyticsReady.then(function (gtag) {
      if (gtag) gtag('event', eventName, params);
    });
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href]');
    if (!link) return;
    if (link.protocol === 'tel:') {
      trackAnalytics('phone_click');
    } else if (link.hostname === 'wa.me' || link.hostname === 'api.whatsapp.com') {
      // WhatsApp links can contain enquiry details. Record the action only.
      trackAnalytics('whatsapp_click');
    }
  }, true);

  function saveLead(details, leadType) {
    return fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    }).then(function (response) {
      if (response.status !== 201) throw new Error('Lead was not saved');
      if (leadType) trackAnalytics('generate_lead', { lead_source: leadType });
    });
  }

  /* ---------- 1. Scroll reveals ---------- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  function showAll() {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  function revealTargetHash() {
    if (window.location.hash) {
      try {
        var target = document.querySelector(window.location.hash);
        if (target) {
          var items = target.querySelectorAll('[data-reveal]');
          Array.prototype.forEach.call(items, function (el) {
            el.classList.add('is-visible');
          });
        }
      } catch (err) {}
    }
  }

  function stagger(el) {
    var parent = el.parentElement;
    if (!parent) return 0;
    var siblings = Array.prototype.filter.call(parent.children, function (child) {
      return child.hasAttribute && child.hasAttribute('data-reveal');
    });
    var index = siblings.indexOf(el);
    if (index < 0 || siblings.length < 2) return 0;
    return Math.min(index, 5) * 60;
  }

  if (!reduceMotion.matches && 'IntersectionObserver' in window && revealables.length) {
    // Immediately reveal anything currently visible or near viewport
    var vh = window.innerHeight || document.documentElement.clientHeight;
    revealables.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top <= vh + 100) {
        el.classList.add('is-visible');
      }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = stagger(el);
        if (delay) el.style.transitionDelay = delay + 'ms';
        el.classList.add('is-visible');
        observer.unobserve(el);
      });
    }, { rootMargin: '120px 0px 80px 0px', threshold: 0.01 });

    revealables.forEach(function (el) {
      if (!el.classList.contains('is-visible')) {
        observer.observe(el);
      }
    });

    window.addEventListener('hashchange', revealTargetHash);
    setTimeout(revealTargetHash, 50);
  } else {
    showAll();
  }

  reduceMotion.addEventListener('change', function (event) {
    if (event.matches) showAll();
  });

  /* ---------- 2. Header + mobile menu ---------- */
  var header = document.querySelector('.header');
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.getElementById('mobile-nav');

  if (header && toggle && panel) {
    var setOpen = function (open) {
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.visually-hidden').textContent = open ? 'Close menu' : 'Open menu';
      document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    panel.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && header.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1023 && header.classList.contains('is-open')) setOpen(false);
    });

    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 3. Animated Stats Counter ---------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-counter]'));

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-counter'));
    if (isNaN(target)) return;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = parseInt(el.getAttribute('data-duration'), 10) || 1600;
    var startVal = 0;
    var startTime = null;

    if (reduceMotion.matches) {
      el.textContent = prefix + target.toLocaleString('en-IN') + suffix;
      return;
    }

    function update(now) {
      if (!startTime) startTime = now;
      var elapsed = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      var current = Math.round(startVal + (target - startVal) * ease);
      el.textContent = prefix + current.toLocaleString('en-IN') + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toLocaleString('en-IN') + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  if (!reduceMotion.matches && 'IntersectionObserver' in window && counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) { runCounter(el); });
  }

  /* ---------- 4. Floating Contact Speed Dial ---------- */
  var fab = document.getElementById('fab-contact');
  var fabTrigger = document.getElementById('fab-trigger');
  var fabOptions = document.getElementById('fab-options');

  if (fab && fabTrigger) {
    var toggleFab = function (forceState) {
      var isOpen = typeof forceState === 'boolean' ? forceState : !fab.classList.contains('is-open');
      fab.classList.toggle('is-open', isOpen);
      fabTrigger.setAttribute('aria-expanded', String(isOpen));
      if (fabOptions) fabOptions.setAttribute('aria-hidden', String(!isOpen));
    };

    fabTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleFab();
    });

    document.addEventListener('click', function (e) {
      if (fab.classList.contains('is-open') && !fab.contains(e.target)) {
        toggleFab(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && fab.classList.contains('is-open')) {
        toggleFab(false);
        fabTrigger.focus();
      }
    });
  }

  /* ---------- 5. Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- 6. Sharp Contact Form Handler ---------- */
  window.handleFormSubmit = function (e, serviceName) {
    if (e && e.preventDefault) e.preventDefault();
    var form = e.target;
    var nameInput = form.querySelector('input[name="name"]');
    var phoneInput = form.querySelector('input[name="phone"]');
    var emailInput = form.querySelector('input[name="email"]');
    var locInput = form.querySelector('input[name="location"]') || form.querySelector('input[name="message"]');
    var sqftInput = form.querySelector('input[name="sqft"]');
    var serviceSelect = form.querySelector('select[name="service"]');
    var sourceInput = form.querySelector('input[name="source"]');

    var name = nameInput && nameInput.value ? nameInput.value.trim() : 'Customer';
    var phone = phoneInput && phoneInput.value ? phoneInput.value.trim() : '';
    var email = emailInput && emailInput.value ? emailInput.value.trim() : '';
    var loc = locInput && locInput.value ? locInput.value.trim() : '';
    var sqft = sqftInput && sqftInput.value ? sqftInput.value.trim() : '';
    var service = serviceSelect && serviceSelect.value ? serviceSelect.value : (serviceName || 'Construction Consultation');
    var source = sourceInput && sourceInput.value ? sourceInput.value : (window.location.pathname.split('/').pop() || 'website');

    // Save lead to MongoDB database
    saveLead({
      name: name,
      phone: phone,
      email: email,
      service: service,
      location: loc,
      sqft: sqft,
      source: source
    }, 'estimate_form').catch(function (err) {
      console.warn('Lead capture offline:', err);
    });

    var waMsg = encodeURIComponent(
      'Hi Garuda Construction, I would like to request an estimate.\n' +
      '• Name: ' + name + '\n' +
      '• Phone: ' + phone + '\n' +
      (email ? ('• Email: ' + email + '\n') : '') +
      '• Service: ' + service +
      (loc ? ('\n• Location: ' + loc) : '') +
      (sqft ? ('\n• Approx Sqft: ' + sqft) : '')
    );
    var waUrl = 'https://wa.me/918148856006?text=' + waMsg;

    form.innerHTML =
      '<div class="sharp-form__success">' +
        '<div class="sharp-form__success-icon">✓</div>' +
        '<h4 class="sharp-card__title" style="margin-top: 8px;">Ready to send, ' + name.replace(/[<>&"]/g, '') + '</h4>' +
        '<p class="sharp-card__sub" style="margin-bottom: 12px;">Your enquiry has been received. Open WhatsApp below to connect instantly with our engineering desk for your <strong>' + service.replace(/[<>&"]/g, '') + '</strong> requirement.</p>' +
        '<a class="sharp-form__submit" href="' + waUrl + '" target="_blank" rel="noopener" style="text-decoration: none;">' +
          '<span>Send via WhatsApp</span>' +
          '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h9M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</a>' +
      '</div>';
  };

  /* ---------- 7. Interactive Project Lightbox / Enlarge ---------- */
  var projectCards = Array.prototype.slice.call(document.querySelectorAll('.project'));
  if (projectCards.length) {
    var lightbox = document.getElementById('project-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'project-lightbox';
      lightbox.className = 'project-lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-label', 'Project Preview');
      lightbox.setAttribute('aria-hidden', 'true');
      lightbox.innerHTML =
        '<div class="project-lightbox__card">' +
          '<div class="project-lightbox__header">' +
            '<div class="project-lightbox__header-left">' +
              '<span class="project-lightbox__counter">1 / ' + projectCards.length + '</span>' +
              '<h3 class="project-lightbox__title">Project Preview</h3>' +
            '</div>' +
            '<button class="project-lightbox__close" type="button" aria-label="Close dialog">&times;</button>' +
          '</div>' +
          '<div class="project-lightbox__body">' +
            '<button class="project-lightbox__nav-btn project-lightbox__nav-btn--prev" type="button" aria-label="Previous project">' +
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</button>' +
            '<img class="project-lightbox__img" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1 1\'%3E%3C/svg%3E" alt="">' +
            '<button class="project-lightbox__nav-btn project-lightbox__nav-btn--next" type="button" aria-label="Next project">' +
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="project-lightbox__footer">' +
            '<div class="project-lightbox__info">' +
              '<div class="project-lightbox__meta"></div>' +
              '<p class="project-lightbox__desc"></p>' +
            '</div>' +
            '<a class="project-lightbox__cta" href="#contact">' +
              '<span>Enquire About This Build</span>' +
              '<svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7h9M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</a>' +
          '</div>' +
        '</div>';
      document.body.appendChild(lightbox);
    }

    var lbImg = lightbox.querySelector('.project-lightbox__img');
    var lbTitle = lightbox.querySelector('.project-lightbox__title');
    var lbCounter = lightbox.querySelector('.project-lightbox__counter');
    var lbMeta = lightbox.querySelector('.project-lightbox__meta');
    var lbDesc = lightbox.querySelector('.project-lightbox__desc');
    var lbCloseBtn = lightbox.querySelector('.project-lightbox__close');
    var lbPrevBtn = lightbox.querySelector('.project-lightbox__nav-btn--prev');
    var lbNextBtn = lightbox.querySelector('.project-lightbox__nav-btn--next');
    var lbCta = lightbox.querySelector('.project-lightbox__cta');

    var currentIdx = 0;
    var lastFocusedEl = null;

    var projectData = projectCards.map(function (card) {
      var img = card.querySelector('img');
      var nameEl = card.querySelector('.project__name');
      var metaEl = card.querySelector('.project__meta');
      var descEl = card.querySelector('.project__caption p');

      return {
        src: img ? (img.getAttribute('data-full-img') || img.src) : '',
        alt: img ? img.alt : 'Project',
        title: nameEl ? nameEl.textContent.trim() : 'Project Showcase',
        meta: metaEl ? metaEl.textContent.trim() : '',
        desc: descEl ? descEl.textContent.trim() : ''
      };
    });

    var renderCurrent = function (idx) {
      if (idx < 0) idx = projectData.length - 1;
      if (idx >= projectData.length) idx = 0;
      currentIdx = idx;

      var item = projectData[currentIdx];
      lbImg.src = item.src;
      lbImg.alt = item.alt;
      lbTitle.textContent = item.title;
      lbCounter.textContent = (currentIdx + 1) + ' / ' + projectData.length;
      lbMeta.textContent = item.meta;
      lbDesc.textContent = item.desc;
      lbDesc.style.display = item.desc ? 'block' : 'none';

      // Update CTA with pre-filled enquiry text or hash
      if (lbCta) {
        lbCta.href = '#contact';
        lbCta.setAttribute('data-project', item.title);
      }

      // Preload adjacent images
      var nextIdx = (currentIdx + 1) % projectData.length;
      var prevIdx = (currentIdx - 1 + projectData.length) % projectData.length;
      if (projectData[nextIdx] && projectData[nextIdx].src) {
        var preNext = new Image();
        preNext.src = projectData[nextIdx].src;
      }
      if (projectData[prevIdx] && projectData[prevIdx].src) {
        var prePrev = new Image();
        prePrev.src = projectData[prevIdx].src;
      }
    };

    var openLightbox = function (idx, triggerEl) {
      lastFocusedEl = triggerEl || document.activeElement;
      renderCurrent(idx);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (lbCloseBtn) lbCloseBtn.focus();
    };

    var closeLightbox = function () {
      if (!lightbox.classList.contains('is-open')) return;
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
        lastFocusedEl.focus();
      }
    };

    projectCards.forEach(function (card, index) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a, button')) return;
        openLightbox(index, card);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index, card);
        }
      });
    });

    if (lbCloseBtn) {
      lbCloseBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeLightbox();
      });
    }

    if (lbPrevBtn) {
      lbPrevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        renderCurrent(currentIdx - 1);
      });
    }

    if (lbNextBtn) {
      lbNextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        renderCurrent(currentIdx + 1);
      });
    }

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    if (lbCta) {
      lbCta.addEventListener('click', function (e) {
        var projectName = lbCta.getAttribute('data-project') || '';
        closeLightbox();
        // Pre-populate contact form message or service if present
        var contactSec = document.getElementById('contact');
        if (contactSec) {
          var noteInput = contactSec.querySelector('input[name="location"]') || contactSec.querySelector('input[name="message"]');
          if (noteInput && !noteInput.value) {
            noteInput.value = 'Interested in project: ' + projectName;
          }
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        renderCurrent(currentIdx - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        renderCurrent(currentIdx + 1);
      }
    });
  }

  /* ---------- 8. Specular Border & Specular Button Controller ---------- */
  var specularElements = Array.prototype.slice.call(
    document.querySelectorAll('.sharp-card, .cta-sharp-card, .specular-card, .sharp-form__submit, .specular-btn')
  );

  if (specularElements.length && !reduceMotion.matches) {
    var PROXIMITY = 250;
    var IDLE_INTENSITY = 0.35;
    var ACTIVE_INTENSITY = 1.0;

    var rafId = null;
    var mouseX = -9999;
    var mouseY = -9999;

    var updateSpecular = function () {
      rafId = null;

      specularElements.forEach(function (el) {
        var rect = el.getBoundingClientRect();

        // Distance from mouse to closest point on element boundary
        var nearX = Math.max(rect.left, Math.min(mouseX, rect.right));
        var nearY = Math.max(rect.top, Math.min(mouseY, rect.bottom));
        var distX = mouseX - nearX;
        var distY = mouseY - nearY;
        var dist = Math.sqrt(distX * distX + distY * distY);

        var intensity;
        var px;
        var py;

        if (dist <= PROXIMITY) {
          // Normalize proximity factor
          var factor = 1 - (dist / PROXIMITY);
          var easeFactor = factor * factor * (3 - 2 * factor);
          intensity = IDLE_INTENSITY + (ACTIVE_INTENSITY - IDLE_INTENSITY) * easeFactor;

          px = Math.max(0, Math.min(100, ((mouseX - rect.left) / rect.width) * 100));
          py = Math.max(0, Math.min(100, ((mouseY - rect.top) / rect.height) * 100));
        } else {
          intensity = IDLE_INTENSITY;
          px = 65;
          py = 15;
        }

        el.style.setProperty('--specular-x', px.toFixed(1) + '%');
        el.style.setProperty('--specular-y', py.toFixed(1) + '%');
        el.style.setProperty('--specular-intensity', intensity.toFixed(3));
      });
    };

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(updateSpecular);
      }
    }, { passive: true });

    window.addEventListener('mouseleave', function () {
      mouseX = -9999;
      mouseY = -9999;
      if (!rafId) {
        rafId = requestAnimationFrame(updateSpecular);
      }
    });

    // Initial setup
    updateSpecular();
  }

  /* ---------- 9. Navbar Dropdown & Mobile Menu Controller ---------- */
  var dropdownItems = Array.prototype.slice.call(document.querySelectorAll('.nav-item--dropdown'));
  dropdownItems.forEach(function (item) {
    var toggleBtn = item.querySelector('.dropdown-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function (e) {
      // If clicking toggle directly, toggle open state on mobile/touch
      var isOpen = item.classList.contains('is-open');
      dropdownItems.forEach(function (other) { other.classList.remove('is-open'); });
      item.classList.toggle('is-open', !isOpen);
      toggleBtn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item--dropdown')) {
      dropdownItems.forEach(function (item) {
        item.classList.remove('is-open');
        var btn = item.querySelector('.dropdown-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Mobile submenu toggle
  var mobileDropdownBtns = Array.prototype.slice.call(document.querySelectorAll('.mobile-nav__dropdown-btn'));
  mobileDropdownBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var sublinks = btn.nextElementSibling;
      if (!sublinks) return;
      var isOpen = sublinks.classList.contains('is-open');
      sublinks.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---------- 10. FAQ Accordion Controller ---------- */
  var faqTriggers = Array.prototype.slice.call(document.querySelectorAll('.faq-trigger'));
  faqTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = trigger.closest('.faq-item');
      if (!item) return;
      var isOpen = item.classList.contains('is-open');

      // Optionally close siblings in same faq-list for single-open experience if desired
      var parentList = item.closest('.faq-list');
      if (parentList && !parentList.hasAttribute('data-allow-multiple')) {
        var openSiblings = parentList.querySelectorAll('.faq-item.is-open');
        Array.prototype.forEach.call(openSiblings, function (sibling) {
          if (sibling !== item) {
            sibling.classList.remove('is-open');
            var sibTrigger = sibling.querySelector('.faq-trigger');
            if (sibTrigger) sibTrigger.setAttribute('aria-expanded', 'false');
          }
        });
      }

      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---------- 11. FAQ Search & Filter Controller (faq.html) ---------- */
  var faqSearchInput = document.getElementById('faq-search-input');
  var faqCatBtns = Array.prototype.slice.call(document.querySelectorAll('.faq-cat-btn'));
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq-page .faq-item'));
  var faqCountEl = document.getElementById('faq-count');
  var faqEmptyState = document.getElementById('faq-empty-state');

  if (faqSearchInput || faqCatBtns.length) {
    var activeCategory = 'all';

    var filterFaqs = function () {
      var query = faqSearchInput ? faqSearchInput.value.toLowerCase().trim() : '';
      var visibleCount = 0;

      faqItems.forEach(function (item) {
        var cat = item.getAttribute('data-category') || 'general';
        var text = (item.textContent || '').toLowerCase();

        var matchesCategory = (activeCategory === 'all' || cat === activeCategory);
        var matchesQuery = (!query || text.indexOf(query) !== -1);

        if (matchesCategory && matchesQuery) {
          item.style.display = '';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });

      if (faqCountEl) {
        faqCountEl.textContent = 'Showing ' + visibleCount + ' question' + (visibleCount === 1 ? '' : 's');
      }
      if (faqEmptyState) {
        faqEmptyState.classList.toggle('is-visible', visibleCount === 0);
      }
    };

    if (faqSearchInput) {
      faqSearchInput.addEventListener('input', filterFaqs);
    }

    faqCatBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        faqCatBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        activeCategory = btn.getAttribute('data-category') || 'all';
        filterFaqs();
      });
    });
  }

  /* ---------- 12. Blog Topic Filter & Reading Modal (blog.html) ---------- */
  var blogFilterBtns = Array.prototype.slice.call(document.querySelectorAll('.blog-filter-btn'));
  var blogCards = Array.prototype.slice.call(document.querySelectorAll('.blog-card'));

  if (blogFilterBtns.length) {
    blogFilterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        blogFilterBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var cat = btn.getAttribute('data-category') || 'all';

        blogCards.forEach(function (card) {
          var cardCat = card.getAttribute('data-category');
          if (cat === 'all' || cardCat === cat) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Blog Article Modal Reader
  var blogModal = document.getElementById('blog-modal');
  var blogModalClose = document.getElementById('blog-modal-close');
  var blogModalTitle = document.getElementById('blog-modal-title');
  var blogModalBody = document.getElementById('blog-modal-body');

  if (blogModal) {
    var closeBlogModal = function () {
      blogModal.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    if (blogModalClose) {
      blogModalClose.addEventListener('click', closeBlogModal);
    }
    blogModal.addEventListener('click', function (e) {
      if (e.target === blogModal) closeBlogModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && blogModal.classList.contains('is-open')) {
        closeBlogModal();
      }
    });

    document.addEventListener('click', function (e) {
      var readBtn = e.target.closest('button.blog-card__btn');
      if (readBtn) {
        var card = readBtn.closest('.blog-card');
        if (!card) return;
        var title = card.querySelector('.blog-card__title');
        var fullArticle = card.querySelector('.blog-card__full-content');

        if (title && blogModalTitle) blogModalTitle.textContent = title.textContent;
        if (fullArticle && blogModalBody) {
          blogModalBody.innerHTML = fullArticle.innerHTML;
        }
        blogModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  /* ==========================================================================
     13. CONSTRUCTION COST CALCULATOR ENGINE
     ========================================================================== */
  var calcWizard = document.getElementById('calc-wizard');
  if (calcWizard) {
    var calcState = {
      step: 1,
      propertyType: 'villa',
      propertyLabel: 'Independent Duplex Villa',
      location: 'Thiruvallur & Surrounds',
      areaSqft: 1500,
      floors: 2,
      floorsLabel: 'G + 1 (2 Floors)',
      carParkingSqft: 180,
      pkg: 'classic',
      pkgRate: 2289,
      pkgLabel: 'Classic (₹2,289/sqft)',
      addons: {
        compoundWall: false,
        compoundWallFt: 80,
        sump: false,
        sumpLitres: 8000,
        septicTank: false,
        modularKitchen: false,
        falseCeiling: false,
        solar: false
      }
    };

    var formatINR = function (num) {
      return '₹ ' + Math.round(num).toLocaleString('en-IN');
    };

    var calculateCost = function () {
      var baseCost = calcState.areaSqft * calcState.pkgRate;
      var parkingCost = (calcState.carParkingSqft || 0) * 1200;
      var addonsCost = 0;

      if (calcState.addons.compoundWall) {
        addonsCost += (calcState.addons.compoundWallFt || 80) * 1500;
      }
      if (calcState.addons.sump) {
        addonsCost += (calcState.addons.sumpLitres || 8000) * 28;
      }
      if (calcState.addons.septicTank) {
        addonsCost += 65000;
      }
      if (calcState.addons.modularKitchen) {
        addonsCost += 165000;
      }
      if (calcState.addons.falseCeiling) {
        addonsCost += Math.round((calcState.areaSqft * 0.45) * 110);
      }
      if (calcState.addons.solar) {
        addonsCost += 45000;
      }

      var grandTotal = baseCost + parkingCost + addonsCost;
      var civilCost = Math.round(baseCost * 0.60);
      var finishingCost = Math.round(baseCost * 0.28);
      var servicesCost = Math.round(baseCost * 0.12);

      var timeline = '6 – 7.5 Months';
      if (calcState.areaSqft <= 1000) timeline = '4.5 – 6 Months';
      else if (calcState.areaSqft <= 1800) timeline = '6 – 7.5 Months';
      else if (calcState.areaSqft <= 2800) timeline = '7.5 – 9 Months';
      else timeline = '9 – 11 Months';

      return {
        baseCost: baseCost,
        parkingCost: parkingCost,
        addonsCost: addonsCost,
        grandTotal: grandTotal,
        civilCost: civilCost,
        finishingCost: finishingCost,
        servicesCost: servicesCost,
        timeline: timeline
      };
    };

    var updateLiveDisplay = function () {
      var res = calculateCost();

      // Update sticky summary badge
      var liveAmtEls = document.querySelectorAll('.js-calc-live-total');
      liveAmtEls.forEach(function (el) {
        el.textContent = formatINR(res.grandTotal);
      });

      // Update area display
      var areaNumEl = document.getElementById('calc-area-val');
      if (areaNumEl) areaNumEl.textContent = calcState.areaSqft.toLocaleString('en-IN');

      // Update Result Dashboard (Step 5)
      var resTotalEl = document.getElementById('calc-res-total');
      if (resTotalEl) resTotalEl.textContent = formatINR(res.grandTotal);

      var resCivilEl = document.getElementById('calc-res-civil');
      if (resCivilEl) resCivilEl.textContent = formatINR(res.civilCost);

      var resFinishingEl = document.getElementById('calc-res-finishing');
      if (resFinishingEl) resFinishingEl.textContent = formatINR(res.finishingCost);

      var resServicesEl = document.getElementById('calc-res-services');
      if (resServicesEl) resServicesEl.textContent = formatINR(res.servicesCost);

      var resAddonsEl = document.getElementById('calc-res-addons');
      if (resAddonsEl) resAddonsEl.textContent = formatINR(res.addonsCost + res.parkingCost);

      var resTimelineEl = document.getElementById('calc-res-timeline');
      if (resTimelineEl) resTimelineEl.textContent = res.timeline;

      var resSummarySpecEl = document.getElementById('calc-res-specs');
      if (resSummarySpecEl) {
        resSummarySpecEl.textContent = calcState.areaSqft + ' sq.ft · ' + calcState.floorsLabel + ' · ' + calcState.pkgLabel;
      }

      // Update milestone schedule breakdown
      var milestones = [
        { name: '1. Advance Booking & Soil Testing / Sanction', pct: 0.05 },
        { name: '2. Foundation & Plinth Beam Completion', pct: 0.15 },
        { name: '3. Ground Floor RCC Roof Slab Casting', pct: 0.20 },
        { name: '4. First Floor / Upper RCC Roof Slab', pct: 0.20 },
        { name: '5. Solid Red Brick Masonry & Plastering', pct: 0.15 },
        { name: '6. Vitrified Flooring, Electrical & Plumbing', pct: 0.15 },
        { name: '7. Final Painting & Housewarming Handover', pct: 0.10 }
      ];

      var scheduleTbody = document.getElementById('calc-schedule-body');
      if (scheduleTbody) {
        scheduleTbody.innerHTML = '';
        milestones.forEach(function (m) {
          var tr = document.createElement('tr');
          var stageAmt = Math.round(res.grandTotal * m.pct);
          tr.innerHTML = '<td><strong>' + m.name + '</strong></td>' +
                         '<td>' + (m.pct * 100) + '%</td>' +
                         '<td><strong>' + formatINR(stageAmt) + '</strong></td>';
          scheduleTbody.appendChild(tr);
        });
      }

      // WhatsApp Quote Link
      var waQuoteBtn = document.getElementById('calc-wa-quote');
      if (waQuoteBtn) {
        var waMsg = 'Hi Garuda Construction, I calculated my house construction estimate on your website:%0A%0A' +
          '• *Property Type*: ' + calcState.propertyLabel + '%0A' +
          '• *Built-up Area*: ' + calcState.areaSqft + ' sq.ft%0A' +
          '• *Floors*: ' + calcState.floorsLabel + '%0A' +
          '• *Package*: ' + calcState.pkgLabel + '%0A' +
          '• *Location*: ' + calcState.location + '%0A' +
          '• *Estimated Total*: ' + encodeURIComponent(formatINR(res.grandTotal)) + '%0A' +
          '• *Estimated Time*: ' + res.timeline + '%0A%0A' +
          'Can we arrange a plot visit and discuss the architectural drawings?';
        waQuoteBtn.href = 'https://wa.me/918148856006?text=' + waMsg;

        if (!waQuoteBtn._leadCaptureBound) {
          waQuoteBtn._leadCaptureBound = true;
          waQuoteBtn.addEventListener('click', function () {
            saveLead({
              name: 'Calculator Quote Visitor',
              service: 'Cost Calculator (' + calcState.pkgLabel + ')',
              location: calcState.location,
              sqft: calcState.areaSqft,
              budget: formatINR(res.grandTotal),
              source: 'calculator.html',
              details: {
                propertyType: calcState.propertyLabel,
                areaSqft: calcState.areaSqft,
                floorsLabel: calcState.floorsLabel,
                pkgLabel: calcState.pkgLabel,
                location: calcState.location,
                grandTotal: res.grandTotal,
                timeline: res.timeline
              }
            }).catch(function (err) {
              console.warn('Lead capture offline:', err);
            });
          });
        }
      }
    };

    var showStep = function (stepNum) {
      if (stepNum < 1) stepNum = 1;
      if (stepNum > 5) stepNum = 5;
      calcState.step = stepNum;

      // Update stepper UI
      var stepBtns = document.querySelectorAll('.calc-step-btn');
      var stepperBar = document.getElementById('calc-stepper-bar');
      if (stepperBar) {
        var pct = ((stepNum - 1) / (stepBtns.length - 1)) * 100;
        stepperBar.style.width = pct + '%';
      }

      stepBtns.forEach(function (btn, idx) {
        var btnStep = idx + 1;
        btn.classList.remove('is-active', 'is-done');
        if (btnStep === stepNum) {
          btn.classList.add('is-active');
        } else if (btnStep < stepNum) {
          btn.classList.add('is-done');
        }
      });

      // Update step panels
      var panels = document.querySelectorAll('.calc-step-panel');
      panels.forEach(function (panel) {
        panel.classList.remove('is-active');
      });
      var activePanel = document.getElementById('calc-step-' + stepNum);
      if (activePanel) {
        activePanel.classList.add('is-active');
        // Scroll smoothly to wizard top on mobile
        if (window.innerWidth < 768) {
          calcWizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      updateLiveDisplay();
    };

    // Step Navigation buttons
    var nextBtns = document.querySelectorAll('.js-calc-next');
    nextBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        showStep(calcState.step + 1);
      });
    });

    var prevBtns = document.querySelectorAll('.js-calc-prev');
    prevBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        showStep(calcState.step - 1);
      });
    });

    var stepDirectBtns = document.querySelectorAll('.calc-step-btn');
    stepDirectBtns.forEach(function (btn, idx) {
      btn.addEventListener('click', function () {
        showStep(idx + 1);
      });
    });

    // Step 1: Property Type cards
    var propCards = document.querySelectorAll('.js-calc-prop');
    propCards.forEach(function (card) {
      card.addEventListener('click', function () {
        propCards.forEach(function (c) { c.classList.remove('is-selected'); });
        card.classList.add('is-selected');
        calcState.propertyType = card.getAttribute('data-prop');
        var title = card.querySelector('.calc-opt-card__title');
        if (title) calcState.propertyLabel = title.textContent.trim();
        updateLiveDisplay();
      });
    });

    // Step 1: Location dropdown
    var locSelect = document.getElementById('calc-loc-select');
    if (locSelect) {
      locSelect.addEventListener('change', function () {
        calcState.location = locSelect.value;
        updateLiveDisplay();
      });
    }

    // Step 2: Area slider and presets
    var areaSlider = document.getElementById('calc-area-slider');
    if (areaSlider) {
      areaSlider.addEventListener('input', function () {
        calcState.areaSqft = parseInt(areaSlider.value, 10);
        // de-select preset chips
        var chips = document.querySelectorAll('.calc-chip');
        chips.forEach(function (chip) {
          if (parseInt(chip.getAttribute('data-sqft'), 10) === calcState.areaSqft) {
            chip.classList.add('is-active');
          } else {
            chip.classList.remove('is-active');
          }
        });
        updateLiveDisplay();
      });
    }

    var chips = document.querySelectorAll('.calc-chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        var sqft = parseInt(chip.getAttribute('data-sqft'), 10);
        calcState.areaSqft = sqft;
        if (areaSlider) areaSlider.value = sqft;
        updateLiveDisplay();
      });
    });

    // Step 2: Floor cards
    var floorCards = document.querySelectorAll('.js-calc-floor');
    floorCards.forEach(function (card) {
      card.addEventListener('click', function () {
        floorCards.forEach(function (c) { c.classList.remove('is-selected'); });
        card.classList.add('is-selected');
        calcState.floors = parseInt(card.getAttribute('data-floors'), 10);
        var name = card.querySelector('.calc-floor-card__name');
        if (name) calcState.floorsLabel = name.textContent.trim();
        updateLiveDisplay();
      });
    });

    // Step 3: Package Cards
    var pkgCards = document.querySelectorAll('.js-calc-pkg');
    pkgCards.forEach(function (card) {
      card.addEventListener('click', function () {
        pkgCards.forEach(function (c) { c.classList.remove('is-selected'); });
        card.classList.add('is-selected');
        calcState.pkg = card.getAttribute('data-pkg');
        calcState.pkgRate = parseInt(card.getAttribute('data-rate'), 10);
        var title = card.querySelector('.calc-pkg-card__title');
        if (title) calcState.pkgLabel = title.textContent.trim() + ' (₹' + calcState.pkgRate.toLocaleString('en-IN') + '/sqft)';
        updateLiveDisplay();
      });
    });

    // Step 4: Add-on Checkbox Items
    var addonItems = document.querySelectorAll('.js-calc-addon');
    addonItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var key = item.getAttribute('data-addon');
        if (!key) return;
        var isChecked = !item.classList.contains('is-checked');
        item.classList.toggle('is-checked', isChecked);
        calcState.addons[key] = isChecked;
        updateLiveDisplay();
      });
    });

    // Print Quotation Button
    var printBtn = document.getElementById('calc-print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', function () {
        window.print();
      });
    }

    // Initialize display with URL parameter check (?pkg=... & ?step=...)
    try {
      var calcParams = new URLSearchParams(window.location.search);
      var paramPkg = (calcParams.get('pkg') || '').toLowerCase();
      if (paramPkg) {
        var targetCard = document.querySelector('.js-calc-pkg[data-pkg="' + paramPkg + '"]');
        if (targetCard) {
          pkgCards.forEach(function (c) { c.classList.remove('is-selected'); });
          targetCard.classList.add('is-selected');
          calcState.pkg = targetCard.getAttribute('data-pkg');
          calcState.pkgRate = parseInt(targetCard.getAttribute('data-rate'), 10);
          var cTitle = targetCard.querySelector('.calc-pkg-card__title');
          if (cTitle) calcState.pkgLabel = cTitle.textContent.trim() + ' (₹' + calcState.pkgRate.toLocaleString('en-IN') + '/sqft)';
        }
      }
      var paramStep = parseInt(calcParams.get('step'), 10);
      if (paramStep && paramStep >= 1 && paramStep <= 5) {
        showStep(paramStep);
      } else {
        showStep(1);
      }
    } catch (e) {
      showStep(1);
    }
  }

  /* ---------- 14. Package Comparison Table Enhancements ---------- */
  var pkgNavBtns = Array.prototype.slice.call(document.querySelectorAll('.pkg-matrix-nav__btn'));
  pkgNavBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      pkgNavBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
    });
  });

  var matrixScrolls = Array.prototype.slice.call(document.querySelectorAll('.pkg-matrix-scroll'));
  matrixScrolls.forEach(function (scrollEl) {
    var wrapper = scrollEl.closest('.pkg-matrix-wrapper');
    var hint = wrapper ? wrapper.querySelector('.pkg-matrix-swipe-hint') : null;
    if (hint) {
      scrollEl.addEventListener('scroll', function () {
        if (scrollEl.scrollLeft > 30) {
          hint.style.opacity = '0.4';
        } else {
          hint.style.opacity = '1';
        }
      }, { passive: true });
    }
  });

  /* ---------- 15. Package Difference Highlighting & Filter Controls ---------- */
  var diffToggleBtns = Array.prototype.slice.call(document.querySelectorAll('#pkg-toggle-diffs'));
  var diffFilterBtns = Array.prototype.slice.call(document.querySelectorAll('#pkg-filter-only-diffs'));
  var showAllBtns = Array.prototype.slice.call(document.querySelectorAll('#pkg-show-all-specs'));

  diffToggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrapper = btn.closest('.pkg-matrix-wrapper');
      if (!wrapper) return;
      var table = wrapper.querySelector('.pkg-matrix-table');
      if (!table) return;

      var isActive = btn.classList.contains('is-active');
      btn.classList.toggle('is-active', !isActive);
      btn.setAttribute('aria-pressed', String(!isActive));
      table.classList.toggle('diffs-highlighted', !isActive);
    });
  });

  diffFilterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrapper = btn.closest('.pkg-matrix-wrapper');
      if (!wrapper) return;
      var table = wrapper.querySelector('.pkg-matrix-table');
      var allBtn = wrapper.querySelector('#pkg-show-all-specs');
      var toggleBtn = wrapper.querySelector('#pkg-toggle-diffs');
      if (!table) return;

      table.classList.add('show-only-diffs');
      table.classList.add('diffs-highlighted');
      if (toggleBtn) {
        toggleBtn.classList.add('is-active');
        toggleBtn.setAttribute('aria-pressed', 'true');
      }

      btn.classList.add('is-active');
      if (allBtn) allBtn.classList.remove('is-active');
    });
  });

  showAllBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrapper = btn.closest('.pkg-matrix-wrapper');
      if (!wrapper) return;
      var table = wrapper.querySelector('.pkg-matrix-table');
      var filterBtn = wrapper.querySelector('#pkg-filter-only-diffs');
      if (!table) return;

      table.classList.remove('show-only-diffs');
      btn.classList.add('is-active');
      if (filterBtn) filterBtn.classList.remove('is-active');
    });
  });

  /* ---------- 16. Universal Plan Selection Modal Controller ---------- */
  var packageCatalog = {
    basic: {
      name: 'Basic Package',
      rate: '₹2,089 / sqft',
      tag: 'Budget-Smart Quality',
      color: '#475569',
      specs: [
        'Sunvik / Prime Gold / Kamdhenu Fe550D Steel',
        'Zuari / Dalmia / Bharathi 53 & 43 Grade Cement',
        'Flush Doors with Veneer & Salwood frame (₹20,000)',
        '3-Track Aluminium Windows (₹440/sqft Jindal Profiles)',
        'Vitrified Living/Dining & Bedroom tiles (₹50/sqft)',
        'Asian Paints Tractor Emulsion + Ace Exterior',
        'Cera Sanitary & CP fittings (₹30,000 / 1k sqft)',
        '4,000L Underground Sump + 1,000L Apollo Overhead Tank',
        '10-Year Structural Warranty + 100% Written Price Guarantee'
      ]
    },
    classic: {
      name: 'Classic Package',
      rate: '₹2,289 / sqft',
      tag: '⭐ Most Popular Choice',
      color: '#D97706',
      specs: [
        'Indus / Jindal Panther / Vizag Fe550D Steel',
        'Zuari / Dalmia / Bharathi 53 & 43 Grade Cement',
        '1st Quality Teak Door with Teak Frame 5"×3" (₹30,000)',
        'UPVC 3-Track Windows (₹495/sqft Luftung / Plastone)',
        'Vitrified Tiles / Granite upto ₹100/sqft',
        'Asian Paints Tractor Shyne + Apex Exterior',
        'Hindware / Parryware fittings (₹50,000 / 1k sqft)',
        '6,000L Underground Sump + 1,500L Apollo Overhead Tank',
        '10-Year Structural Warranty + 100% Written Price Guarantee'
      ]
    },
    premium: {
      name: 'Premium Package',
      rate: '₹2,489 / sqft',
      tag: "Architect's Luxury Pick",
      color: '#2563EB',
      specs: [
        'Indus / Jindal Panther / Vizag Fe550D Steel',
        'ACC / UltraTech / Ramco Supercrete Cement',
        'Teak Door with Teak Frame 5"×3.5" (₹40,000)',
        'UPVC 3-Track Windows (₹700/sqft NCL Veka / Prominance)',
        'Tiles / Granite / Marble upto ₹140/sqft',
        'Asian Paints Apcolite Premium + Apex Exterior',
        'Jaquar Premium Fittings (₹70,000 / 1k sqft)',
        'Puja Room Teak Door + SS 304 Railing + Copper Gas Line',
        '7,000L Underground Sump + 2,000L Overhead Tank'
      ]
    },
    royal: {
      name: 'Royal Package',
      rate: '₹2,689 / sqft',
      tag: 'Bespoke Ultra-Luxury',
      color: '#9333EA',
      specs: [
        'Indus / Jindal Panther / Vizag Fe550D Steel',
        'ACC / UltraTech / Ramco Supercrete Cement',
        'Luxury Teak Door with Teak Frame 5"×3.5" (₹50,000)',
        'UPVC Windows (₹1,400/sqft NCL Veka / Simta Astrix)',
        'Italian Marble / Granite / Designer Tiles upto ₹160/sqft',
        'Asian Paints Royale Luxury Emulsion + Apex Ultima',
        'Kohler Luxury Bathroom Suites (₹80,000 / 1k sqft)',
        'SS 304 Railing with Toughened Glass + Copper Gas Line',
        '8,000L Underground Sump + 2,000L Heavy Duty Tank'
      ]
    }
  };

  // Inject Modal DOM if not present
  var modalEl = document.getElementById('pkg-modal');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'pkg-modal';
    modalEl.className = 'pkg-modal-backdrop';
    modalEl.setAttribute('aria-hidden', 'true');
    modalEl.setAttribute('role', 'dialog');
    modalEl.innerHTML = 
      '<div class="pkg-modal-card">' +
        '<div class="pkg-modal-header">' +
          '<div>' +
            '<span class="pkg-modal-tag" id="pkg-modal-tag">Plan Selected</span>' +
            '<h3 class="pkg-modal-title" id="pkg-modal-title">Classic Package</h3>' +
            '<p class="pkg-modal-rate" id="pkg-modal-rate">₹2,289 <span>/ sq.ft</span></p>' +
          '</div>' +
          '<button class="pkg-modal-close" id="pkg-modal-close" type="button" aria-label="Close modal">&times;</button>' +
        '</div>' +
        '<div class="pkg-modal-body">' +
          '<div class="pkg-modal-highlights">' +
            '<h4 class="pkg-modal-subtitle">Included Material Specifications:</h4>' +
            '<ul class="pkg-modal-speclist" id="pkg-modal-speclist"></ul>' +
          '</div>' +
          '<div class="pkg-modal-form-wrap">' +
            '<h4 class="pkg-modal-subtitle">Quick Consultation Request:</h4>' +
            '<form class="pkg-modal-form" id="pkg-modal-form">' +
              '<div class="pkg-modal-row">' +
                '<div class="pkg-modal-group">' +
                  '<label for="pkg-m-name">Your Name</label>' +
                  '<input type="text" id="pkg-m-name" name="name" placeholder="e.g. Anand" required>' +
                '</div>' +
                '<div class="pkg-modal-group">' +
                  '<label for="pkg-m-phone">Phone / WhatsApp</label>' +
                  '<input type="tel" id="pkg-m-phone" name="phone" placeholder="+91 98765 43210" required>' +
                '</div>' +
              '</div>' +
              '<div class="pkg-modal-row">' +
                '<div class="pkg-modal-group">' +
                  '<label for="pkg-m-loc">Plot Location</label>' +
                  '<input type="text" id="pkg-m-loc" name="location" placeholder="e.g. Thiruvallur, Chennai" required>' +
                '</div>' +
                '<div class="pkg-modal-group">' +
                  '<label for="pkg-m-sqft">Approx Area (Sq.ft)</label>' +
                  '<input type="text" id="pkg-m-sqft" name="sqft" placeholder="e.g. 1,600 sqft">' +
                '</div>' +
              '</div>' +
              '<div class="pkg-modal-actions">' +
                '<a class="pkg-modal-btn pkg-modal-btn--wa" id="pkg-modal-wa-btn" href="#" target="_blank" rel="noopener">' +
                  '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.938.547 3.75 1.5 5.312L2 22l4.812-1.453c1.5 1.047 3.328 1.609 5.219 1.609 5.531 0 10.031-4.5 10.031-10.031S17.562 2 12.031 2zm0 18.281c-1.672 0-3.234-.453-4.594-1.297l-.328-.203-3.063.922.938-3.016-.219-.344a8.16 8.16 0 0 1-1.312-4.312c0-4.547 3.688-8.25 8.25-8.25s8.25 3.703 8.25 8.25-3.703 8.25-8.25 8.25zm4.516-6.172c-.25-.125-1.469-.719-1.688-.812-.234-.078-.406-.125-.578.125-.172.25-.672.812-.828.984-.156.172-.312.188-.562.062-.25-.125-1.047-.391-2-1.234-.734-.656-1.234-1.469-1.375-1.719-.156-.25-.016-.391.109-.516.109-.109.25-.281.375-.422.125-.141.172-.25.25-.406.078-.172.047-.328-.016-.453-.062-.125-.578-1.391-.781-1.906-.203-.5-.406-.438-.578-.438h-.484c-.172 0-.453.062-.688.312-.234.25-.906.891-.906 2.172 0 1.281.938 2.516 1.062 2.688.141.172 1.844 2.812 4.469 3.953.625.266 1.109.438 1.5.562.641.203 1.219.172 1.688.109.516-.078 1.469-.609 1.688-1.203.203-.594.203-1.094.141-1.203-.063-.109-.234-.172-.484-.297z"/></svg>' +
                  '<span>Chat on WhatsApp</span>' +
                '</a>' +
                '<button class="pkg-modal-btn pkg-modal-btn--call" type="submit">' +
                  '<span>Request Callback</span>' +
                '</button>' +
              '</div>' +
            '</form>' +
            '<div class="pkg-modal-footer-links">' +
              '<a class="pkg-modal-calc-link" id="pkg-modal-calc-link" href="/calculator">Calculate exact cost in 5-Step Calculator &rarr;</a>' +
              '<button class="pkg-modal-scroll-link" id="pkg-modal-scroll-btn" type="button">↓ Or fill consultation form on this page</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modalEl);
  }

  var curActivePkgKey = 'classic';
  var openPkgModal = function (pkgKey) {
    curActivePkgKey = pkgKey || 'classic';
    var pkgData = packageCatalog[curActivePkgKey] || packageCatalog.classic;

    var tagEl = document.getElementById('pkg-modal-tag');
    var titleEl = document.getElementById('pkg-modal-title');
    var rateEl = document.getElementById('pkg-modal-rate');
    var specListEl = document.getElementById('pkg-modal-speclist');
    var waBtn = document.getElementById('pkg-modal-wa-btn');
    var calcLink = document.getElementById('pkg-modal-calc-link');
    var scrollBtn = document.getElementById('pkg-modal-scroll-btn');

    if (tagEl) {
      tagEl.textContent = pkgData.tag;
      tagEl.style.background = pkgData.color;
    }
    if (titleEl) titleEl.textContent = pkgData.name;
    if (rateEl) rateEl.innerHTML = pkgData.rate.replace('/ sqft', '<span>/ sq.ft</span>');

    if (specListEl) {
      specListEl.innerHTML = '';
      pkgData.specs.forEach(function (s) {
        var li = document.createElement('li');
        li.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>' + s + '</span>';
        specListEl.appendChild(li);
      });
    }

    if (calcLink) {
      calcLink.href = '/calculator?pkg=' + curActivePkgKey + '&step=2';
      calcLink.textContent = 'Calculate exact cost for ' + pkgData.name + ' in 5-Step Calculator →';
    }

    var updateWaLink = function () {
      var name = (document.getElementById('pkg-m-name') && document.getElementById('pkg-m-name').value.trim()) || 'Visitor';
      var loc = (document.getElementById('pkg-m-loc') && document.getElementById('pkg-m-loc').value.trim()) || '';
      var sqft = (document.getElementById('pkg-m-sqft') && document.getElementById('pkg-m-sqft').value.trim()) || '';
      var msg = 'Hi Garuda Construction, I would like to choose the *' + pkgData.name + '* (' + pkgData.rate + ').%0A%0A' +
        '• Name: ' + encodeURIComponent(name) + '%0A' +
        (loc ? ('• Location: ' + encodeURIComponent(loc) + '%0A') : '') +
        (sqft ? ('• Approx Area: ' + encodeURIComponent(sqft) + ' sq.ft%0A') : '') +
        '%0APlease share full specifications and schedule a plot visit.';
      if (waBtn) waBtn.href = 'https://wa.me/918148856006?text=' + msg;
    };
    updateWaLink();

    var nameInput = document.getElementById('pkg-m-name');
    var locInput = document.getElementById('pkg-m-loc');
    var sqftInput = document.getElementById('pkg-m-sqft');
    if (nameInput) nameInput.addEventListener('input', updateWaLink);
    if (locInput) locInput.addEventListener('input', updateWaLink);
    if (sqftInput) sqftInput.addEventListener('input', updateWaLink);

    var onpageContact = document.getElementById('contact');
    if (scrollBtn) {
      if (onpageContact) {
        scrollBtn.style.display = 'block';
        scrollBtn.onclick = function () {
          closePkgModal();
          var sel = document.getElementById('pkg-form-service');
          if (sel) {
            for (var i = 0; i < sel.options.length; i++) {
              if (sel.options[i].text.toLowerCase().indexOf(curActivePkgKey) !== -1) {
                sel.selectedIndex = i;
                break;
              }
            }
          }
          onpageContact.scrollIntoView({ behavior: 'smooth' });
        };
      } else {
        scrollBtn.style.display = 'none';
      }
    }

    modalEl.classList.add('is-open');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  var closePkgModal = function () {
    if (!modalEl) return;
    modalEl.classList.remove('is-open');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  var closeBtn = document.getElementById('pkg-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closePkgModal);
  if (modalEl) {
    modalEl.addEventListener('click', function (e) {
      if (e.target === modalEl) closePkgModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalEl && modalEl.classList.contains('is-open')) {
      closePkgModal();
    }
  });

  // Handle Modal Form Submit
  var modalForm = document.getElementById('pkg-modal-form');
  if (modalForm) {
    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var pkgData = packageCatalog[curActivePkgKey] || packageCatalog.classic;
      var name = (document.getElementById('pkg-m-name') && document.getElementById('pkg-m-name').value.trim()) || 'Visitor';
      var phone = (document.getElementById('pkg-m-phone') && document.getElementById('pkg-m-phone').value.trim()) || '';
      var loc = (document.getElementById('pkg-m-loc') && document.getElementById('pkg-m-loc').value.trim()) || '';
      var sqft = (document.getElementById('pkg-m-sqft') && document.getElementById('pkg-m-sqft').value.trim()) || '';

      saveLead({
        name: name,
        phone: phone,
        location: loc,
        sqft: sqft,
        service: 'Chosen Package: ' + pkgData.name + ' (' + pkgData.rate + ')',
        source: window.location.pathname.split('/').pop() || 'packages.html'
      }, 'package_form').catch(function (err) {
        console.warn('Lead capture offline:', err);
      });

      var waMsg = 'Hi Garuda Construction, I have requested a callback for *' + pkgData.name + '* (' + pkgData.rate + ').%0A%0A' +
        '• Name: ' + encodeURIComponent(name) + '%0A' +
        '• Phone: ' + encodeURIComponent(phone) + '%0A' +
        (loc ? ('• Location: ' + encodeURIComponent(loc) + '%0A') : '') +
        (sqft ? ('• Approx Area: ' + encodeURIComponent(sqft) + ' sq.ft%0A') : '');

      modalForm.innerHTML = 
        '<div class="pkg-modal-success">' +
          '<div class="pkg-modal-success-icon">✓</div>' +
          '<h4 style="font-family:var(--font-head); font-size:18px; margin-bottom:6px;">Enquiry Received, ' + name.replace(/[<>&"]/g, '') + '!</h4>' +
          '<p style="font-size:13.5px; color:var(--muted); margin-bottom:14px;">Our engineering team will call you within 2 hours. You can also chat directly on WhatsApp right now:</p>' +
          '<a class="pkg-modal-btn pkg-modal-btn--wa" href="https://wa.me/918148856006?text=' + waMsg + '" target="_blank" rel="noopener">' +
            '<span>Open Chat in WhatsApp &rarr;</span>' +
          '</a>' +
        '</div>';
    });
  }

  // Attach click handler to all Choose Package buttons (with delegation for dynamic elements)
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.js-choose-pkg');
    if (btn) {
      e.preventDefault();
      var pkgKey = btn.getAttribute('data-pkg') || 'classic';
      openPkgModal(pkgKey);
    }
  });

  /* ---------- 17. Garuda Construction-Style Interactive 2-Package Comparison Engine ---------- */
  var COMPARE_PACKAGES = {
    basic: {
      id: 'basic',
      name: 'Basic Package',
      shortName: 'Basic',
      rateNum: 2089,
      rateStr: '₹2,089 / sqft',
      badge: 'Budget-Smart',
      popular: false,
      color: '#475569',
      tagline: 'Essential & durable build with certified ISI materials & branded steel/cement.',
      highlights: ['Sunvik / Kamdhenu Steel', 'Zuari / Dalmia Cement', 'Aluminium 3-Track Windows', 'Cera Sanitaryware', '4,000L Sump']
    },
    classic: {
      id: 'classic',
      name: 'Classic Package',
      shortName: 'Classic',
      rateNum: 2289,
      rateStr: '₹2,289 / sqft',
      badge: '⭐ Most Popular',
      popular: true,
      color: '#D97706',
      tagline: 'Optimal balance of 1st-quality teak wood, UPVC windows, and branded Parryware/Hindware fittings.',
      highlights: ['Indus / Jindal Panther Steel', '1st Quality Teak Door (5"×3")', 'UPVC 3-Track Windows', 'Hindware / Parryware Suites', '6,000L Sump']
    },
    premium: {
      id: 'premium',
      name: 'Premium Package',
      shortName: 'Premium',
      rateNum: 2489,
      rateStr: '₹2,489 / sqft',
      badge: "Architect's Pick",
      popular: false,
      color: '#2563EB',
      tagline: 'High-end UltraTech cement, Jaquar bath suites, Italian granite allowances & carved teak puja door.',
      highlights: ['UltraTech 53 Grade Cement', 'Teak Door (5"×3.5")', 'UPVC NCL Veka Windows', 'Jaquar Premium Suites', 'Puja Teak Door', '7,000L Sump']
    },
    royal: {
      id: 'royal',
      name: 'Royal Package',
      shortName: 'Royal',
      rateNum: 2689,
      rateStr: '₹2,689 / sqft',
      badge: 'Bespoke Luxury',
      popular: false,
      color: '#9333EA',
      tagline: 'Italian marble, Kohler luxury suites, SS 304 toughened glass railings & bespoke craftsmanship.',
      highlights: ['UltraTech Cement', 'Luxury Teak Door', 'UPVC High-Grade Glazing', 'Kohler Luxury Suites', 'Italian Marble Allowance', '8,000L Sump']
    }
  };

  function initPackageComparison() {
    var select1 = document.getElementById('pkg-select-1');
    var select2 = document.getElementById('pkg-select-2');
    if (!select1 || !select2) return;

    var swapBtn = document.getElementById('pkg-swap-btn');
    var viewMode2Col = document.getElementById('pkg-view-mode-2col');
    var viewMode4Col = document.getElementById('pkg-view-mode-4col');

    // URL parameter support (?pkg1=basic&pkg2=premium)
    try {
      var urlParams = new URLSearchParams(window.location.search);
      var param1 = urlParams.get('pkg1') || urlParams.get('p1');
      var param2 = urlParams.get('pkg2') || urlParams.get('p2');

      if (param1 && COMPARE_PACKAGES[param1.toLowerCase()]) {
        select1.value = param1.toLowerCase();
      }
      if (param2 && COMPARE_PACKAGES[param2.toLowerCase()]) {
        select2.value = param2.toLowerCase();
      }
    } catch (err) {}

    function renderComparison() {
      var key1 = select1.value;
      var key2 = select2.value;
      var p1 = COMPARE_PACKAGES[key1];
      var p2 = COMPARE_PACKAGES[key2];
      if (!p1 || !p2) return;

      // Update URL silently
      try {
        if (window.history && window.history.replaceState) {
          var currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set('pkg1', key1);
          currentUrl.searchParams.set('pkg2', key2);
          window.history.replaceState({}, '', currentUrl.toString());
        }
      } catch (err) {}

      // 1. Update Preview Card 1
      var card1 = document.getElementById('pkg-preview-1');
      var badge1 = document.getElementById('pkg-card-badge-1');
      var title1 = document.getElementById('pkg-card-title-1');
      var rate1 = document.getElementById('pkg-card-rate-1');
      var tagline1 = document.getElementById('pkg-card-tagline-1');
      var btn1 = document.getElementById('pkg-card-btn-1');

      if (badge1) badge1.textContent = p1.badge;
      if (title1) title1.textContent = p1.name;
      if (rate1) rate1.innerHTML = p1.rateStr.replace('/ sqft', '<span>/ sqft</span>');
      if (tagline1) tagline1.textContent = p1.tagline;
      if (btn1) {
        btn1.textContent = 'Choose ' + p1.shortName;
        btn1.setAttribute('data-pkg', key1);
        btn1.setAttribute('data-pkg-name', p1.name);
        btn1.setAttribute('data-pkg-rate', p1.rateStr);
      }
      if (card1) {
        card1.classList.toggle('is-popular', p1.popular);
      }

      // 2. Update Preview Card 2
      var card2 = document.getElementById('pkg-preview-2');
      var badge2 = document.getElementById('pkg-card-badge-2');
      var title2 = document.getElementById('pkg-card-title-2');
      var rate2 = document.getElementById('pkg-card-rate-2');
      var tagline2 = document.getElementById('pkg-card-tagline-2');
      var btn2 = document.getElementById('pkg-card-btn-2');

      if (badge2) badge2.textContent = p2.badge;
      if (title2) title2.textContent = p2.name;
      if (rate2) rate2.innerHTML = p2.rateStr.replace('/ sqft', '<span>/ sqft</span>');
      if (tagline2) tagline2.textContent = p2.tagline;
      if (btn2) {
        btn2.textContent = 'Choose ' + p2.shortName;
        btn2.setAttribute('data-pkg', key2);
        btn2.setAttribute('data-pkg-name', p2.name);
        btn2.setAttribute('data-pkg-rate', p2.rateStr);
      }
      if (card2) {
        card2.classList.toggle('is-popular', p2.popular);
      }

      // 3. Update Table Thead Headers
      var thBadge1 = document.getElementById('pkg-th-badge-1');
      var thName1 = document.getElementById('pkg-th-name-1');
      var thRate1 = document.getElementById('pkg-th-rate-1');
      var thBtn1 = document.getElementById('pkg-th-btn-1');
      var thCol1 = document.getElementById('pkg-thead-col-1');

      if (thBadge1) thBadge1.textContent = p1.badge;
      if (thName1) thName1.textContent = p1.shortName;
      if (thRate1) thRate1.innerHTML = p1.rateStr.replace('/ sqft', '<span>/ sqft</span>');
      if (thBtn1) {
        thBtn1.textContent = 'Choose ' + p1.shortName;
        thBtn1.setAttribute('data-pkg', key1);
        thBtn1.setAttribute('data-pkg-name', p1.name);
        thBtn1.setAttribute('data-pkg-rate', p1.rateStr);
      }
      if (thCol1) {
        thCol1.classList.toggle('is-popular', p1.popular);
      }

      var thBadge2 = document.getElementById('pkg-th-badge-2');
      var thName2 = document.getElementById('pkg-th-name-2');
      var thRate2 = document.getElementById('pkg-th-rate-2');
      var thBtn2 = document.getElementById('pkg-th-btn-2');
      var thCol2 = document.getElementById('pkg-thead-col-2');

      if (thBadge2) thBadge2.textContent = p2.badge;
      if (thName2) thName2.textContent = p2.shortName;
      if (thRate2) thRate2.innerHTML = p2.rateStr.replace('/ sqft', '<span>/ sqft</span>');
      if (thBtn2) {
        thBtn2.textContent = 'Choose ' + p2.shortName;
        thBtn2.setAttribute('data-pkg', key2);
        thBtn2.setAttribute('data-pkg-name', p2.name);
        thBtn2.setAttribute('data-pkg-rate', p2.rateStr);
      }
      if (thCol2) {
        thCol2.classList.toggle('is-popular', p2.popular);
      }

      // 4. Calculate Price Delta and Upgrade Narrative
      var deltaBadge = document.getElementById('pkg-delta-badge');
      var deltaText = document.getElementById('pkg-delta-text');
      var summaryNote = document.getElementById('pkg-summary-note');

      var diff = Math.abs(p2.rateNum - p1.rateNum);
      var minRate = Math.min(p1.rateNum, p2.rateNum);
      var percent = minRate > 0 ? ((diff / minRate) * 100).toFixed(1) : 0;

      if (key1 === key2) {
        if (deltaText) deltaText.textContent = 'Same package selected (₹0 diff)';
        if (summaryNote) {
          summaryNote.innerHTML = 'You are currently viewing <strong>' + p1.name + '</strong> on both sides. Please choose two distinct packages to compare differences.';
        }
      } else {
        var isUpgrade = p2.rateNum > p1.rateNum;
        if (deltaText) {
          deltaText.textContent = '₹' + diff.toLocaleString('en-IN') + ' / sqft difference (' + (isUpgrade ? '+' : '-') + percent + '%)';
        }
        if (summaryNote) {
          var targetPkg = isUpgrade ? p2 : p1;
          summaryNote.innerHTML = 'Comparing <strong>' + p1.shortName + '</strong> vs <strong>' + p2.shortName + '</strong>: ' +
            'Upgrading to <strong>' + targetPkg.shortName + '</strong> adds ' + targetPkg.highlights.slice(0, 4).join(', ') + '.';
        }
      }

      // 5. Update Spec Rows in Table Body
      var tbody = document.getElementById('pkg-compare-tbody');
      if (!tbody) return;

      var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr.pkg-matrix-row'));
      var diffCount = 0;
      var totalCount = rows.length;

      function getCleanText(html) {
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent.trim().toLowerCase().replace(/\s+/g, ' ');
      }

      rows.forEach(function (row) {
        var val1 = row.getAttribute('data-' + key1) || '';
        var val2 = row.getAttribute('data-' + key2) || '';

        var cell1 = row.querySelector('.pkg-col--comp-1');
        var cell2 = row.querySelector('.pkg-col--comp-2');

        if (cell1) cell1.innerHTML = val1;
        if (cell2) {
          cell2.innerHTML = val2;
          cell2.classList.toggle('is-popular', p2.popular);
        }

        var text1 = getCleanText(val1);
        var text2 = getCleanText(val2);
        var isSame = (text1 === text2);

        var diffTag = row.querySelector('.diff-tag');
        var sameTag = row.querySelector('.same-tag');

        if (isSame) {
          row.classList.remove('has-diff');
          row.classList.add('is-same');
          row.setAttribute('data-diff', 'false');
          if (diffTag) diffTag.classList.add('is-hidden');
          if (sameTag) sameTag.classList.remove('is-hidden');
        } else {
          row.classList.remove('is-same');
          row.classList.add('has-diff');
          row.setAttribute('data-diff', 'true');
          diffCount++;
          if (diffTag) diffTag.classList.remove('is-hidden');
          if (sameTag) sameTag.classList.add('is-hidden');
        }
      });

      // 6. Update Diff Count Filter Label
      var diffCountBtn = document.getElementById('pkg-diff-count-btn');
      if (diffCountBtn) {
        diffCountBtn.textContent = 'Show Differences Only (' + diffCount + ')';
      }
      var showAllBtn = document.getElementById('pkg-show-all-specs');
      if (showAllBtn) {
        showAllBtn.textContent = 'Show All (' + totalCount + ')';
      }
    }

    // Bind Select Dropdown Changes
    select1.addEventListener('change', renderComparison);
    select2.addEventListener('change', renderComparison);

    // Swap Button Handler
    if (swapBtn) {
      swapBtn.addEventListener('click', function () {
        var tmp = select1.value;
        select1.value = select2.value;
        select2.value = tmp;
        renderComparison();
      });
    }

    // View Mode Switcher
    if (viewMode4Col) {
      viewMode4Col.addEventListener('click', function () {
        window.location.href = '/packages#packages';
      });
    }

    // Initial render
    renderComparison();
  }

  // Initialize Comparison Engine
  initPackageComparison();

})();

  // ========================================================
  // GARUDA CARD-BASED INTERACTIVE COMPARISON ENGINE
  // ========================================================
  (function initBnbCompare() {
    var sel1 = document.getElementById('bnb-select-1');
    var sel2 = document.getElementById('bnb-select-2');
    if (!sel1 || !sel2) return;

    var PKG_META = {
      basic: { name: 'Basic', rate: '₹2,089 per sqft' },
      classic: { name: 'Classic', rate: '₹2,289 per sqft' },
      premium: { name: 'Premium', rate: '₹2,489 per sqft' },
      royal: { name: 'Royal', rate: '₹2,689 per sqft' }
    };

    function formatVal(str) {
      if (!str) return '';
      if (str === '✓') return '<span class="spec-check">✓</span>';
      if (str === '✕') return '<span class="spec-cross">✕</span>';
      return '<span class="spec-text">' + str + '</span>';
    }

    function updateComparison() {
      var k1 = sel1.value;
      var k2 = sel2.value;
      var p1 = PKG_META[k1];
      var p2 = PKG_META[k2];

      // 1. Update Sticky Box Top Display
      var name1 = document.getElementById('bnb-name-1');
      var rate1 = document.getElementById('bnb-rate-1');
      var name2 = document.getElementById('bnb-name-2');
      var rate2 = document.getElementById('bnb-rate-2');

      if (name1 && p1) name1.textContent = p1.name;
      if (rate1 && p1) rate1.textContent = p1.rate;
      if (name2 && p2) name2.textContent = p2.name;
      if (rate2 && p2) rate2.textContent = p2.rate;

      // 2. Update Every Spec Card Values
      var cards = document.querySelectorAll('.bnb-spec-card');
      cards.forEach(function (card) {
        var val1 = card.getAttribute('data-' + k1);
        var val2 = card.getAttribute('data-' + k2);

        var col1 = card.querySelector('.bnb-val-col--1');
        var col2 = card.querySelector('.bnb-val-col--2');

        if (col1 && val1 !== null) col1.innerHTML = formatVal(val1);
        if (col2 && val2 !== null) col2.innerHTML = formatVal(val2);
      });
    }

    sel1.addEventListener('change', updateComparison);
    sel2.addEventListener('change', updateComparison);

    // Initial render
    updateComparison();
  })();
