# Mantenimiento — Clínica Salvador

## Resumen del problema

"Notamos que el sistema permite agendar dos citas distintas con el mismo médico en el mismo horario. Esto generó una doble reserva esta semana. Necesitamos que el sistema impida seleccionar un horario que ya tiene una cita confirmada."

## Tipo de mantenimiento

**Correctivo**

## Justificación

Se clasifica como mantenimiento correctivo porque corrige un defecto real del sistema: la aplicación permitía un estado inválido (doble reserva en el mismo médico y horario) que no fue detectado durante las pruebas del Sprint 1. No se introduce una mejora nueva (perfectivo), no se adapta el sistema a un entorno distinto (adaptativo) ni se previenen defectos futuros (preventivo). Simplemente se repara una funcionalidad que no se comportaba según lo esperado.

## Referencia al commit de corrección

`bf65929`
