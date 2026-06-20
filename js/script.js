const PACIENTES = [
  { id: 1, nombre: 'María García', documento: '12345678' },
  { id: 2, nombre: 'Juan Pérez', documento: '23456789' },
  { id: 3, nombre: 'Ana López', documento: '34567890' },
  { id: 4, nombre: 'Carlos Martínez', documento: '45678901' },
  { id: 5, nombre: 'Laura Rodríguez', documento: '56789012' },
];

const MEDICOS = [
  { id: 1, nombre: 'Dr. Alejandro Vargas', especialidad: 'Cardiología', horarios: ['08:00', '09:00', '10:00', '11:00'] },
  { id: 2, nombre: 'Dra. Patricia Mendoza', especialidad: 'Pediatría', horarios: ['08:30', '09:30', '10:30', '11:30'] },
  { id: 3, nombre: 'Dr. Ricardo Navarro', especialidad: 'Dermatología', horarios: ['09:00', '10:00', '11:00', '12:00'] },
];

const FECHA_CITA = '2026-06-22';

let pacienteSeleccionado = null;
let medicoSeleccionado = null;
let horarioSeleccionado = null;
let horariosOcupados = [];

let contadorCitas = 0;

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
  medicoSeleccionado = null;
  horarioSeleccionado = null;
  renderizarDoctores();
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

function renderizarDoctores() {
  const container = document.getElementById('doctor-list');
  const ledgerWrapper = document.getElementById('doctor-ledger');
  container.innerHTML = '';
  ledgerWrapper.classList.add('hidden');
  document.getElementById('to-step-3').disabled = true;

  MEDICOS.forEach(m => {
    const card = document.createElement('button');
    card.className = 'doctor-card';
    card.innerHTML = `
      <span class="doctor-name">${m.nombre}</span>
      <span class="doctor-spec">${m.especialidad}</span>
    `;
    card.addEventListener('click', () => seleccionarMedico(m));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') seleccionarMedico(m);
    });
    container.appendChild(card);
  });
}

function seleccionarMedico(medico) {
  medicoSeleccionado = medico;
  horarioSeleccionado = null;
  document.getElementById('to-step-3').disabled = true;
  renderizarLedger(medico);
}

function renderizarLedger(medico) {
  const wrapper = document.getElementById('doctor-ledger');
  const nameSpan = document.getElementById('ledger-doctor-name');
  const dateSpan = document.getElementById('ledger-date');
  const slotsContainer = document.getElementById('ledger-slots');

  nameSpan.textContent = medico.nombre;
  dateSpan.textContent = FECHA_CITA;
  slotsContainer.innerHTML = '';

  wrapper.classList.remove('hidden');

  medico.horarios.forEach(hora => {
    const slot = document.createElement('button');
    slot.className = 'ledger-slot';
    slot.setAttribute('role', 'radio');
    slot.setAttribute('aria-checked', 'false');
    slot.textContent = hora;

    const ocupado = horariosOcupados.some(
      o => o.medicoId === medico.id && o.hora === hora
    );

    if (ocupado) {
      slot.classList.add('occupied');
      slot.disabled = true;
      slot.setAttribute('aria-disabled', 'true');
    }

    slot.addEventListener('click', () => {
      if (!slot.disabled) {
        document.querySelectorAll('.ledger-slot.selected').forEach(s => {
          s.classList.remove('selected');
          s.setAttribute('aria-checked', 'false');
        });
        slot.classList.add('selected');
        slot.setAttribute('aria-checked', 'true');
        horarioSeleccionado = hora;
        document.getElementById('to-step-3').disabled = false;
      }
    });

    slotsContainer.appendChild(slot);
  });
}

function renderizarStep3() {
  document.getElementById('summary-patient').textContent = pacienteSeleccionado.nombre;
  document.getElementById('summary-document').textContent = pacienteSeleccionado.documento;
  document.getElementById('summary-doctor').textContent = medicoSeleccionado.nombre;
  document.getElementById('summary-spec').textContent = medicoSeleccionado.especialidad;
  document.getElementById('summary-date').textContent = FECHA_CITA;

  const container = document.getElementById('step3-slots');
  container.innerHTML = '';
  document.getElementById('to-step-4').disabled = true;

  medicoSeleccionado.horarios.forEach(hora => {
    const slot = document.createElement('button');
    slot.className = 'ledger-slot';
    slot.setAttribute('role', 'radio');
    slot.setAttribute('aria-checked', 'false');
    slot.textContent = hora;

    const ocupado = horariosOcupados.some(
      o => o.medicoId === medicoSeleccionado.id && o.hora === hora
    );

    if (ocupado) {
      slot.classList.add('occupied');
      slot.disabled = true;
      slot.setAttribute('aria-disabled', 'true');
    }

    if (hora === horarioSeleccionado) {
      slot.classList.add('selected');
      slot.setAttribute('aria-checked', 'true');
      document.getElementById('to-step-4').disabled = false;
    }

    slot.addEventListener('click', () => {
      if (!slot.disabled) {
        document.querySelectorAll('#step3-slots .ledger-slot.selected').forEach(s => {
          s.classList.remove('selected');
          s.setAttribute('aria-checked', 'false');
        });
        slot.classList.add('selected');
        slot.setAttribute('aria-checked', 'true');
        horarioSeleccionado = hora;
        document.getElementById('to-step-4').disabled = false;
      }
    });

    container.appendChild(slot);
  });
}

function renderizarStep4() {
  document.getElementById('confirm-patient').textContent = pacienteSeleccionado.nombre;
  document.getElementById('confirm-document').textContent = pacienteSeleccionado.documento;
  document.getElementById('confirm-doctor').textContent = medicoSeleccionado.nombre;
  document.getElementById('confirm-spec').textContent = medicoSeleccionado.especialidad;
  document.getElementById('confirm-date').textContent = FECHA_CITA;
  document.getElementById('confirm-time').textContent = horarioSeleccionado;

  document.getElementById('success-message').classList.add('hidden');
  document.getElementById('confirm-appointment').classList.remove('hidden');
  document.getElementById('new-appointment').classList.add('hidden');
}

function registrarCita() {
  // TODO(mantenimiento-correctivo): validar que el horario no esté ya ocupado antes de confirmar
  contadorCitas++;
  const cita = {
    id: contadorCitas,
    paciente: pacienteSeleccionado.nombre,
    documento: pacienteSeleccionado.documento,
    medico: medicoSeleccionado.nombre,
    especialidad: medicoSeleccionado.especialidad,
    fecha: FECHA_CITA,
    hora: horarioSeleccionado,
  };

  horariosOcupados.push({
    medicoId: medicoSeleccionado.id,
    hora: horarioSeleccionado,
  });

  agregarCitaTabla(cita);

  document.getElementById('success-message').classList.remove('hidden');
  document.getElementById('confirm-appointment').classList.add('hidden');
  document.getElementById('new-appointment').classList.remove('hidden');
}

function agregarCitaTabla(cita) {
  const tbody = document.getElementById('appointments-body');
  const noApptMsg = document.getElementById('no-appointments');

  noApptMsg.classList.add('hidden');

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${cita.paciente}</td>
    <td class="mono">${cita.documento}</td>
    <td>${cita.medico}</td>
    <td>${cita.especialidad}</td>
    <td>${cita.fecha}</td>
    <td class="mono">${cita.hora}</td>
  `;
  tbody.appendChild(tr);
}

function reiniciarFormulario() {
  pacienteSeleccionado = null;
  medicoSeleccionado = null;
  horarioSeleccionado = null;
  searchInput.value = '';
  patientList.innerHTML = '';
  noResults.classList.add('hidden');

  document.getElementById('success-message').classList.add('hidden');
  document.getElementById('confirm-appointment').classList.remove('hidden');
  document.getElementById('new-appointment').classList.add('hidden');

  renderizarDoctores();
  avanzarPaso(1);
}

function avanzarPaso(paso) {
  const pasos = document.querySelectorAll('.step');
  const secciones = document.querySelectorAll('.wizard-step');

  if (paso === 3) {
    renderizarStep3();
  } else if (paso === 4) {
    renderizarStep4();
  }

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

document.addEventListener('DOMContentLoaded', () => {
  renderizarDoctores();
});

document.getElementById('back-to-1').addEventListener('click', () => {
  avanzarPaso(1);
});

document.getElementById('to-step-3').addEventListener('click', () => {
  if (!document.getElementById('to-step-3').disabled) {
    avanzarPaso(3);
  }
});

document.getElementById('back-to-2').addEventListener('click', () => {
  renderizarDoctores();
  avanzarPaso(2);
});

document.getElementById('to-step-4').addEventListener('click', () => {
  if (!document.getElementById('to-step-4').disabled) {
    avanzarPaso(4);
  }
});

document.getElementById('back-to-3').addEventListener('click', () => {
  renderizarStep3();
  avanzarPaso(3);
});

document.getElementById('confirm-appointment').addEventListener('click', registrarCita);

document.getElementById('new-appointment').addEventListener('click', reiniciarFormulario);
