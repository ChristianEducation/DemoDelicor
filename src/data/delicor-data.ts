import { menuAgosto, todosLosDiasHabilesAgosto } from "@/data/menu-agosto";
import type {
  Almuerzo,
  Colegio,
  ColegioId,
  Compra,
  Curso,
  DemoConfig,
  Estudiante,
  FuncionariosDia,
} from "@/types";

/** "Hoy" fijo de la demo: cae dentro de la semana inicial (10-14 agosto) para que
 * la vista semanal, cocina y administración muestren coherentemente actividad "de hoy". */
export const DEMO_TODAY = "2026-08-12";

export const colegios: Colegio[] = [
  { id: "san-isidro", name: "Colegio San Isidro", shortName: "San Isidro", comuna: "Las Condes" },
  { id: "la-cruz", name: "Colegio La Cruz", shortName: "La Cruz", comuna: "Ñuñoa" },
];

export const cursos: Curso[] = [
  { id: "1-basico", name: "1° Básico", nivel: "basica", orden: 1 },
  { id: "2-basico", name: "2° Básico", nivel: "basica", orden: 2 },
  { id: "3-basico", name: "3° Básico", nivel: "basica", orden: 3 },
  { id: "4-basico", name: "4° Básico", nivel: "basica", orden: 4 },
  { id: "5-basico", name: "5° Básico", nivel: "basica", orden: 5 },
  { id: "6-basico", name: "6° Básico", nivel: "basica", orden: 6 },
  { id: "7-basico", name: "7° Básico", nivel: "basica", orden: 7 },
  { id: "8-basico", name: "8° Básico", nivel: "basica", orden: 8 },
  { id: "1-medio", name: "I° Medio", nivel: "media", orden: 9 },
  { id: "2-medio", name: "II° Medio", nivel: "media", orden: 10 },
  { id: "3-medio", name: "III° Medio", nivel: "media", orden: 11 },
  { id: "4-medio", name: "IV° Medio", nivel: "media", orden: 12 },
];

export const config: DemoConfig = {
  unitPrice: 5200,
  discountPercent: 10,
  bookingCutoff: "12:00",
  cutoffMode: "automatico",
};

const firstNames = [
  "Amanda", "Baltazar", "Colomba", "Domingo", "Esperanza", "Fabián", "Genoveva", "Horacio",
  "Ignacia", "Jerónimo", "Karen", "Leonor", "Maximiliano", "Nicole", "Osvaldo", "Paulina",
  "Quintín", "Rocío", "Segundo", "Tamara", "Ulises", "Valeska", "Wladimir", "Ximena",
  "Yolanda", "Zacarías", "Abigail", "Bernardo", "Carola", "Diego", "Estefanía", "Franco",
  "Graciela", "Hernán", "Iris", "Jocelyn", "Kevin", "Loreto", "Mauricio", "Natalia",
];

const surnames = [
  "Aguayo Rivas", "Barrientos Soto", "Contreras Muñoz", "Duarte León", "Escobar Pino",
  "Figueroa Ramos", "Guzmán Cortés", "Henríquez Bravo", "Iturra Campos", "Jofré Vega",
  "Klein Alarcón", "Lira Fuenzalida", "Medina Toledo", "Núñez Sepúlveda", "Ojeda Carrasco",
  "Peña Salazar", "Quezada Bustos", "Rojas Fuentes", "Silva Cornejo", "Torres Gajardo",
];

function studentsForColegio(colegioId: ColegioId, offset: number): Estudiante[] {
  const list: Estudiante[] = [];
  cursos.forEach((curso, cursoIndex) => {
    for (let n = 0; n < 15; n += 1) {
      const globalIndex = cursoIndex * 15 + n;
      const id = `${colegioId}-${curso.id}-${n + 1}`;
      const name = `${firstNames[(globalIndex + offset) % firstNames.length]} ${surnames[(globalIndex * 3 + offset) % surnames.length]}`;
      list.push({
        id,
        name,
        colegioId,
        cursoId: curso.id,
        apoderadoName: `${firstNames[(globalIndex + offset + 11) % firstNames.length]} ${surnames[(globalIndex * 5 + offset + 2) % surnames.length]}`,
      });
    }
  });
  return list;
}

export const estudiantes: Estudiante[] = [
  ...studentsForColegio("san-isidro", 0),
  ...studentsForColegio("la-cruz", 13),
];

// Estudiante insignia usado en el ejemplo textual del propio SPEC (secciones 2.3/2.4/4.4):
// "Martín Pérez — 7°A", con 3 consumos pendientes por $15.600 en total.
export const flagshipDebtorId = "san-isidro-7-basico-1";
(() => {
  const student = estudiantes.find((item) => item.id === flagshipDebtorId);
  if (student) {
    student.name = "Martín Pérez Salinas";
    student.apoderadoName = "Carolina Salinas Rojas";
  }
})();

export const cursoLabel = (colegioId: ColegioId, cursoId: string) => {
  const curso = cursos.find((item) => item.id === cursoId);
  return curso ? `${curso.name}${colegioId === "san-isidro" ? "A" : "B"}` : cursoId;
};

// ---- Funcionarios (mock, coherente por sede y derivado a totales mensuales) ----

const funcionariosBase: Record<ColegioId, number> = { "san-isidro": 80, "la-cruz": 65 };

export const funcionariosPorDia: FuncionariosDia[] = colegios.flatMap((colegio) =>
  menuAgosto.map((dia, index) => ({
    colegioId: colegio.id,
    date: dia.date,
    cantidad: funcionariosBase[colegio.id] + ((index * 3) % 9) - 4,
  })),
);

export const funcionariosHoy = (colegioId: ColegioId | "todos") =>
  funcionariosPorDia
    .filter((item) => item.date === DEMO_TODAY && (colegioId === "todos" || item.colegioId === colegioId))
    .reduce((sum, item) => sum + item.cantidad, 0);

export const funcionariosMes = (colegioId: ColegioId | "todos") =>
  funcionariosPorDia
    .filter((item) => colegioId === "todos" || item.colegioId === colegioId)
    .reduce((sum, item) => sum + item.cantidad, 0);

// ---- Datos semilla: Almuerzos + Compras + Entregas ----

const menuByDate = new Map(menuAgosto.map((dia) => [dia.date, dia]));

let almuerzoSeq = 0;
function createAlmuerzo(
  studentId: string,
  colegioId: ColegioId,
  date: string,
  platoIndex: number,
  postreIndex: number,
  source: "online" | "manual",
  paymentStatus: "pagado" | "pendiente",
  purchaseId: string | null,
): Almuerzo {
  const dia = menuByDate.get(date)!;
  const platoOpt = dia.platos[platoIndex % dia.platos.length];
  const postreOpt = dia.postres[postreIndex % dia.postres.length];
  almuerzoSeq += 1;
  return {
    id: `almuerzo-${almuerzoSeq}`,
    studentId,
    colegioId,
    date,
    platoId: platoOpt.id,
    platoNombre: platoOpt.name,
    platoVegetariano: platoOpt.vegetariano,
    postreId: postreOpt.id,
    postreNombre: postreOpt.name,
    unitPrice: config.unitPrice,
    source,
    paymentStatus,
    purchaseId,
    createdAt: new Date(`${date}T09:00:00-04:00`).toISOString(),
  };
}

let compraSeq = 0;
function createCompra(
  studentId: string,
  colegioId: ColegioId,
  almuerzos: Almuerzo[],
  fullMonth: boolean,
): Compra {
  compraSeq += 1;
  const subtotal = almuerzos.reduce((sum, item) => sum + item.unitPrice, 0);
  const discountAmount = fullMonth ? Math.round((subtotal * config.discountPercent) / 100) : 0;
  const compra: Compra = {
    id: `compra-${compraSeq}`,
    studentId,
    colegioId,
    purchasedAt: new Date(`${almuerzos[0].date}T08:30:00-04:00`).toISOString(),
    almuerzoIds: almuerzos.map((item) => item.id),
    subtotal,
    discountApplied: fullMonth,
    discountAmount,
    total: subtotal - discountAmount,
  };
  almuerzos.forEach((item) => {
    item.purchaseId = compra.id;
  });
  return compra;
}

function buildSeedForColegio(colegioId: ColegioId, students: Estudiante[]) {
  const almuerzos: Almuerzo[] = [];
  const compras: Compra[] = [];
  const deliveries: Record<string, string> = {};

  const deliveryKey = (studentId: string, date: string) => `${studentId}__${date}`;

  // 1) Un caso de compra completa del mes con 10% de descuento demo.
  const fullMonthStudent = students[0];
  const fullMonthLunches = todosLosDiasHabilesAgosto.map((date, index) =>
    createAlmuerzo(fullMonthStudent.id, colegioId, date, index, index + 1, "online", "pagado", null),
  );
  almuerzos.push(...fullMonthLunches);
  compras.push(createCompra(fullMonthStudent.id, colegioId, fullMonthLunches, true));
  // Ya entregado en un par de días pasados de esa misma semana, para variedad.
  deliveries[deliveryKey(fullMonthStudent.id, "2026-08-10")] = new Date("2026-08-10T13:05:00-04:00").toISOString();
  deliveries[deliveryKey(fullMonthStudent.id, "2026-08-11")] = new Date("2026-08-11T13:02:00-04:00").toISOString();

  // 2) Hoy: pagado, pendiente de entrega (8 estudiantes).
  const pagadoPendienteEntrega = students.slice(1, 9);
  pagadoPendienteEntrega.forEach((student, index) => {
    const lunch = createAlmuerzo(student.id, colegioId, DEMO_TODAY, index, index + 2, "online", "pagado", null);
    almuerzos.push(lunch);
    compras.push(createCompra(student.id, colegioId, [lunch], false));
  });

  // 3) Hoy: pagado y ya entregado (8 estudiantes).
  const pagadoEntregado = students.slice(9, 17);
  pagadoEntregado.forEach((student, index) => {
    const lunch = createAlmuerzo(student.id, colegioId, DEMO_TODAY, index + 1, index, "online", "pagado", null);
    almuerzos.push(lunch);
    compras.push(createCompra(student.id, colegioId, [lunch], false));
    deliveries[deliveryKey(student.id, DEMO_TODAY)] = new Date(`${DEMO_TODAY}T12:${30 + index}:00-04:00`).toISOString();
  });

  // 4) Hoy: entregado sin pago -> deuda (7 estudiantes, uno de ellos el caso insignia del SPEC).
  const entregadoSinPago = students.slice(17, 24);
  entregadoSinPago.forEach((student, index) => {
    const lunch = createAlmuerzo(student.id, colegioId, DEMO_TODAY, index + 2, index + 3, "manual", "pendiente", null);
    almuerzos.push(lunch);
    deliveries[deliveryKey(student.id, DEMO_TODAY)] = new Date(`${DEMO_TODAY}T13:${10 + index}:00-04:00`).toISOString();
  });

  // 5) Caso insignia citado por el propio SPEC (4.4): 3 consumos pendientes, $15.600 en total,
  //    en las fechas 10, 12 y 18 de agosto — solo para San Isidro (7° Básico A).
  if (colegioId === "san-isidro") {
    const debtDates = ["2026-08-10", "2026-08-12", "2026-08-18"];
    debtDates.forEach((date, index) => {
      const lunch = createAlmuerzo(flagshipDebtorId, colegioId, date, index, index + 1, "manual", "pendiente", null);
      almuerzos.push(lunch);
      deliveries[deliveryKey(flagshipDebtorId, date)] = new Date(`${date}T13:20:00-04:00`).toISOString();
    });
  }

  // 6) Compras multi-día repartidas en el mes (3, 8 y 12 días) para varios estudiantes,
  //    dando volumen a Pagos/Administración más allá de "hoy".
  const multiDayStudents = students.slice(24, 40);
  const dayCounts = [3, 8, 12];
  multiDayStudents.forEach((student, index) => {
    const count = dayCounts[index % dayCounts.length];
    const dates = todosLosDiasHabilesAgosto.filter((_, dateIndex) => dateIndex % Math.ceil(21 / count) === index % 3).slice(0, count);
    if (dates.length === 0) return;
    const lunches = dates.map((date, dateIndex) =>
      createAlmuerzo(student.id, colegioId, date, dateIndex + index, dateIndex + index + 1, "online", "pagado", null),
    );
    almuerzos.push(...lunches);
    compras.push(createCompra(student.id, colegioId, lunches, false));
    // Marca como entregados los que ya son fechas pasadas respecto a "hoy".
    lunches.forEach((lunch) => {
      if (lunch.date < DEMO_TODAY) {
        deliveries[deliveryKey(student.id, lunch.date)] = new Date(`${lunch.date}T13:00:00-04:00`).toISOString();
      }
    });
  });

  // El resto de la nómina (students.slice(40)) queda deliberadamente sin compras registradas,
  // para representar el caso "estudiante sin compra" en Cocina/Administración.

  return { almuerzos, compras, deliveries };
}

const sanIsidroSeed = buildSeedForColegio("san-isidro", estudiantes.filter((item) => item.colegioId === "san-isidro"));
const laCruzSeed = buildSeedForColegio("la-cruz", estudiantes.filter((item) => item.colegioId === "la-cruz"));

export const initialAlmuerzos: Almuerzo[] = [...sanIsidroSeed.almuerzos, ...laCruzSeed.almuerzos];
export const initialCompras: Compra[] = [...sanIsidroSeed.compras, ...laCruzSeed.compras];
export const initialDeliveries: Record<string, string> = {
  ...sanIsidroSeed.deliveries,
  ...laCruzSeed.deliveries,
};
