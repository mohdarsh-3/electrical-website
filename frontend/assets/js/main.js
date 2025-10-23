// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
}

// Contact form submit (works on contact.html)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    status.textContent = 'Sending...';

    const payload = {
      name: document.getElementById('name').value.trim(),
      company: document.getElementById('company').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      message: document.getElementById('message').value.trim()
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        status.textContent = 'Thanks — your request was sent!';
        contactForm.reset();
      } else {
        status.textContent = data.message || 'Submission failed.';
      }
    } catch (err) {
      console.error(err);
      status.textContent = 'Network error — try again later.';
    }
  });
}
