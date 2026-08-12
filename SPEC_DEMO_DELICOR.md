# SPEC DEMO DELICOR

## Objetivo de esta demo

Construir una demo comercial simple y convincente, lo más cercana posible a la operación actual de Delicor, sin intentar resolver todavía todos los detalles de implementación.

Flujo comercial esperado:

**Demo → Propuesta → Cierre → Definición final → Desarrollo**

La demo se divide únicamente en tres módulos:

1. Apoderado
2. Cocina
3. Administración

---

# 1. Módulo Apoderado — CERRADO PARA DEMO

## Objetivo

Permitir seleccionar uno o más días de almuerzo, elegir plato y postre por cada día, acumularlos en un carrito y realizar un único pago online.

La demo debe mostrar el reemplazo del proceso actual de transferencia + comprobante por un flujo digital simple y conectado con Cocina y Administración.

---

## 1.1 Inicio / selección de estudiante

La demo seguirá el patrón de navegación de `../DemoEnBandeja` y no tendrá un selector artificial de roles.

El recorrido de Apoderado será:

**Colegio → Curso → Estudiante → Vista semanal de almuerzos**

La nómina estará precargada.

Para esta demo NO se construirá una relación real apoderado ↔ estudiantes, gestión de hermanos ni autenticación real. Esa decisión queda para después del cierre.

---

## 1.2 Vista semanal de compra

La selección se realiza en una vista semanal, con navegación entre semanas del mes:

**‹ Semana anterior | 10–14 agosto | Semana siguiente ›**

Cada día puede estar en uno de estos estados visuales:

- Disponible para comprar.
- Agregado al carrito.
- Pagado.
- Entregado.
- Ausencia marcada (solo representativa en demo).

El usuario puede comprar cualquier combinación de días disponibles.

---

## 1.3 Selección de menú por día

Al pinchar un día disponible se abre un modal con la minuta de ese día.

Se muestran sopa y ensaladas como información y se debe seleccionar:

- 1 plato de fondo;
- 1 postre.

La alternativa vegetariana aparece como una opción más, claramente identificada.

Ejemplo:

### Lunes 10

**Platos**
- Pollo arvejado / arroz
- Beef de cerdo / zanahorias al curry
- 🌱 Torta panqueque vegetariana

**Postres**
- Duraznos al jugo
- Sémola salsa frutilla
- Fruta surtida
- Ensalada de fruta

Acción:

**[Agregar al carrito y continuar →]**

Al continuar se avanza al siguiente día para acelerar la selección de varios almuerzos.

---

## 1.4 Carrito y compra

Cada día seleccionado agrega un almuerzo al carrito con:

- fecha;
- estudiante;
- plato;
- postre;
- precio.

Precio de referencia para la demo: **$5.200 por almuerzo**.

El usuario puede agregar 1, 3, 8, 12 o cualquier cantidad de días y luego realizar **un único pago online por todo el carrito**.

Después de una compra puede volver posteriormente y realizar otra compra por días adicionales.

---

## 1.5 Descuento por mes completo

Si en una sola compra anticipada se seleccionan **todos los días hábiles del mes, desde el primer hasta el último día**, el sistema reconoce automáticamente la compra completa del mes.

Para la demo se aplicará un **10% de descuento** y se mostrará visualmente:

**Mes completo seleccionado — 10% de descuento aplicado ✅**

Comprar solamente todos los días que quedan cuando el mes ya comenzó NO debe activar este descuento.

El 10% es únicamente un valor demostrativo; la regla comercial definitiva queda por definir con Delicor.

---

## 1.6 Pago online

La demo debe mostrar un pago online simulado, no transferencia ni envío de comprobante.

Después del pago:

- los días quedan como Pagados;
- Cocina puede ver al estudiante como pagado en esas fechas;
- las cantidades seleccionadas se incorporan a Preparación;
- Administración refleja el ingreso correspondiente.

No se integra una pasarela real en la demo.

---

## 1.7 Cambios posteriores

Una vez pagado, para la demo no se permitirá modificar plato o postre.

La elección tiene como objetivo principal entregar a Delicor un conteo previo de preferencias para producción.

La hora límite real para comprar queda **POR CONSULTAR CON DELICOR**. Como referencia de la conversación, aparentemente sería antes de las 12:00.

---

## 1.8 Ausencia / inasistencia

No se desarrollará el flujo real de ausencia.

Se mostrará un botón visible:

**[Marcar ausencia]**

Al presionarlo se abre un modal explicativo indicando que esa acción llevará al flujo correspondiente de ausencia/descuento según las reglas definidas con Delicor.

La lógica definitiva de horarios, descuento, saldo o devolución queda por definir después del cierre.

---

## 1.9 Resultado que recibe Delicor

Cada selección pagada alimenta automáticamente los datos de Cocina y Administración.

Ejemplo conceptual para un día:

**Platos**
- Carne mechada: 83
- Pescado vizcaína: 41
- Falafel vegetariano: 16

**Postres**
- Rejilla: 52
- Jalea de naranja: 39
- Fruta natural: 27
- Ensalada de fruta: 22

El valor principal es pasar de estimar preferencias a contar con selecciones previas concretas.

---

# 2. Módulo Cocina — CERRADO PARA DEMO

## Objetivo

Permitir que el equipo de cocina conozca con anticipación qué debe preparar y que pueda registrar la entrega de almuerzos de forma rápida, usando una nómina de estudiantes precargada.

La cocina de cada sede verá únicamente la operación de su propio colegio. La separación por roles y usuarios se explicará durante la demo y se definirá técnicamente después del cierre.

---

## 2.1 Vista Preparación

La vista principal de Cocina debe mostrar la producción del día.

Ejemplo:

**Total alumnos con almuerzo:** 186

### Platos
- Pollo al limón: 72
- Carne al jugo: 61
- Vegetariano: 18

### Postres
- Flan de vainilla: 52
- Fruta natural: 47
- Ensalada de fruta: 39
- Otro postre: 48

También se mostrará:

- **Funcionarios informados:** cifra separada de los estudiantes.

No existe el estado “pagado pero sin menú”: para agregar un día al carrito es obligatorio elegir plato y postre antes de pagar.

La finalidad de esta vista es entregar a Cocina una referencia clara de cantidades antes del servicio.

---

## 2.2 Vista Entrega

La entrega ocurre en una sola pantalla.

Debe existir:

- listado de estudiantes;
- buscador por nombre;
- filtro por curso;
- estado de entrega;
- estado de pago;
- plato elegido;
- postre elegido.

La nómina de estudiantes se considera precargada para la demo.

---

## 2.3 Alumno con almuerzo pagado

Al buscar un alumno con mensualidad/pago registrado se muestra, por ejemplo:

**Martín Pérez — 7°A**  
✅ Pagado  
Pollo al limón  
Flan de vainilla

**[Entregar]**

Al presionar el botón:

**Entregado ✅**

El sistema registra la entrega y evita una segunda entrega accidental.

---

## 2.4 Alumno sin compra registrada

No existe un flujo separado.

Se utiliza la misma pantalla de Entrega.

Si el estudiante está en la nómina pero no tiene un almuerzo pagado/reservado para ese día, se muestra:

**Martín Pérez — 7°A**  
⚪ Sin pago registrado

**Plato:** [Seleccionar]  
**Postre:** [Seleccionar]

**[Entregar]**

Al realizar la entrega, el sistema registra automáticamente:

- estudiante;
- curso;
- colegio;
- fecha;
- plato;
- postre;
- entrega realizada;
- estado **Pago pendiente**.

Resultado:

**Entregado ✅ · Pago pendiente ⚠️**

Esta información queda disponible posteriormente para el módulo Administración.

El objetivo es eliminar la necesidad de que el alumno haga una segunda fila para ser anotado manualmente antes de recibir su almuerzo.

---

## 2.5 Nómina precargada

Para la demo se mostrará una nómina de estudiantes previamente cargada.

Esto permite que Cocina busque rápidamente por nombre o curso y no tenga que escribir manualmente los datos del estudiante.

Si en producción fuera necesario contemplar estudiantes no presentes en la nómina, ese caso se definirá después del cierre.

---

## 2.6 Funcionarios

Para la demo, Cocina solo verá la cantidad informada de funcionarios como dato adicional para producción.

Ejemplo:

**Funcionarios informados: 80**

No se desarrollará en Cocina el control de asistencia, justificaciones ni cobro de funcionarios.

Ese flujo se explicará verbalmente y, si corresponde, se definirá posteriormente dentro de Administración o durante la etapa de implementación.

---

## 2.7 Filtros

Mantener únicamente filtros útiles para la operación:

- curso;
- estado: pendientes / entregados / todos;
- opcionalmente plato.

No incluir herramientas administrativas, financieras ni configuraciones dentro de Cocina.

---

## 2.8 Criterio de demo

Cocina debe transmitir dos beneficios principales:

1. **Saber con anticipación cuántas unidades preparar de cada plato y postre.**
2. **Entregar rápido incluso cuando un estudiante llega sin pago previo, registrando automáticamente el pendiente para Administración.**

No agregar funcionalidades adicionales que aumenten innecesariamente el alcance de la demo.

---

# 3. Módulo Administración — CERRADO PARA DEMO

## Objetivo

Entregar a Delicor una vista simple y centralizada de la operación de ambos colegios, con foco en ingresos, pagos, pendientes de cobro, operación diaria y funcionarios.

Administración debe sentirse como un centro de control, no como un sistema contable complejo.

---

## 3.1 Resumen general Delicor

La vista principal incluye:

- Selector de colegio:
  - Todos los colegios
  - Colegio San Isidro
  - Colegio La Cruz
- Selector de período.

Cuando se selecciona un colegio, toda la información del dashboard se filtra a esa sede.

### Indicadores principales

- Ingresos del mes.
- Almuerzos/compras pagadas.
- Monto pendiente de cobro.
- Almuerzos entregados hoy.
- Funcionarios informados hoy.
- Almuerzos de funcionarios acumulados en el mes.

---

## 3.2 Vista por colegio

Cuando Administración está en la vista general, debe poder ver un resumen de cada establecimiento.

Ejemplo:

### Colegio San Isidro
- alumnos activos;
- ingresos del mes;
- almuerzos del día;
- pendientes de cobro;
- funcionarios informados;
- acceso rápido a la operación de la sede.

### Colegio La Cruz
- alumnos activos;
- ingresos del mes;
- almuerzos del día;
- pendientes de cobro;
- funcionarios informados;
- acceso rápido a la operación de la sede.

El objetivo es que Delicor pueda administrar ambos colegios desde una sola plataforma sin mezclar sus operaciones.

---

## 3.3 Operación de hoy

Mostrar un resumen simple de la operación diaria:

- almuerzos pagados/reservados;
- almuerzos entregados;
- pendientes de entregar;
- entregados sin pago;
- funcionarios informados;
- resumen de platos;
- resumen de postres.

Administración ve el resumen de la operación, sin duplicar toda la interfaz de Cocina.

---

## 3.4 Pagos y compras

Vista orientada a consulta rápida.

Debe incluir buscador por alumno o apoderado.

Información visible:

- alumno;
- curso;
- colegio;
- fecha o rango de días comprados;
- monto;
- estado de pago.

Estados principales:

- Pagado
- Sin compra registrada

No existen planes separados “diario / semanal / mensual”. El usuario compra cualquier combinación de días; la única regla especial es el descuento por compra anticipada del mes completo.

El objetivo es que Administración pueda responder rápidamente ante consultas sobre el estado de compra de un estudiante.

---

## 3.5 Pendientes de cobro

Esta vista reúne automáticamente los almuerzos entregados a estudiantes que no tenían un pago registrado.

Debe mostrar la deuda agrupada por estudiante, conservando trazabilidad completa:

- alumno;
- curso;
- colegio;
- cantidad de consumos pendientes;
- total adeudado;
- acceso al detalle de cada consumo.

Al abrir el detalle se deben ver las fechas y montos individuales que componen la deuda.

Acción principal:

**[Comunicar deuda]**

Al presionarlo se abre un modal con el resumen de la deuda y un ejemplo del mensaje que podría enviarse al apoderado.

Ejemplo conceptual:

> Martín Pérez registra 3 almuerzos pendientes de pago por un total de $15.600.

El modal puede mostrar un texto listo para comunicar la deuda a la familia. La demo no necesita implementar el envío real ni resolver todavía la relación/autenticación del apoderado.

---

## 3.6 Funcionarios

Administración debe visualizar:

- funcionarios informados hoy;
- almuerzos de funcionarios acumulados en el mes;
- información separada por colegio.

El origen de esta información queda **POR CONSULTAR CON DELICOR**.

Las alternativas consideradas son:

1. cada funcionario selecciona su almuerzo;
2. un encargado del colegio utiliza una mini pantalla para informar o confirmar la nómina de funcionarios que almorzarán.

Para la demo no se construirá ese flujo completo. Se utilizarán datos simulados para que Cocina y Administración muestren correctamente la información de funcionarios.

---

## 3.7 Navegación de Administración

Mantener la navegación corta:

- **Resumen**
- **Pagos**
- **Pendientes de cobro**

La información de funcionarios se integra dentro del Resumen.

No agregar módulos adicionales que aumenten innecesariamente el alcance de la demo.

---

## 3.8 Criterio de demo

Administración debe transmitir rápidamente:

1. cuánto está vendiendo Delicor;
2. qué ocurre en cada uno de sus dos colegios;
3. qué compras de almuerzo están pagadas;
4. qué almuerzos fueron entregados sin pago;
5. cuánto dinero está pendiente de cobro;
6. cuántos funcionarios están siendo considerados en la operación diaria y mensual.

La prioridad es mostrar control y visibilidad de la operación, sin convertir la demo en un ERP.

---

# 4. Conexión entre módulos — COMPORTAMIENTO OBLIGATORIO

La demo debe funcionar como un solo sistema conectado. No construir tres pantallas independientes con datos que no se afecten entre sí.

## 4.1 Compra pagada

Cuando desde Apoderado se seleccionan uno o más días, se elige plato + postre para cada día y se completa el pago:

1. cada día comprado queda en estado **Pagado**;
2. Cocina recibe esas selecciones para su colegio y fecha;
3. las cantidades de plato y postre se suman automáticamente en **Preparación**;
4. el estudiante aparece en **Entrega** con su plato, postre y estado Pagado;
5. Administración incorpora el pago a sus ingresos y registros de compras.

No existe “Pagado sin menú”, porque plato y postre son obligatorios antes de agregar un día al carrito.

## 4.2 Entrega de compra pagada

Cuando Cocina busca al estudiante y presiona **Entregar**:

1. el consumo queda **Entregado**;
2. no debe poder registrarse una segunda entrega accidental;
3. Administración actualiza automáticamente sus métricas de entregas del día.

## 4.3 Entrega sin compra previa

Cuando un estudiante de la nómina llega sin una compra registrada:

1. Cocina lo busca en la misma pantalla de Entrega;
2. se muestra **Sin pago registrado**;
3. Cocina selecciona plato + postre;
4. presiona **Entregar**;
5. el consumo queda **Entregado + Pago pendiente**;
6. Administración crea automáticamente un pendiente de **$5.200** para ese estudiante.

No existe una segunda fila ni un flujo paralelo.

## 4.4 Trazabilidad de deuda

Si el mismo estudiante consume varios días sin pago, Administración debe agrupar el total por estudiante pero conservar cada consumo individual.

Ejemplo:

**Martín Pérez — 3 consumos pendientes — $15.600**

Al abrir el detalle:

- 10 agosto — $5.200
- 12 agosto — $5.200
- 18 agosto — $5.200

Esto debe permitir entender exactamente de dónde proviene el total adeudado.

## 4.5 Separación multicolegio

- Cocina San Isidro solo puede ver y operar datos de San Isidro.
- Cocina La Cruz solo puede ver y operar datos de La Cruz.
- Una cocina no necesita ver la operación de la otra sede.
- Administración puede seleccionar:
  - Todos los colegios;
  - San Isidro;
  - La Cruz.
- Las métricas de “Todos los colegios” deben ser la suma coherente de ambas sedes.

La separación real mediante roles/permisos se definirá después del cierre; para la demo basta con que la navegación y los datos respeten esta separación.


---

## Datos mock obligatorios

La demo debe contener datos consistentes para ambos colegios:

- Colegio San Isidro.
- Colegio La Cruz.
- Niveles desde **1° Básico hasta IV° Medio**.
- Un curso por nivel.
- **15 estudiantes por curso**.
- Total: **180 estudiantes por colegio / 360 estudiantes en total**.

Los datos deben mezclar casos suficientes para probar los flujos:

- estudiante con compra pagada y pendiente de entrega;
- estudiante pagado y ya entregado;
- estudiante sin compra;
- estudiante entregado sin pago y con deuda;
- compras de distintos números de días;
- al menos un caso de compra completa del mes con descuento demo del 10%.

Los números mostrados en Apoderado, Cocina y Administración deben derivarse de estos mismos datos y ser coherentes entre pantallas.

La interacción debe actualizar el estado compartido de la demo: una compra, entrega o consumo sin pago realizado en un módulo debe reflejarse inmediatamente en los módulos correspondientes.

Los datos de funcionarios serán mock en la demo. El mecanismo real que originará esa información queda **POR CONSULTAR CON DELICOR**: selección individual de funcionarios o mini panel utilizado por un encargado del colegio.

Para los datos mock de funcionarios usar valores realistas y coherentes por sede. Como referencia inicial para la semana visible:

- Colegio San Isidro: alrededor de **80 funcionarios informados por día**.
- Colegio La Cruz: alrededor de **65 funcionarios informados por día**.

Los totales mensuales de funcionarios deben derivarse de los datos diarios sembrados en la demo y no ser números independientes.

---

## Criterio general de la demo

Esta es una demo comercial navegable de la operación de Delicor, no el producto final.

Debe permitir que la cliente explore naturalmente la solución y entienda el potencial de digitalizar su proceso. Seguir el estilo de recorrido de `../DemoEnBandeja` y evitar una pantalla artificial de “seleccionar rol” creada solo para presentar la demo.

Priorizar claridad visual, continuidad entre módulos y coherencia de datos por sobre profundidad técnica.

No construir funcionalidades que no sean necesarias para mostrar el flujo comercial.

Todo lo que requiera reglas de negocio definitivas, autenticación real, pagos reales, permisos, automatizaciones o integración con datos reales quedará para la etapa posterior al cierre.


---

# 5. Fuente de minuta y período visible

## 5.1 Minuta de agosto

Sonnet recibirá por separado el archivo **Menu-agosto.pdf**.

Ese PDF debe utilizarse como **fuente de verdad para la minuta de agosto**:

- fechas;
- sopas y ensaladas informativas;
- platos de fondo;
- alternativa vegetariana;
- postres.

No inventar platos o postres cuando el PDF entregue la información correspondiente.

La misma minuta se utilizará para ambos colegios, de acuerdo con la operación informada por Delicor.

## 5.2 Semana inicial

Al abrir la vista semanal del apoderado, iniciar en:

**Semana del 10 al 14 de agosto de 2026.**

Permitir avanzar por las semanas restantes de agosto hasta finalizar el mes.

No es necesario navegar a meses distintos dentro de esta demo.

---

# 6. Entorno de trabajo, base técnica y reutilización

## 6.1 Estructura local esperada

El agente se ejecutará dentro de la carpeta **`DemoDelicor`**.

La estructura esperada es:

```text
Proyectos/
├── DemoDelicor/          ← PROYECTO ACTUAL. Único directorio que se debe modificar.
│   ├── SPEC_DEMO_DELICOR.md
│   └── Menu-agosto.pdf
├── DemoEnBandeja/        ← REFERENCIA. Solo lectura.
└── DemoPalmares/         ← REFERENCIA. Solo lectura.
```

Por lo tanto, desde `DemoDelicor` las referencias locales son:

- `../DemoEnBandeja`
- `../DemoPalmares`

### Regla obligatoria

- **Modificar y crear archivos únicamente dentro de `DemoDelicor`.**
- Los proyectos `../DemoEnBandeja` y `../DemoPalmares` se utilizan exclusivamente para leer, analizar y reutilizar patrones.
- No editar, borrar, formatear, hacer commits ni cambiar configuración en los proyectos de referencia.
- El presente `SPEC_DEMO_DELICOR.md` tiene prioridad sobre cualquier comportamiento encontrado en los proyectos anteriores.
- `Menu-agosto.pdf` es la fuente de verdad para la minuta.

## 6.2 Repositorios de referencia

Tomar como base conceptual principal **`../DemoPalmares`** para:

- estructura multicolegio;
- reutilización de vistas por sede;
- dashboard de Cocina;
- dashboard de Administración;
- navegación contextual por colegio;
- datos mock y estado local.

Tomar de **`../DemoEnBandeja`** el patrón de flujo para:

- selección del estudiante;
- experiencia comercial simple;
- pantalla de Entrega;
- búsqueda por nombre/curso;
- marcado de entrega;
- registro de un almuerzo entregado sin compra previa.

No copiar ciegamente ni reconstruir innecesariamente componentes que ya existan. Primero revisar cómo están implementados y luego adaptar únicamente lo útil a `DemoDelicor`.

Para la demo:

- sin backend real;
- sin Supabase;
- sin autenticación real;
- sin pasarela de pago real;
- sin WhatsApp/correo real;
- sin flujo completo de funcionarios;
- sin lógica real de ausencia;
- estado compartido en cliente/localStorage o mecanismo local equivalente;
- todas las vistas deben reaccionar al mismo estado para mantener coherencia entre Apoderado, Cocina y Administración.

El resultado debe sentirse como una única plataforma Delicor y no como una colección de pantallas separadas.

---

# 6.3 Orden de trabajo obligatorio para el agente

Antes de escribir código:

1. Leer completamente `SPEC_DEMO_DELICOR.md`.
2. Revisar `Menu-agosto.pdf`.
3. Explorar `../DemoPalmares` y localizar los componentes/rutas/estado útiles para multicolegio, Cocina y Administración.
4. Explorar `../DemoEnBandeja` y localizar los componentes/rutas/estado útiles para selección de estudiante y Entrega.
5. Volver al directorio `DemoDelicor`.
6. Presentar un plan breve indicando:
   - qué se reutilizará/adaptará de `DemoPalmares`;
   - qué se reutilizará/adaptará de `DemoEnBandeja`;
   - qué se construirá nuevo;
   - rutas principales propuestas;
   - modelo de estado mock compartido.
7. Después de ese análisis, construir la demo exclusivamente en `DemoDelicor`.

El objetivo final es entregar una **demo comercial navegable, clara, coherente e interactiva del proceso Delicor**, que permita a la cliente entender tanto el funcionamiento inmediato como el potencial de digitalización de su operación.

---

# 7. Navegación entre áreas de la demo

La demo NO debe incluir una pantalla artificial de selección de roles.

Desde la experiencia del apoderado, incluir al pie de la interfaz accesos discretos:

- **Acceso Casino**
- **Administración**

Estos enlaces deben sentirse como accesos naturales de una plataforma real y no como controles creados únicamente para una presentación.

## 7.1 Acceso Casino

**Acceso Casino** lleva a la operación de Cocina.

Como cada cocina debe operar únicamente su propio establecimiento, la demo debe permitir entrar a una sede concreta sin mostrar simultáneamente la otra cocina.

Las rutas pueden resolverse de forma separada por sede, reutilizando el mismo componente y cambiando solo el contexto/datos.

## 7.2 Administración

**Administración** lleva al dashboard administrativo de Delicor.

Desde allí sí se puede consultar:

- Todos los colegios;
- Colegio San Isidro;
- Colegio La Cruz.

## 7.3 Criterio visual

Los accesos del pie deben ser visibles pero secundarios. La experiencia principal del apoderado no debe sentirse contaminada por herramientas internas del casino.

La cliente debe poder recorrer por sí sola la demo completa y descubrir Cocina y Administración sin necesidad de recibir URLs independientes.

---

# 8. Repositorio Git y política de commits

El proyecto `DemoDelicor` corresponde al repositorio:

`https://github.com/ChristianEducation/DemoDelicor`

El repositorio parte vacío y la rama principal es `main`.

## Regla obligatoria de Git

El agente puede:

- inicializar/configurar el proyecto local;
- crear y modificar archivos dentro de `DemoDelicor`;
- ejecutar la aplicación;
- revisar cambios con `git status` y `git diff`;
- preparar una propuesta de commit.

Pero **NO debe ejecutar `git commit`, `git push`, crear PRs ni modificar el repositorio remoto sin confirmación explícita de Christian**.

Antes de cualquier commit o push, debe:

1. resumir qué cambios se realizaron;
2. indicar qué archivos se agregarán/modificarán;
3. proponer el mensaje de commit;
4. esperar confirmación explícita.

Solo después de recibir esa confirmación puede realizar el commit y/o push solicitado.

Esta regla tiene prioridad sobre cualquier automatismo del agente o flujo estándar de Git.
