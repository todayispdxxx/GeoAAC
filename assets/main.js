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
    label: 'LIBERO',
    defaultModel: 'groot',
    defaultMetric: 'avg',
    metrics: [
      { key: 'spatial', label: 'Spatial' },
      { key: 'long', label: 'Long' },
      { key: 'object', label: 'Object' },
      { key: 'goal', label: 'Goal' },
      { key: 'avg', label: 'Average' }
    ],
    models: {
      groot: {
        label: 'GR00T N1.5',
        methods: [
          { label: 'Fixed · h=2', kind: 'fixed', values: { spatial: 95.0, long: 79.0, object: 93.6, goal: 93.0, avg: 90.2 } },
          { label: 'Fixed · h=4', kind: 'fixed', values: { spatial: 95.8, long: 82.6, object: 97.0, goal: 94.4, avg: 92.5 } },
          { label: 'Fixed · h=8', kind: 'fixed', values: { spatial: 95.0, long: 88.4, object: 97.4, goal: 97.8, avg: 94.7 } },
          { label: 'Fixed · h=12', kind: 'fixed', values: { spatial: 95.6, long: 88.2, object: 97.2, goal: 97.0, avg: 94.5 } },
          { label: 'Fixed · h=16', kind: 'fixed', values: { spatial: 95.0, long: 88.2, object: 97.0, goal: 96.0, avg: 94.1 } },
          { label: 'MS', kind: 'ms', values: { spatial: 97.2, long: 88.0, object: 96.6, goal: 96.4, avg: 94.6 } },
          { label: 'SA', kind: 'sa', values: { spatial: 96.2, long: 87.4, object: 95.8, goal: 95.8, avg: 93.8 } },
          { label: 'GeoAAC', kind: 'geoaac', values: { spatial: 96.4, long: 89.2, object: 99.0, goal: 97.2, avg: 95.5 } }
        ]
      },
      pi05: {
        label: 'π0.5',
        methods: [
          { label: 'Fixed · h=5', kind: 'fixed', values: { spatial: 98.5, long: 93.2, object: 98.8, goal: 98.0, avg: 97.1 } },
          { label: 'MS', kind: 'ms', values: { spatial: 98.8, long: 94.4, object: 96.6, goal: 98.8, avg: 97.2 } },
          { label: 'SA', kind: 'sa', values: { spatial: 99.0, long: 93.2, object: 98.0, goal: 98.2, avg: 97.1 } },
          { label: 'GeoAAC', kind: 'geoaac', values: { spatial: 98.6, long: 96.4, object: 98.6, goal: 98.4, avg: 98.0 } }
        ]
      }
    }
  },
  robocasa: {
    label: 'RoboCasa365',
    defaultModel: 'groot',
    defaultMetric: 'overall',
    metrics: [
      { key: 'closeBlenderLid', label: 'Close Blender Lid' },
      { key: 'closeFridge', label: 'Close Fridge' },
      { key: 'closeToasterOvenDoor', label: 'Close Toaster Oven Door' },
      { key: 'coffeeSetupMug', label: 'Coffee Setup Mug' },
      { key: 'navigateKitchen', label: 'Navigate Kitchen' },
      { key: 'openCabinet', label: 'Open Cabinet' },
      { key: 'openDrawer', label: 'Open Drawer' },
      { key: 'openStandMixerHead', label: 'Open Stand Mixer Head' },
      { key: 'pickPlaceCounterToCabinet', label: 'Counter → Cabinet' },
      { key: 'pickPlaceCounterToStove', label: 'Counter → Stove' },
      { key: 'pickPlaceDrawerToCounter', label: 'Drawer → Counter' },
      { key: 'pickPlaceSinkToCounter', label: 'Sink → Counter' },
      { key: 'pickPlaceToasterToCounter', label: 'Toaster → Counter' },
      { key: 'slideDishwasherRack', label: 'Slide Dishwasher Rack' },
      { key: 'turnOffStove', label: 'Turn Off Stove' },
      { key: 'turnOnElectricKettle', label: 'Turn On Electric Kettle' },
      { key: 'turnOnMicrowave', label: 'Turn On Microwave' },
      { key: 'turnOnSinkFaucet', label: 'Turn On Sink Faucet' },
      { key: 'overall', label: 'Overall' }
    ],
    models: {
      groot: {
        label: 'GR00T N1.5',
        methods: [
          { label: 'Fixed · h=2', kind: 'fixed', values: { closeBlenderLid: 8, closeFridge: 38, closeToasterOvenDoor: 44, coffeeSetupMug: 20, navigateKitchen: 16, openCabinet: 50, openDrawer: 20, openStandMixerHead: 62, pickPlaceCounterToCabinet: 48, pickPlaceCounterToStove: 48, pickPlaceDrawerToCounter: 10, pickPlaceSinkToCounter: 36, pickPlaceToasterToCounter: 24, slideDishwasherRack: 50, turnOffStove: 10, turnOnElectricKettle: 34, turnOnMicrowave: 12, turnOnSinkFaucet: 12, overall: 30.1 } },
          { label: 'Fixed · h=4', kind: 'fixed', values: { closeBlenderLid: 14, closeFridge: 42, closeToasterOvenDoor: 56, coffeeSetupMug: 34, navigateKitchen: 26, openCabinet: 72, openDrawer: 32, openStandMixerHead: 80, pickPlaceCounterToCabinet: 46, pickPlaceCounterToStove: 62, pickPlaceDrawerToCounter: 22, pickPlaceSinkToCounter: 64, pickPlaceToasterToCounter: 46, slideDishwasherRack: 56, turnOffStove: 24, turnOnElectricKettle: 48, turnOnMicrowave: 26, turnOnSinkFaucet: 34, overall: 43.6 } },
          { label: 'Fixed · h=8', kind: 'fixed', values: { closeBlenderLid: 28, closeFridge: 56, closeToasterOvenDoor: 78, coffeeSetupMug: 62, navigateKitchen: 40, openCabinet: 88, openDrawer: 60, openStandMixerHead: 86, pickPlaceCounterToCabinet: 52, pickPlaceCounterToStove: 78, pickPlaceDrawerToCounter: 44, pickPlaceSinkToCounter: 56, pickPlaceToasterToCounter: 68, slideDishwasherRack: 68, turnOffStove: 30, turnOnElectricKettle: 62, turnOnMicrowave: 60, turnOnSinkFaucet: 40, overall: 58.7 } },
          { label: 'Fixed · h=12', kind: 'fixed', values: { closeBlenderLid: 36, closeFridge: 68, closeToasterOvenDoor: 90, coffeeSetupMug: 62, navigateKitchen: 50, openCabinet: 92, openDrawer: 76, openStandMixerHead: 94, pickPlaceCounterToCabinet: 54, pickPlaceCounterToStove: 74, pickPlaceDrawerToCounter: 32, pickPlaceSinkToCounter: 80, pickPlaceToasterToCounter: 84, slideDishwasherRack: 68, turnOffStove: 48, turnOnElectricKettle: 62, turnOnMicrowave: 64, turnOnSinkFaucet: 62, overall: 66.4 } },
          { label: 'Fixed · h=16', kind: 'fixed', values: { closeBlenderLid: 40, closeFridge: 78, closeToasterOvenDoor: 82, coffeeSetupMug: 70, navigateKitchen: 62, openCabinet: 84, openDrawer: 70, openStandMixerHead: 96, pickPlaceCounterToCabinet: 60, pickPlaceCounterToStove: 72, pickPlaceDrawerToCounter: 38, pickPlaceSinkToCounter: 72, pickPlaceToasterToCounter: 62, slideDishwasherRack: 78, turnOffStove: 46, turnOnElectricKettle: 72, turnOnMicrowave: 60, turnOnSinkFaucet: 50, overall: 66.2 } },
          { label: 'MS', kind: 'ms', values: { closeBlenderLid: 34, closeFridge: 58, closeToasterOvenDoor: 80, coffeeSetupMug: 60, navigateKitchen: 64, openCabinet: 92, openDrawer: 78, openStandMixerHead: 94, pickPlaceCounterToCabinet: 68, pickPlaceCounterToStove: 82, pickPlaceDrawerToCounter: 58, pickPlaceSinkToCounter: 84, pickPlaceToasterToCounter: 86, slideDishwasherRack: 80, turnOffStove: 24, turnOnElectricKettle: 78, turnOnMicrowave: 78, turnOnSinkFaucet: 82, overall: 71.1 } },
          { label: 'SA', kind: 'sa', values: { closeBlenderLid: 38, closeFridge: 84, closeToasterOvenDoor: 86, coffeeSetupMug: 72, navigateKitchen: 42, openCabinet: 94, openDrawer: 82, openStandMixerHead: 94, pickPlaceCounterToCabinet: 68, pickPlaceCounterToStove: 76, pickPlaceDrawerToCounter: 46, pickPlaceSinkToCounter: 76, pickPlaceToasterToCounter: 70, slideDishwasherRack: 74, turnOffStove: 42, turnOnElectricKettle: 82, turnOnMicrowave: 60, turnOnSinkFaucet: 54, overall: 68.9 } },
          { label: 'GeoAAC', kind: 'geoaac', values: { closeBlenderLid: 36, closeFridge: 80, closeToasterOvenDoor: 90, coffeeSetupMug: 70, navigateKitchen: 68, openCabinet: 92, openDrawer: 94, openStandMixerHead: 92, pickPlaceCounterToCabinet: 68, pickPlaceCounterToStove: 84, pickPlaceDrawerToCounter: 54, pickPlaceSinkToCounter: 76, pickPlaceToasterToCounter: 72, slideDishwasherRack: 80, turnOffStove: 56, turnOnElectricKettle: 90, turnOnMicrowave: 78, turnOnSinkFaucet: 72, overall: 75.1 } }
        ]
      }
    }
  },
  'libero-pro': {
    label: 'LIBERO-Pro',
    defaultModel: 'pi05',
    defaultMetric: 'avg',
    metrics: [
      { key: 'shift02', label: 'Shift 0.2' },
      { key: 'shift03', label: 'Shift 0.3' },
      { key: 'shift04', label: 'Shift 0.4' },
      { key: 'avg', label: 'Average' }
    ],
    models: {
      pi05: {
        label: 'π0.5',
        methods: [
          { label: 'Fixed · h=5', kind: 'fixed', values: { shift02: 53.2, shift03: 29.9, shift04: 9.5, avg: 30.9 } },
          { label: 'SA', kind: 'sa', values: { shift02: 57.5, shift03: 34.3, shift04: 9.5, avg: 33.8 } },
          { label: 'MS', kind: 'ms', values: { shift02: 57.4, shift03: 35.5, shift04: 12.8, avg: 35.2 } },
          { label: 'GeoAAC', kind: 'geoaac', values: { shift02: 58.5, shift03: 37.6, shift04: 12.4, avg: 36.2 } }
        ]
      }
    }
  }
};

const datasetButtons = [...document.querySelectorAll('#dataset-control button')];
const modelControl = document.getElementById('model-control');
const metricSelect = document.getElementById('result-metric');
const resultBars = document.getElementById('result-bars');
const resultTable = document.getElementById('result-table');
const resultTitle = document.getElementById('result-insight-title');
const resultsNote = document.getElementById('results-note');
let selectedDataset = 'libero';
let selectedModel = resultData.libero.defaultModel;
let selectedMetric = resultData.libero.defaultMetric;

function formatResult(value) {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

function resultSummary(dataset, model, metric, methods) {
  const geoaac = methods.find((method) => method.kind === 'geoaac');
  const fixed = methods.filter((method) => method.kind === 'fixed');
  const bestFixed = fixed.reduce((best, method) => method.values[metric.key] > best.values[metric.key] ? method : best);
  const best = methods.reduce((leader, method) => method.values[metric.key] > leader.values[metric.key] ? method : leader);
  const value = geoaac.values[metric.key];
  const delta = value - bestFixed.values[metric.key];
  resultTitle.textContent = `${dataset.label} · ${metric.label} success rate`;
  if (best.kind === 'geoaac') {
    resultsNote.textContent = `With ${model.label}, GeoAAC reports ${formatResult(value)}% and improves on the best fixed horizon by ${formatResult(delta)} percentage points.`;
  } else {
    resultsNote.textContent = `With ${model.label}, ${best.label} is highest on this metric at ${formatResult(best.values[metric.key])}%; GeoAAC reports ${formatResult(value)}%.`;
  }
}

function renderTable(dataset, model) {
  resultTable.replaceChildren();
  const caption = document.createElement('caption');
  caption.textContent = `${dataset.label} success rate (%) · ${model.label}`;
  const head = document.createElement('thead');
  const headRow = document.createElement('tr');
  ['Method', ...dataset.metrics.map((metric) => metric.label)].forEach((label) => {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = label;
    headRow.appendChild(cell);
  });
  head.appendChild(headRow);
  const body = document.createElement('tbody');
  model.methods.forEach((method) => {
    const row = document.createElement('tr');
    row.dataset.kind = method.kind;
    const methodCell = document.createElement('th');
    methodCell.scope = 'row';
    methodCell.textContent = method.label;
    row.appendChild(methodCell);
    dataset.metrics.forEach((metric) => {
      const cell = document.createElement('td');
      cell.textContent = formatResult(method.values[metric.key]);
      row.appendChild(cell);
    });
    body.appendChild(row);
  });
  resultTable.append(caption, head, body);
}

function renderBars() {
  const dataset = resultData[selectedDataset];
  const model = dataset.models[selectedModel];
  const metric = dataset.metrics.find((item) => item.key === selectedMetric);
  resultBars.replaceChildren();
  resultSummary(dataset, model, metric, model.methods);
  const summaryTitle = resultTitle.textContent;
  const summaryNote = resultsNote.textContent;

  model.methods.forEach((method, index) => {
    const value = method.values[metric.key];
    const row = document.createElement('div');
    row.className = 'result-row';
    row.dataset.kind = method.kind;
    row.setAttribute('role', 'listitem');
    row.setAttribute('tabindex', '0');
    row.setAttribute('aria-label', `${method.label}, ${metric.label}, ${formatResult(value)} percent`);
    row.style.setProperty('--delay', `${index * 35}ms`);

    const label = document.createElement('span');
    label.className = 'result-method';
    label.textContent = method.label;
    const track = document.createElement('span');
    track.className = 'result-track';
    const fill = document.createElement('i');
    fill.style.setProperty('--scale', String(value / 100));
    track.appendChild(fill);
    const number = document.createElement('strong');
    number.textContent = formatResult(value);
    row.append(label, track, number);
    resultBars.appendChild(row);

    const showDetail = () => {
      resultTitle.textContent = method.label;
      resultsNote.textContent = `${dataset.label} · ${model.label} · ${metric.label}: ${formatResult(value)}% success rate.`;
    };
    const restoreSummary = () => {
      resultTitle.textContent = summaryTitle;
      resultsNote.textContent = summaryNote;
    };
    row.addEventListener('mouseenter', showDetail);
    row.addEventListener('mouseleave', restoreSummary);
    row.addEventListener('focus', showDetail);
    row.addEventListener('blur', restoreSummary);
  });
}

function renderMetricControl() {
  const dataset = resultData[selectedDataset];
  metricSelect.replaceChildren();
  dataset.metrics.forEach((metric) => {
    const option = document.createElement('option');
    option.value = metric.key;
    option.textContent = metric.label;
    option.selected = metric.key === selectedMetric;
    metricSelect.appendChild(option);
  });
}

function renderModelControl() {
  const dataset = resultData[selectedDataset];
  modelControl.replaceChildren();
  Object.entries(dataset.models).forEach(([key, model]) => {
    const button = document.createElement('button');
    const active = key === selectedModel;
    button.type = 'button';
    button.textContent = model.label;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
    button.addEventListener('click', () => {
      selectedModel = key;
      [...modelControl.children].forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });
      renderBars();
      renderTable(dataset, dataset.models[selectedModel]);
    });
    modelControl.appendChild(button);
  });
}

function renderResults() {
  const dataset = resultData[selectedDataset];
  selectedModel = dataset.defaultModel;
  selectedMetric = dataset.defaultMetric;
  renderModelControl();
  renderMetricControl();
  renderBars();
  renderTable(dataset, dataset.models[selectedModel]);
}

datasetButtons.forEach((button) => button.addEventListener('click', () => {
  selectedDataset = button.dataset.dataset;
  datasetButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  renderResults();
}));

metricSelect.addEventListener('change', () => {
  selectedMetric = metricSelect.value;
  renderBars();
});

renderResults();

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
