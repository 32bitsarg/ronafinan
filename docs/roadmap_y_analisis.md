# RoNa Finance - Análisis de Estado y Roadmap 🚀 (v0.0.1)

## Estado Actual de la Arquitectura

Hemos completado las dos fases más grandes y pesadas de infraestructura del proyecto, implementando características modulares listas para escalar de un simple MVP a una aplicación "Fintech-grade".

### ✅ Lo que ya está implementado al 100%:

1. **Migración DB y Seguridad:** 
   - Base de Datos en PostgreSQL usando Prisma 7.4.2 (Adaptadores PG Borde).
   - Autenticación segura vía JWT en server-side-cookies con encriptación BCRYPT (`src/lib/session.ts` y Middlware).
   - Panel de seguridad en el Sistema de Ajustes con actualización real de passwords y hash checking.
2. **Control de Acceso Multiusuario (Multi-tenant):**
   - Sistema de Familias (`Workspaces`) en la nube. Todas las tablas aíslan de forma nativa la información según el `id` de tu Familia utilizando la metodología de Join-by-Token (invitaciones con código).
3. **Hub de Ajustes y Perfil (Modular UI):** 
   - Pantallas dedicadas paramétricamente que no interfieren con la lectura pesada del inicio. Alta directa de Múltiples Cuentas y Exportación nativa del Patrimonio a hoja de cálculos unificada (CSV).
4. **Fase 1: Motor Transaccional y Multimoneda:**
   - La página de "Inicio" fue re-saneada. La inyección SQL detecta inteligentemente la moneda subyacente de cada cuenta y crea "Baldes" separados de acumulación: **ARS** y **USD**, respetando totalmente el entorno multiusuario.
   - Las transacciones en `/mobile/nuevo` (Gastos, Ingresos, y Transferencias cruzadas) envuelven a la Base de Datos en una `$transaction` ACID para prevenir que tu cuenta se debite si la segunda cuenta se cae en medio de un envío.
5. **Fase 2: Motor Inteligente (Zero-Based Budgeting & Agenda):**
   - **`RecurringTransaction`**: Se eliminó el concepto arcaico de "Suscripciones" y se creó una agenda general y predictiva (`/mobile/fijos`). Aquí, los *Ingresos Mensuales* (ej. Sueldo) y los *Egresos Fijos* de tu familia generan el "Patrimonio Proyectado". 
   - **El Motor Cron (`engine.ts`)**: Revisa a diario si un evento de agenda se venció, inyectando el dinero o debuitándolo *de tu billetera automáticamente*, usando tu zona horaria para protegerse de conteos duplicados.
   - **Presupuestos / Sobres Dinámicos**: En `/mobile/presupuesto`, la App detecta tus $ Ingresos Fijos, detecta cuánto le has destinado a tus sobres y usa matemática visual en vivo cruzando datos con la actividad de tarjetas diaria para avisarte si "sobregiraste" algún sobre antes de que finalice el mes.
   - **Forecasting (Machine Learning Simulado)**: Integrado en `/mobile/estadisticas`, proyecta el oxígeno de tu caja para los próximos 6 meses cruzando estrictamente tu *Presupuesto Base*, limitando cálculos falsos.

---

## 🚧 Roadmap Inmediato: Phase 3 (Calidad de Vida & UX Final)

Hemos creado un "búho" súper inteligente que sabe contar tu plata de memoria. El siguiente paso natural es hacerlo cómodo para usar a diario y agregarle los módulos financieros de inversión y crédito que hacen madurar a una billetera.

- [ ] **Módulo de Tarjetas de Crédito y Deudas:**
- [x] **Módulo de Tarjetas de Crédito y Deudas (Smart Debt):**
  - Se extendió el Schema de Prisma sumando Tracking de Cuotas (`totalInstallments` y `currentInstallment`) al motor de Transacciones Recurrentes. 
  - Al cargar un Gasto marcado como "Cuotas", no se debita el dinero instantáneamente arruinando tu Net Worth. Delega inteligentemente la acción al Engine Cron Diario que te lo va cobrando mes a mes.
- [x] **Panel de Inversiones (Rendimientos y CEDEARS):**
  - Tenemos el modelo SQL listito para ser usado (`Investment`), con interconexión al Dólar Blue en tiempo real.
- [x] **Cotización Real del Dólar (API Externa):**
  - Eliminar la variable *mockeada* y usar `dolar.ts` conectando la App al Dólar Blue oficial desde DolarApi. Uso de ISR para control de rate-limits.
- [ ] **Separar el Layout de Mobile y Desktop (UI Frameworking):**
  - Ya que terminamos la aplicación Mobile MVP (donde toda la plata corre segura), deberemos abstraer a carpetas `app/desktop/`, creando Layouts CSS que aprovechen los monitores grandes (Con Sidebar a la izquierda, dashboards enormes y modo panorámico al estilo Netflix / Asana).
