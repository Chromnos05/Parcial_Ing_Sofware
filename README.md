# Clínica Salvador — Registro de Citas Médicas

## Contexto académico

Proyecto de simulación Scrum para la asignatura **Procesos de Ingeniería de Software**.  
Este repositorio contiene el incremento entregable del **Sprint 1** del proyecto "Clínica Salvador", un sistema para que un recepcionista registre citas médicas.

Metodología: Scrum con sprints de duración fija.  
Rol simulado: **Developer**.

---

## Sprint Goal

> Permitir que el recepcionista registre una cita médica completa: buscar paciente, elegir médico disponible, seleccionar horario y confirmar el registro.

---

## Sprint Backlog — Historias de usuario

### HU1 — Buscar paciente

**Como** recepcionista, **quiero** buscar un paciente por nombre o documento, **para** verificar si ya está registrado.

**Criterio de aceptación:** un campo de búsqueda filtra en tiempo real la lista de pacientes simulados; al seleccionar uno, avanza al paso 2.

### HU2 — Ver disponibilidad de médicos

**Como** recepcionista, **quiero** consultar la disponibilidad de horarios de cada médico, **para** asignar una cita sin cruces.

**Criterio de aceptación:** al elegir un médico, se muestra su franja de horarios (ledger) con los ocupados diferenciados de los libres.

### HU3 — Seleccionar médico, fecha y horario

**Como** recepcionista, **quiero** seleccionar médico, fecha y hora, **para** registrar la cita.

**Criterio de aceptación:** solo se puede avanzar al paso 4 si se eligió un horario disponible.

### HU4 — Confirmar registro de la cita

**Como** recepcionista, **quiero** recibir una confirmación al guardar la cita, **para** asegurarme que quedó registrada.

**Criterio de aceptación:** al confirmar, se muestra un mensaje de éxito con el resumen (paciente, médico, horario) y la cita aparece en una tabla de "Citas registradas" visible en la misma página.

---

## Cómo ejecutar

1. Abre el archivo `index.html` en cualquier navegador web moderno.
2. No se requiere servidor, build step, ni dependencias externas (excepto Google Fonts vía CDN).
3. El sistema funciona completamente del lado del cliente con datos simulados.

---

## Stack técnico

- HTML5 + CSS3 + JavaScript vanilla
- Google Fonts: Fraunces (títulos), IBM Plex Sans (texto), IBM Plex Mono (datos)
- Sin frameworks, sin librerías externas

---

## Estructura del proyecto

```
/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
└── README.md
```

---

## Datos simulados

- **5 pacientes** con nombre y documento de identidad.
- **3 médicos** con nombre, especialidad y 4 horarios cada uno para la fecha `2026-06-22`.
- Las citas confirmadas se almacenan en memoria durante la sesión.
