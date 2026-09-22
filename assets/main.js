const horizon = document.getElementById('horizon');
const horizonOutput = document.getElementById('horizon-output');
const prefixValue = document.getElementById('prefix-value');
const geometryValue = document.getElementById('geometry-value');
const reliabilityValue = document.getElementById('reliability-value');
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
  const pathProgress = 18 + ratio * 82;
  const reliable = score < 0.42;

  horizonOutput.value = `k = ${k}`;
  prefixValue.textContent = k;
  geometryValue.textContent = score.toFixed(2);
  reliabilityValue.textContent = reliable ? 'execute' : 'observe again';
  reliabilityValue.className = reliable ? 'is-reliable' : 'is-uncertain';
  logicK.textContent = k;
  frameLabel.textContent = `${reliable ? 'EXECUTE' : 'REPLAN AT'} ${k} STEPS`;
  chartCursor.setAttribute('x1', chartX);
  chartCursor.setAttribute('x2', chartX);
  chartPoint.setAttribute('cx', chartX);
  chartPoint.setAttribute('cy', chartY);
  trajectory.style.strokeDasharray = `${pathProgress} ${100 - pathProgress}`;

  const pathLength = trajectory.getTotalLength();
  const point = trajectory.getPointAtLength(pathLength * pathProgress / 100);
  trajectoryPoint.setAttribute('cx', point.x);
  trajectoryPoint.setAttribute('cy', point.y);
}

horizon.addEventListener('input', updateHorizon);
updateHorizon();

let selectedDataset = 'LIBERO';
let selectedModel = 'GR00T N1.5';
const resultContext = document.getElementById('result-context');

function updateResultContext() {
  resultContext.textContent = `${selectedDataset} · ${selectedModel}`;
}

document.querySelectorAll('#dataset-control button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('#dataset-control button').forEach((item) => item.classList.toggle('is-active', item === button));
    selectedDataset = button.textContent;
    updateResultContext();
  });
});

document.querySelectorAll('#model-control button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('#model-control button').forEach((item) => item.classList.toggle('is-active', item === button));
    selectedModel = button.textContent;
    updateResultContext();
  });
});

const bibtexButton = document.getElementById('bibtex-button');
bibtexButton.addEventListener('click', async () => {
  const citation = document.getElementById('bibtex').textContent;
  const originalLabel = 'Copy BibTeX';
  bibtexButton.setAttribute('aria-busy', 'true');

  try {
    await navigator.clipboard.writeText(citation);
  } catch {
    const helper = document.createElement('textarea');
    helper.value = citation;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
  }

  bibtexButton.removeAttribute('aria-busy');
  bibtexButton.dataset.state = 'success';
  bibtexButton.textContent = 'BibTeX copied';
  window.setTimeout(() => {
    delete bibtexButton.dataset.state;
    bibtexButton.textContent = originalLabel;
  }, 2500);
});

document.getElementById('year').textContent = new Date().getFullYear();
