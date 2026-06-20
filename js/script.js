const PACIENTES = [
  { id: 1, nombre: 'María García', documento: '12345678' },
  { id: 2, nombre: 'Juan Pérez', documento: '23456789' },
  { id: 3, nombre: 'Ana López', documento: '34567890' },
  { id: 4, nombre: 'Carlos Martínez', documento: '45678901' },
  { id: 5, nombre: 'Laura Rodríguez', documento: '56789012' },
];

let pacienteSeleccionado = null;

const searchInput = document.getElementById('search-patient');
const patientList = document.getElementById('patient-list');
const noResults = document.getElementById('no-results');

function normalizar(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function filtrarPacientes(query) {
  const q = normalizar(query);
  return PACIENTES.filter(p =>
    normalizar(p.nombre).includes(q) || p.documento.includes(q)
  );
}

function renderizarPacientes(pacientes) {
  patientList.innerHTML = '';
  if (pacientes.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }
  noResults.classList.add('hidden');
  pacientes.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'patient-item';
    btn.setAttribute('role', 'option');
    btn.setAttribute('aria-selected', 'false');
    btn.innerHTML = `
      <span class="patient-name">${p.nombre}</span>
      <span class="patient-doc">${p.documento}</span>
    `;
    btn.addEventListener('click', () => seleccionarPaciente(p));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') seleccionarPaciente(p);
    });
    patientList.appendChild(btn);
  });
}

function seleccionarPaciente(paciente) {
  pacienteSeleccionado = paciente;
  avanzarPaso(2);
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();
  if (query.length === 0) {
    patientList.innerHTML = '';
    noResults.classList.add('hidden');
    return;
  }
  const resultados = filtrarPacientes(query);
  renderizarPacientes(resultados);
});

function avanzarPaso(paso) {
  const pasos = document.querySelectorAll('.step');
  const secciones = document.querySelectorAll('.wizard-step');

  pasos.forEach(s => s.classList.remove('active', 'completed'));
  secciones.forEach(s => s.classList.remove('active'));

  for (let i = 1; i < paso; i++) {
    const stepEl = document.querySelector(`.step[data-step="${i}"]`);
    if (stepEl) stepEl.classList.add('completed');
  }

  const stepActual = document.querySelector(`.step[data-step="${paso}"]`);
  const seccionActual = document.getElementById(`step-${paso}`);
  if (stepActual) stepActual.classList.add('active');
  if (seccionActual) {
    seccionActual.classList.add('active');
    const primerEnfoque = seccionActual.querySelector('input, button, [tabindex]');
    if (primerEnfoque) primerEnfoque.focus();
  }
}
