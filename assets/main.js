const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('nav');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('open', !isOpen);
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-30% 0px -65% 0px' });
sections.forEach((section) => sectionObserver.observe(section));

const horizon = document.getElementById('horizon');
const horizonOutput = document.getElementById('horizon-output');
const prefixValue = document.getElementById('prefix-value');
const geometryValue = document.getElementById('geometry-value');
const reliabilityValue = document.getElementById('reliability-value');
const decisionValue = document.getElementById('decision-value');
const logicK = document.getElementById('logic-k');
const frameLabel = document.getElementById('frame-label');
const chartCursor = document.getElementById('chart-cursor');
const chartPoint = document.getElementById('chart-point');
const trajectory = document.getElementById('robot-trajectory');
const trajectoryPoint = document.getElementById('trajectory-point');
const geometryScores = [0.08, 0.12, 0.17, 0.22, 0.34, 0.48, 0.39, 0.31, 0.26, 0.22, 0.19, 0.15, 0.13, 0.12, 0.1];

function updateHorizon() {
  const k = Number(horizon.value);
  const index = k - 2;
  const score = geometryScores[index];
  const ratio = index / (geometryScores.length - 1);
  const chartX = 25 + ratio * 510;
  const chartY = 165 - score * 210;
  const progress = 18 + ratio * 82;
  const reliable = score < 0.42;

  horizonOutput.value = `k = ${k}`;
  prefixValue.textContent = k;
  geometryValue.textContent = score.toFixed(2);
  reliabilityValue.textContent = reliable ? 'High' : 'Low';
  reliabilityValue.className = reliable ? 'reliable' : 'uncertain';
  decisionValue.textContent = reliable ? 'commit' : 'replan';
  logicK.textContent = k;
  frameLabel.textContent = `${reliable ? 'EXECUTE' : 'REPLAN AT'} ${k} STEPS`;
  chartCursor.setAttribute('x1', chartX);
  chartCursor.setAttribute('x2', chartX);
  chartPoint.setAttribute('cx', chartX);
  chartPoint.setAttribute('cy', chartY);
  trajectory.style.strokeDasharray = `${progress} ${100 - progress}`;

  const pathLength = trajectory.getTotalLength();
  const point = trajectory.getPointAtLength(pathLength * progress / 100);
  trajectoryPoint.setAttribute('cx', point.x);
  trajectoryPoint.setAttribute('cy', point.y);
}
horizon.addEventListener('input', updateHorizon);
updateHorizon();

const resultData = {
  libero: {
    model: 'GR00T N1.5',
    values: [94.7, 94.6, 95.5],
    labels: ['Best fixed · h=8', 'MS', 'GeoAAC'],
    note: 'Average success rate (%) on LIBERO with GR00T N1.5. GeoAAC reaches 95.5%.'
  },
  robocasa: {
    model: 'GR00T N1.5',
    values: [66.4, 71.1, 75.1],
    labels: ['Best fixed · h=12', 'MS', 'GeoAAC'],
    note: 'Average success rate (%) on RoboCasa365. GeoAAC leads the best fixed horizon by 8.7 points.'
  },
  'libero-pro': {
    model: 'π0.5',
    values: [30.9, 35.2, 36.2],
    labels: ['Fixed · h=5', 'MS', 'GeoAAC'],
    note: 'Average success rate (%) on LIBERO-Pro under position shifts. GeoAAC reaches 36.2%.'
  }
};
let selectedDataset = 'libero';

function updateResults() {
  const result = resultData[selectedDataset];
  document.querySelectorAll('.bar').forEach((bar, index) => {
    bar.style.setProperty('--value', result.values[index]);
    bar.querySelector('strong').textContent = result.values[index].toFixed(1);
    document.getElementById(`result-label-${index}`).textContent = result.labels[index];
  });
  document.getElementById('result-model').textContent = result.model;
  document.getElementById('results-note').textContent = result.note;
}

document.querySelectorAll('#dataset-control button').forEach((button) => button.addEventListener('click', () => {
  selectedDataset = button.dataset.dataset;
  document.querySelectorAll('#dataset-control button').forEach((item) => {
    const isActive = item === button;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-pressed', String(isActive));
  });
  updateResults();
}));

const bibtexButton = document.getElementById('bibtex-button');
bibtexButton.addEventListener('click', async () => {
  const citation = document.getElementById('bibtex').textContent;
  try {
    await navigator.clipboard.writeText(citation);
    bibtexButton.querySelector('span').textContent = 'Copied';
  } catch {
    const helper = document.createElement('textarea');
    helper.value = citation;
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
    bibtexButton.querySelector('span').textContent = 'Copied';
  }
  window.setTimeout(() => { bibtexButton.querySelector('span').textContent = 'Copy citation'; }, 1800);
});

document.getElementById('year').textContent = new Date().getFullYear();
