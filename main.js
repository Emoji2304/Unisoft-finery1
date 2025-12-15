/*
 main.js — shared JavaScript for UniSoft pages
 - Responsive nav toggle for narrow screens
 - Highlights the active nav link (default to index.html)
 - Confirmation for external "Buy Now" / WhatsApp links
 - Sets current year in footer (requires <span class="placeholder-year">)
 - Contact form AJAX submit to Formspree (falls back to mailto if fetch isn't available)
 - Smooth-scroll for internal anchors
*/

document.addEventListener('DOMContentLoaded', function () {
  // NAV TOGGLE
  (function navToggle() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    const links = nav.querySelector('.link');
    if (!links) return;

    if (!nav.querySelector('.menu-toggle')) {
      const btn = document.createElement('button');
      btn.className = 'menu-toggle';
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Toggle menu');
      btn.innerHTML = '☰';
      btn.style.fontSize = '22px';
      btn.style.background = '#444';
      btn.style.color = 'wheat';
      btn.style.border = 'none';
      btn.style.padding = '8px 10px';
      btn.style.borderRadius = '6px';
      btn.style.cursor = 'pointer';
      btn.style.display = 'none';

      nav.insertBefore(btn, links);

      function updateToggleVisibility() {
        if (window.innerWidth <= 820) {
          btn.style.display = 'inline-block';
          if (!links.classList.contains('open')) {
            links.style.display = 'none';
          }
        } else {
          btn.style.display = 'none';
          links.style.display = '';
          links.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        }
      }

      btn.addEventListener('click', function () {
        const isOpen = links.classList.toggle('open');
        if (isOpen) {
          links.style.display = 'flex';
          btn.setAttribute('aria-expanded', 'true');
        } else {
          links.style.display = 'none';
          btn.setAttribute('aria-expanded', 'false');
        }
      });

      window.addEventListener('resize', updateToggleVisibility);
      updateToggleVisibility();
    }
  })();

  // Highlight active nav link
  (function highlightActiveNav() {
    const links = document.querySelectorAll('nav .link a');
    if (!links.length) return;
    const current = location.pathname.split('/').pop() || 'index.html';
    links.forEach(a => {
      const href = a.getAttribute('href') || '';
      const target = href.split('/').pop();
      if (target === current || (href === '' && current === 'index.html')) {
        a.style.borderBottom = '2px solid #e2c07d';
        a.style.paddingBottom = '4px';
      }
    });
  })();

  // Confirmation for external WhatsApp / buy links
  (function buyNowConfirm() {
    const selector = 'a[href*="wa.link"], a[href*="whatsapp"], a.buy-btn, .cardpro a';
    document.querySelectorAll(selector).forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (!href) return;
      a.addEventListener('click', function (e) {
        if (href.startsWith('#')) return;
        if (href.includes('wa.link') || href.includes('whatsapp') || a.classList.contains('buy-btn')) {
          const ok = confirm('You are about to open an external contact or shop link (WhatsApp). Continue?');
          if (!ok) e.preventDefault();
        }
      });
    });
  })();

  // Footer year auto-fill
  (function footerYear() {
    const el = document.querySelectorAll('.placeholder-year');
    if (!el.length) return;
    const year = new Date().getFullYear();
    el.forEach(node => (node.textContent = year));
  })();

  // Smooth scroll for internal anchors
  (function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', function (e) {
        const id = this.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  })();

  // Contact form handling — sends to Formspree (AJAX) and shows status messages
  (function contactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // status element (created if missing)
    let statusWrap = form.querySelector('.contact-status');
    if (!statusWrap) {
      statusWrap = document.createElement('div');
      statusWrap.className = 'contact-status';
      statusWrap.style.marginTop = '12px';
      form.appendChild(statusWrap);
    }

    const submitButton = form.querySelector('button[type="submit"]');

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showStatus(message, color) {
      statusWrap.style.color = color || '#d8b86a';
      statusWrap.innerHTML = message;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      statusWrap.textContent = '';

      const name = (form.querySelector('[name="name"]') || {}).value?.trim() || '';
      const replyto = (form.querySelector('[name="_replyto"]') || {}).value?.trim() || '';
      const message = (form.querySelector('[name="message"]') || {}).value?.trim() || '';
      const gotcha = (form.querySelector('[name="_gotcha"]') || {}).value?.trim() || '';

      const errors = [];
      if (!name) errors.push('Please enter your name.');
      if (!replyto || !validateEmail(replyto)) errors.push('Please enter a valid email address.');
      if (!message || message.length < 6) errors.push('Please enter a message (6+ characters).');

      if (errors.length) {
        showStatus(errors.map(x => `<div>• ${x}</div>`).join(''), '#ffd966');
        return;
      }

      // If honeypot has a value, treat as spam and do nothing
      if (gotcha) {
        // silent success to bots
        showStatus('Message received.', '#d8b86a');
        form.reset();
        return;
      }

      // Use fetch to post the FormData to the form action
      const endpoint = form.getAttribute('action');
      if (!endpoint) {
        showStatus('Form endpoint is not configured. Please set the Formspree action URL.', '#ffb3b3');
        return;
      }

      const formData = new FormData(form);

      // disable submit while sending
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }

      fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      }).then(async (response) => {
        if (response.ok) {
          showStatus('Thank you — your message was sent. We will reply soon.', '#d8b86a');
          form.reset();
        } else {
          // try to parse JSON errors from Formspree
          let data;
          try { data = await response.json(); } catch (err) { data = null; }
          if (data && data.error) {
            showStatus(`Error: ${data.error}`, '#ffb3b3');
          } else {
            showStatus('Submission failed. Trying fallback to your email client...', '#ffb3b3');
            // fallback: open mailto
            const subject = encodeURIComponent(form.querySelector('[name="_subject"]')?.value || 'Contact from UniSoft');
            const body = encodeURIComponent(message + '\n\n--\n' + name + '\n' + replyto);
            window.location.href = `mailto:info@unisoft.example.com?subject=${subject}&body=${body}`;
          }
        }
      }).catch((err) => {
        console.error('Form submit error', err);
        showStatus('Network error while sending the message. Falling back to opening your mail client.', '#ffb3b3');
        const subject = encodeURIComponent(form.querySelector('[name="_subject"]')?.value || 'Contact from UniSoft');
        const body = encodeURIComponent(message + '\n\n--\n' + name + '\n' + replyto);
        setTimeout(() => window.location.href = `mailto:info@unisoft.example.com?subject=${subject}&body=${body}`, 700);
      }).finally(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Send message';
        }
      });
    });
  })();
});