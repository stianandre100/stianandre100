// ============================================
// FLEKKERØY ELEKTRO – SCRIPTS
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  // ===== MOBILE MENU =====
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
  });

  // Close menu on link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
    });
  });

  // ===== SCROLL REVEAL =====
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('kontakt-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sendt! ✓';
    btn.style.background = '#16a34a';
    btn.style.borderColor = '#16a34a';
    btn.style.color = '#fff';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.style.color = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });

  // ===== ELBIL-KALKULATOR =====
  const cars = [
    { id: 'tesla3',    name: 'Tesla Model 3',        battery: 60,  range: 491,  maxAC: 11,   maxDC: 170, icon: '🚗' },
    { id: 'teslY',     name: 'Tesla Model Y',        battery: 75,  range: 533,  maxAC: 11,   maxDC: 250, icon: '🚙' },
    { id: 'vwid4',     name: 'VW ID.4',              battery: 77,  range: 520,  maxAC: 11,   maxDC: 135, icon: '🚙' },
    { id: 'vwid3',     name: 'VW ID.3',              battery: 58,  range: 426,  maxAC: 11,   maxDC: 120, icon: '🚗' },
    { id: 'polest2',   name: 'Polestar 2',           battery: 69,  range: 478,  maxAC: 11,   maxDC: 155, icon: '🚗' },
    { id: 'hyundai',   name: 'Hyundai Ioniq 5',      battery: 77,  range: 481,  maxAC: 11,   maxDC: 220, icon: '🚙' },
    { id: 'kiaev6',    name: 'Kia EV6',              battery: 77,  range: 528,  maxAC: 11,   maxDC: 233, icon: '🚙' },
    { id: 'audi',      name: 'Audi Q4 e-tron',       battery: 77,  range: 520,  maxAC: 11,   maxDC: 135, icon: '🚙' },
    { id: 'bmwix3',    name: 'BMW iX3',              battery: 74,  range: 460,  maxAC: 11,   maxDC: 150, icon: '🚙' },
    { id: 'volvoex30', name: 'Volvo EX30',           battery: 51,  range: 344,  maxAC: 11,   maxDC: 153, icon: '🚗' },
    { id: 'skodaenyaq',name: 'Škoda Enyaq',          battery: 77,  range: 535,  maxAC: 11,   maxDC: 135, icon: '🚙' },
    { id: 'nissan',    name: 'Nissan Leaf',           battery: 40,  range: 270,  maxAC: 6.6,  maxDC: 50,  icon: '🚗' },
  ];

  const chargers = [
    { id: 'schuko',  name: 'Vanlig stikkontakt',     power: 2.3,  type: 'AC', icon: '🔌', desc: '230V / 10A – Nødlading' },
    { id: 'ac16',    name: '1-fase ladeboks',         power: 3.6,  type: 'AC', icon: '🏠', desc: '230V / 16A – Enkel hjemmelader' },
    { id: 'ac32',    name: '1-fase 32A ladeboks',     power: 7.4,  type: 'AC', icon: '⚡', desc: '230V / 32A – Rask hjemmelader' },
    { id: 'ac3f',    name: '3-fase ladeboks (11 kW)', power: 11,   type: 'AC', icon: '🔋', desc: '400V / 16A – Anbefalt hjemmelader' },
    { id: 'ac3f22',  name: '3-fase ladeboks (22 kW)', power: 22,   type: 'AC', icon: '⚡', desc: '400V / 32A – Profesjonell lader' },
    { id: 'dc50',    name: 'Hurtiglader (50 kW)',     power: 50,   type: 'DC', icon: '🚀', desc: 'CCS – Offentlig hurtiglader' },
  ];

  let selectedCar = null;
  let selectedCharger = null;

  const carGrid = document.getElementById('car-grid');
  const chargerGrid = document.getElementById('charger-grid');
  const toStep2Btn = document.getElementById('to-step-2');
  const toStep1Btn = document.getElementById('to-step-1');
  const toStep3Btn = document.getElementById('to-step-3');
  const toStep2BackBtn = document.getElementById('to-step-2-back');
  const calcSteps = document.querySelectorAll('.calc-step');
  const panels = {
    1: document.getElementById('calc-step-1'),
    2: document.getElementById('calc-step-2'),
    3: document.getElementById('calc-step-3'),
  };

  // Render cars
  cars.forEach(car => {
    const el = document.createElement('div');
    el.className = 'car-option';
    el.dataset.id = car.id;
    el.innerHTML = `
      <span class="car-option-icon">${car.icon}</span>
      <div class="car-option-info">
        <strong>${car.name}</strong>
        <span>${car.battery} kWh · ${car.range} km</span>
      </div>
    `;
    el.addEventListener('click', () => {
      carGrid.querySelectorAll('.car-option').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
      selectedCar = car;
      toStep2Btn.disabled = false;
    });
    carGrid.appendChild(el);
  });

  // Render chargers
  chargers.forEach(charger => {
    const el = document.createElement('div');
    el.className = 'charger-option';
    el.dataset.id = charger.id;
    el.innerHTML = `
      <span class="charger-option-icon">${charger.icon}</span>
      <div class="charger-option-info">
        <strong>${charger.name}</strong>
        <span>${charger.desc}</span>
      </div>
    `;
    el.addEventListener('click', () => {
      chargerGrid.querySelectorAll('.charger-option').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
      selectedCharger = charger;
      toStep3Btn.disabled = false;
    });
    chargerGrid.appendChild(el);
  });

  function goToStep(step) {
    Object.values(panels).forEach(p => p.classList.add('hidden'));
    panels[step].classList.remove('hidden');

    calcSteps.forEach(s => {
      const stepNum = parseInt(s.dataset.step);
      s.classList.remove('active', 'completed');
      if (stepNum === step) s.classList.add('active');
      if (stepNum < step) s.classList.add('completed');
    });
  }

  toStep2Btn.addEventListener('click', () => {
    if (selectedCar) goToStep(2);
  });

  toStep1Btn.addEventListener('click', () => goToStep(1));
  toStep2BackBtn.addEventListener('click', () => goToStep(2));

  toStep3Btn.addEventListener('click', () => {
    if (selectedCar && selectedCharger) {
      calculateResult();
      goToStep(3);
    }
  });

  function calculateResult() {
    const car = selectedCar;
    const charger = selectedCharger;

    // Effective power: min of charger power and car's max for that type
    let effectivePower;
    if (charger.type === 'AC') {
      effectivePower = Math.min(charger.power, car.maxAC);
    } else {
      effectivePower = Math.min(charger.power, car.maxDC);
    }

    // Charging time (0-100%, accounting for ~90% efficiency on AC, ~95% on DC)
    const efficiency = charger.type === 'AC' ? 0.9 : 0.95;
    const chargeTimeHours = car.battery / (effectivePower * efficiency);
    const hours = Math.floor(chargeTimeHours);
    const minutes = Math.round((chargeTimeHours - hours) * 60);

    // Cost: average Norwegian electricity price ~1.50 NOK/kWh (incl. grid fee)
    const pricePerKwh = 1.50;
    const fullChargeCost = (car.battery / efficiency) * pricePerKwh;

    // Range gained per hour
    const rangePerHour = Math.round(car.range / chargeTimeHours);

    const timeStr = hours > 0 ? `${hours}t ${minutes}min` : `${minutes} min`;

    const resultEl = document.getElementById('calc-result');
    resultEl.innerHTML = `
      <div class="result-card highlight">
        <span class="result-value">${timeStr}</span>
        <span class="result-label">Ladetid 0–100%</span>
      </div>
      <div class="result-card">
        <span class="result-value">${Math.round(fullChargeCost)} kr</span>
        <span class="result-label">Kostnad full lading</span>
      </div>
      <div class="result-card">
        <span class="result-value">${effectivePower} kW</span>
        <span class="result-label">Effektiv ladeeffekt</span>
      </div>
      <div class="result-card">
        <span class="result-value">${rangePerHour} km/t</span>
        <span class="result-label">Rekkevidde per time</span>
      </div>
      <div class="result-summary">
        <p>
          Med en <strong>${charger.name}</strong> lader du din
          <strong>${car.name}</strong> (${car.battery} kWh)
          fra 0–100% på ca. <strong>${timeStr}</strong>.
          Det gir deg opptil <strong>${car.range} km</strong> rekkevidde.
        </p>
      </div>
    `;
  }

});
