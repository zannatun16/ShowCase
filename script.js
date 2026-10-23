// ===== Theme toggle (remembers choice when storage is available) =====
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

function applyTheme(t) {
  root.setAttribute('data-theme', t);
  themeBtn.innerHTML = t === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}
let saved = null;
try { saved = localStorage.getItem('zn-theme'); } catch (e) {}
applyTheme(saved || 'dark');

themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('zn-theme', next); } catch (e) {}
});

// ===== Mobile menu =====
const menuBtn = document.getElementById('menuBtn');
const navLinksEl = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  const open = navLinksEl.classList.toggle('open');
  menuBtn.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
  navLinksEl.classList.remove('open');
  menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
}));

// ===== Scroll: progress bar, navbar, active link, back-to-top =====
const progress = document.getElementById('progress');
const navbar = document.getElementById('navbar');
const toTop = document.getElementById('toTop');
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-link');

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  toTop.classList.toggle('show', window.scrollY > 500);

  let current = 'home';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) current = s.id;
  });
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Typing effect =====
const roles = [
  'Software QA Engineer in the making',
  'Test Case Designer & Bug Hunter',
  'Machine Learning Researcher',
  'IEEE Xplore Co-author'
];
const typedEl = document.getElementById('typed');
let ri = 0, ci = 0, deleting = false;
function type() {
  const word = roles[ri];
  typedEl.textContent = word.substring(0, ci);
  if (!deleting && ci < word.length) { ci++; setTimeout(type, 70); }
  else if (!deleting) { deleting = true; setTimeout(type, 1500); }
  else if (ci > 0) { ci--; setTimeout(type, 35); }
  else { deleting = false; ri = (ri + 1) % roles.length; setTimeout(type, 300); }
}
type();

// ===== Reveal on scroll =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== Counters =====
function runCounter(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const steps = 50;
  let n = 0;
  const timer = setInterval(() => {
    n++;
    const val = (target * n) / steps;
    el.textContent = val.toFixed(decimals);
    if (n >= steps) { el.textContent = target.toFixed(decimals); clearInterval(timer); }
  }, 30);
}
const statsEl = document.querySelector('.stats');
if (statsEl) {
  const sio = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(runCounter);
      sio.disconnect();
    }
  }, { threshold: 0.5 });
  sio.observe(statsEl);
}

// ===== Sample test cases (tabs) =====
const testCases = {
  auth: [
    ['TC-AUTH-01', 'Login with valid credentials', '1. Open login page 2. Enter valid email and password 3. Click Login', 'User lands on dashboard', 'pos'],
    ['TC-AUTH-02', 'Login with wrong password', '1. Enter valid email 2. Enter wrong password 3. Click Login', 'Error shown, no session created', 'neg'],
    ['TC-AUTH-03', 'Empty form submission', '1. Leave all fields blank 2. Click Login', 'Validation messages for required fields', 'neg'],
    ['TC-AUTH-04', 'Customer opens an admin URL', '1. Log in as customer 2. Paste admin page URL', 'Access denied (RBAC enforced)', 'edge']
  ],
  cart: [
    ['TC-CART-01', 'Add a product to cart', '1. Open product 2. Click Add to Cart', 'Item appears; cart count +1', 'pos'],
    ['TC-CART-02', 'Quantity set to zero', '1. Open cart 2. Change quantity to 0', 'Item removed or error shown', 'edge'],
    ['TC-CART-03', 'Quantity above stock', '1. Enter quantity greater than inventory', 'Stock limit message, no overselling', 'neg'],
    ['TC-CART-04', 'Remove item updates total', '1. Add 2 items 2. Remove one', 'Total recalculated instantly', 'pos']
  ],
  order: [
    ['TC-ORD-01', 'Place order with valid cart', '1. Go to checkout 2. Enter address 3. Confirm', 'Order created; stock reduced', 'pos'],
    ['TC-ORD-02', 'Checkout with empty cart', '1. Open checkout URL with empty cart', 'Redirected with a message', 'neg'],
    ['TC-ORD-03', 'Return a delivered order', '1. Open delivered order 2. Request return', 'Return logged; status updated', 'pos'],
    ['TC-ORD-04', 'Delivery status change', '1. Delivery role updates status', 'Customer sees the new status', 'edge']
  ]
};
const pillLabel = { pos: 'Positive', neg: 'Negative', edge: 'Edge' };
const tcBody = document.getElementById('tcBody');

function renderTests(key) {
  tcBody.innerHTML = '';
  testCases[key].forEach(r => {
    const tr = document.createElement('tr');
    [r[0], r[1], r[2], r[3]].forEach(txt => {
      const td = document.createElement('td');
      td.textContent = txt;
      tr.appendChild(td);
    });
    const td = document.createElement('td');
    const span = document.createElement('span');
    span.className = 'pill ' + r[4];
    span.textContent = pillLabel[r[4]];
    td.appendChild(span);
    tr.appendChild(td);
    tcBody.appendChild(tr);
  });
}
renderTests('auth');
document.querySelectorAll('#tcTabs .tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#tcTabs .tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTests(btn.dataset.tab);
  });
});

// ===== Project filter =====
document.querySelectorAll('#filters .filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#filters .filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.project').forEach(p => {
      const show = f === 'all' || p.dataset.cat.split(' ').includes(f);
      p.classList.toggle('hide', !show);
    });
  });
});

// ===== Contact form -> mailto =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('fName').value.trim();
  const email = document.getElementById('fEmail').value.trim();
  const msg = document.getElementById('fMsg').value.trim();
  const subject = encodeURIComponent('Portfolio enquiry from ' + name);
  const body = encodeURIComponent(msg + '\n\n- ' + name + ' (' + email + ')');
  window.location.href = 'mailto:nurzannatun0@gmail.com?subject=' + subject + '&body=' + body;
});
