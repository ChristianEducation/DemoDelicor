import { estudiantes } from "@/data/delicor-data";
import { contarPlatosYPostres, deudasPorEstudiante, deliveryKey } from "@/lib/operations";
import type { Almuerzo, ColegioId, Compra } from "@/types";

export type ColegioFilter = ColegioId | "todos";

const byColegio = <T extends { colegioId: ColegioId }>(items: T[], filter: ColegioFilter) =>
  filter === "todos" ? items : items.filter((item) => item.colegioId === filter);

export interface ResumenGeneral {
  ingresosDelMes: number;
  almuerzosPagados: number;
  montoPendienteCobro: number;
  entregadosHoy: number;
  alumnosActivos: number;
}

export function resumenGeneral(
  compras: Compra[],
  almuerzos: Almuerzo[],
  deliveries: Record<string, string>,
  filter: ColegioFilter,
  today: string,
): ResumenGeneral {
  const comprasFiltradas = byColegio(compras, filter);
  const almuerzosFiltrados = byColegio(almuerzos, filter);
  const deudas = deudasPorEstudiante(almuerzosFiltrados, deliveries);
  const entregadosHoy = almuerzosFiltrados.filter((item) => item.date === today && deliveries[deliveryKey(item.studentId, item.date)]).length;

  return {
    ingresosDelMes: comprasFiltradas.reduce((sum, item) => sum + item.total, 0),
    almuerzosPagados: almuerzosFiltrados.filter((item) => item.paymentStatus === "pagado").length,
    montoPendienteCobro: deudas.reduce((sum, item) => sum + item.total, 0),
    entregadosHoy,
    alumnosActivos: filter === "todos" ? estudiantes.length : estudiantes.filter((item) => item.colegioId === filter).length,
  };
}

export interface OperacionHoy {
  pagadosReservados: number;
  entregados: number;
  pendientesDeEntregar: number;
  entregadosSinPago: number;
  platos: ReturnType<typeof contarPlatosYPostres>["platos"];
  postres: ReturnType<typeof contarPlatosYPostres>["postres"];
}

export function operacionDeHoy(almuerzos: Almuerzo[], deliveries: Record<string, string>, filter: ColegioFilter, today: string): OperacionHoy {
  const hoy = byColegio(almuerzos, filter).filter((item) => item.date === today);
  const entregadosHoy = hoy.filter((item) => deliveries[deliveryKey(item.studentId, item.date)]);
  const { platos, postres } = contarPlatosYPostres(hoy);
  return {
    pagadosReservados: hoy.filter((item) => item.paymentStatus === "pagado").length,
    entregados: entregadosHoy.length,
    pendientesDeEntregar: hoy.length - entregadosHoy.length,
    entregadosSinPago: entregadosHoy.filter((item) => item.paymentStatus === "pendiente").length,
    platos,
    postres,
  };
}
