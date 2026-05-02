// Client-side helpers to connect the static site to a backend API.
// Configure your backend base URL here. Use a full URL for remote servers
// or leave as empty string to use same-origin (e.g. when served from the same host).
const API_BASE = '' // e.g. 'https://api.example.com' or '' for same origin

// Example: fetch dynamic stats to populate the stat cards
async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE}/api/stats`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    // expected shape: { employees: '380,000+', subsidiaries: '60+', years: '60 Years' }
    if (data.employees) document.querySelectorAll('.stat-number')[0].textContent = data.employees;
    if (data.subsidiaries) document.querySelectorAll('.stat-number')[1].textContent = data.subsidiaries;
    if (data.years) document.querySelectorAll('.stat-number')[2].textContent = data.years;
  } catch (err) {
    console.info('Could not fetch stats (ok for static demo):', err.message);
  }
}

// Contact form submission handler
async function submitContactForm(evt) {
  evt.preventDefault();
  const form = evt.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const status = document.getElementById('contactStatus');
  const name = form.elements['name'].value.trim();
  const email = form.elements['email'].value.trim();
  const message = form.elements['message'].value.trim();

  if (!name || !email || !message) {
    status.textContent = 'Please complete all fields.';
    status.className = 'text-danger';
    return;
  }

  submitBtn.disabled = true;
  status.textContent = 'Sending...';
  status.className = 'text-muted';

  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(body || 'Server error');
    }

    status.textContent = 'Message sent. Thank you!';
    status.className = 'text-success';
    form.reset();
  } catch (err) {
    console.error('Contact submit failed:', err);
    status.textContent = 'Failed to send message. Try again later.';
    status.className = 'text-danger';
  } finally {
    submitBtn.disabled = false;
  }
}

// Wire up form and initial fetch when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) contactForm.addEventListener('submit', submitContactForm);
  fetchStats();
});
